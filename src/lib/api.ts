import { ChatSession, Message, ChatContextMessage } from "@/types/chat";
import { useProviderStore } from "@/store/providerStore";
import { useSettingsStore } from "@/store/settingsStore";

function isCloudflareProvider(provider: any): boolean {
  return !!provider.workerUrl;
}

function getChatEndpoint(provider: any): string {
  if (isCloudflareProvider(provider)) {
    return provider.workerUrl;
  }

  const baseUrl = (provider.baseUrl || provider.apiUrl || "").replace(
    /\/+$/,
    ""
  );
  return baseUrl + "/chat/completions";
}

async function rotateCloudflareIndex(provider: any): Promise<number> {
  if (!isCloudflareProvider(provider) || !provider.maxIndex) {
    return 0;
  }

  const currentIndex = provider.currentIndex || 0;
  const nextIndex = (currentIndex + 1) % provider.maxIndex;

  const { useProviderStore } = await import("@/store/providerStore");
  await useProviderStore.getState().updateProvider(provider.id, {
    currentIndex: nextIndex,
  });

  return currentIndex;
}

export async function sendChatMessage(
  chat: ChatSession,
  userMessage: string,
  messages: Message[]
): Promise<{ content: string; tokenCount?: number }> {
  const { getProvider, rotateKey } = useProviderStore.getState();
  const {
    temperature: globalTemp,
    maxTokens: globalMaxTokens,
    summarizeAfter: globalSummarizeAfter,
  } = useSettingsStore.getState();

  const provider = getProvider(chat.providerId);
  if (!provider || provider.apiKeys.length === 0) {
    throw new Error("No provider or API keys configured");
  }

  const summarizeThreshold = chat.summarizeAfter ?? globalSummarizeAfter ?? 20;
  const contextWindowSize = chat.maxLastMessages ?? 10;

  const nonSystemMessages = messages.filter((m) => m.role !== "system");

  const totalMessages = nonSystemMessages.length;
  const currentBatch = Math.floor(totalMessages / summarizeThreshold);
  const messagesInCurrentBatch = totalMessages % summarizeThreshold;

  const shouldSummarize = messagesInCurrentBatch === 0 && totalMessages > 0;

  const contextMessages: ChatContextMessage[] = [
    { role: "system", content: chat.systemPrompt },
  ];

  let messagesToSend: Message[];

  if (totalMessages < summarizeThreshold) {
    messagesToSend = nonSystemMessages;
  } else {
    const currentBatchStart = currentBatch * summarizeThreshold;
    messagesToSend = nonSystemMessages.slice(currentBatchStart);

    if (chat.summary) {
      contextMessages.push({
        role: "system",
        content: `Previous conversation summary: ${chat.summary}`,
      });
    }
  }

  const recentMessages = messagesToSend.map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  contextMessages.push(...recentMessages);
  contextMessages.push({ role: "user", content: userMessage });

  const requestBody: any = {
    model: chat.model,
    messages: contextMessages,
  };

  const temp = chat.temperature !== undefined ? chat.temperature : globalTemp;
  const tokens =
    chat.maxTokens !== undefined ? chat.maxTokens : globalMaxTokens;

  if (temp !== undefined) {
    requestBody.temperature = temp;
  }

  if (tokens !== undefined) {
    requestBody.max_tokens = tokens;
  }

  let lastError: Error | null = null;
  let attempts = 0;
  const maxAttempts = provider.apiKeys.length;

  const currentKey = provider.apiKeys[provider.currentKeyIndex];

  await rotateKey(chat.providerId);

  while (attempts < maxAttempts) {
    const keyToUse =
      attempts === 0 ? currentKey : provider.apiKeys[provider.currentKeyIndex];

    try {
      const apiUrl = getChatEndpoint(provider);

      let cloudflareIndex = 0;
      if (isCloudflareProvider(provider)) {
        cloudflareIndex = await rotateCloudflareIndex(provider);

        requestBody.index = cloudflareIndex;
      }

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (!isCloudflareProvider(provider)) {
        headers["Authorization"] = `Bearer ${keyToUse}`;
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        if (response.status === 429 || response.status === 401) {
          await rotateKey(chat.providerId);
          attempts++;
          continue;
        }
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} ${errorText}`);
      }

      const data = await response.json();

      let content: string;
      let tokenCount: number | undefined;

      if (isCloudflareProvider(provider)) {
        if (data.output) {
          const messageOutput = data.output.find(
            (o: any) => o.type === "message"
          );
          const textContent = messageOutput?.content?.find(
            (c: any) => c.type === "output_text"
          );
          content = textContent?.text || "No response";
        } else if (data.choices) {
          content = data.choices?.[0]?.message?.content || "No response";
        } else {
          content = "No response";
        }
        tokenCount = data.usage?.total_tokens;
      } else {
        content = data.choices?.[0]?.message?.content || "No response";
        tokenCount = data.usage?.total_tokens;
      }

      if (shouldSummarize) {
        generateSummaryInBackground(
          chat,
          nonSystemMessages,
          summarizeThreshold,
          provider
        ).catch((err) =>
          console.error("Background summarization failed:", err)
        );
      }

      return { content, tokenCount };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown error");
      attempts++;

      if (attempts < maxAttempts) {
        await rotateKey(chat.providerId);
      }
    }
  }

  throw (
    lastError || new Error("Failed to send message after multiple attempts")
  );
}

async function generateSummaryInBackground(
  chat: ChatSession,
  messages: Message[],
  summarizeThreshold: number,
  provider: any
) {
  try {
    console.log(`Starting background summarization for chat ${chat.id}...`);

    const totalMessages = messages.length;
    const completedBatches = Math.floor(totalMessages / summarizeThreshold);

    const messagesToSummarize = messages.slice(
      0,
      completedBatches * summarizeThreshold
    );

    if (messagesToSummarize.length === 0) {
      console.log("No messages to summarize");
      return;
    }

    const conversationText = messagesToSummarize
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n\n");

    const summaryMessages: ChatContextMessage[] = [
      {
        role: "system",
        content:
          "You are a helpful assistant that creates comprehensive yet concise summaries of conversations. Focus on key topics, decisions, important context, and any facts or information that would be useful for continuing the conversation. Keep the summary clear and well-organized.",
      },
    ];

    if (chat.summary) {
      summaryMessages.push({
        role: "user",
        content: `Previous summary:\n${chat.summary}\n\nNew conversation segment:\n${conversationText}\n\nCreate an updated comprehensive summary that merges the previous context with the new conversation. Maintain important details from both.`,
      });
    } else {
      summaryMessages.push({
        role: "user",
        content: `Summarize this conversation:\n\n${conversationText}`,
      });
    }

    const summaryRequest: any = {
      model: chat.model,
      messages: summaryMessages,
      temperature: 0.3,
      max_tokens: 1500,
    };

    const apiUrl = getChatEndpoint(provider);

    if (isCloudflareProvider(provider)) {
      const cloudflareIndex = await rotateCloudflareIndex(provider);
      summaryRequest.index = cloudflareIndex;
    }

    const currentKey = provider.apiKeys[provider.currentKeyIndex];

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (!isCloudflareProvider(provider)) {
      headers["Authorization"] = `Bearer ${currentKey}`;
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(summaryRequest),
    });

    if (response.ok) {
      const data = await response.json();

      let summary: string | undefined;
      if (isCloudflareProvider(provider)) {
        if (data.output) {
          const messageOutput = data.output.find(
            (o: any) => o.type === "message"
          );
          const textContent = messageOutput?.content?.find(
            (c: any) => c.type === "output_text"
          );
          summary = textContent?.text;
        } else if (data.choices) {
          summary = data.choices?.[0]?.message?.content;
        }
      } else {
        summary = data.choices?.[0]?.message?.content;
      }

      if (summary) {
        const { useChatStore } = await import("@/store/chatStore");
        await useChatStore.getState().updateChatSummary(chat.id, summary);
        console.log(
          `✓ Summary updated for chat ${chat.id} (${messagesToSummarize.length} messages summarized)`
        );
      }
    } else {
      const errorText = await response.text();
      console.error("Summary API error:", response.status, errorText);
    }
  } catch (error) {
    console.error("Background summarization error:", error);
  }
}
