import { chatsDB, messagesDB } from "./db";
import { ChatSession, Message } from "@/types/chat";

export interface IndividualChatExport {
  version: string;
  exportDate: number;
  chat: ChatSession;
  messages: Message[];
}

export async function exportIndividualChat(chatId: string): Promise<void> {
  try {
    const chat = await chatsDB.getItem<ChatSession>(chatId);
    if (!chat) {
      throw new Error("Chat not found");
    }

    const messages = (await messagesDB.getItem<Message[]>(chatId)) || [];

    const exportData: IndividualChatExport = {
      version: "1.0",
      exportDate: Date.now(),
      chat,
      messages,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const fileName = chat.name.replace(/[^a-z0-9]/gi, "-").toLowerCase();
    link.download = `chat-${fileName}-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Export failed:", error);
    throw new Error("Failed to export chat");
  }
}

export async function importIndividualChat(file: File): Promise<string | null> {
  try {
    const text = await file.text();
    const data: IndividualChatExport = JSON.parse(text);

    if (!data.version || !data.chat || !data.messages) {
      throw new Error("Invalid import file format");
    }

    const existingChat = await chatsDB.getItem<ChatSession>(data.chat.id);

    if (existingChat) {
      throw new Error("Chat with this ID already exists");
    }

    await chatsDB.setItem(data.chat.id, data.chat);
    await messagesDB.setItem(data.chat.id, data.messages);

    return data.chat.id;
  } catch (error) {
    console.error("Import failed:", error);
    throw error instanceof Error ? error : new Error("Failed to import chat");
  }
}
