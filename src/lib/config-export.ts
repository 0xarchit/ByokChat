import { providersDB, chatsDB, messagesDB, settingsDB } from "./db";
import { AIProvider, ChatSession, Message } from "@/types/chat";

export interface ExportConfig {
  version: string;
  exportDate: number;
  providers: AIProvider[];
  chats: ChatSession[];
  messages: Record<string, Message[]>;
  settings: any;
}

export async function exportCompleteConfig(): Promise<void> {
  try {
    const providers: AIProvider[] = [];
    await providersDB.iterate<AIProvider, void>((value) => {
      providers.push(value);
    });

    const chats: ChatSession[] = [];
    await chatsDB.iterate<ChatSession, void>((value) => {
      chats.push(value);
    });

    const messages: Record<string, Message[]> = {};
    await messagesDB.iterate<Message[], void>((value, key) => {
      messages[key] = value;
    });

    const settings = await settingsDB.getItem("settings");

    const exportData: ExportConfig = {
      version: "1.0.0",
      exportDate: Date.now(),
      providers,
      chats,
      messages,
      settings: settings || {},
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });

    const fileName = `byok-chat-config-${
      new Date().toISOString().split("T")[0]
    }.json`;

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return;
  } catch (error) {
    console.error("Export failed:", error);
    throw new Error("Failed to export configuration");
  }
}

export async function importCompleteConfig(file: File): Promise<void> {
  try {
    const text = await file.text();
    const config: ExportConfig = JSON.parse(text);

    if (
      !config.version ||
      !config.providers ||
      !config.chats ||
      !config.messages
    ) {
      throw new Error("Invalid configuration file format");
    }

    for (const provider of config.providers) {
      await providersDB.setItem(provider.id, provider);
    }

    for (const chat of config.chats) {
      await chatsDB.setItem(chat.id, chat);
    }

    for (const [chatId, chatMessages] of Object.entries(config.messages)) {
      await messagesDB.setItem(chatId, chatMessages);
    }

    if (config.settings) {
      await settingsDB.setItem("settings", config.settings);
    }

    return;
  } catch (error) {
    console.error("Import failed:", error);
    throw new Error(
      "Failed to import configuration. Please check the file format."
    );
  }
}

export async function exportProvidersOnly(): Promise<void> {
  try {
    const providers: AIProvider[] = [];
    await providersDB.iterate<AIProvider, void>((value) => {
      providers.push(value);
    });

    const exportData = {
      version: "1.0.0",
      exportDate: Date.now(),
      providers,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });

    const fileName = `byok-chat-providers-${
      new Date().toISOString().split("T")[0]
    }.json`;

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return;
  } catch (error) {
    console.error("Export providers failed:", error);
    throw new Error("Failed to export providers");
  }
}

export async function importProvidersOnly(file: File): Promise<void> {
  try {
    const text = await file.text();
    const config = JSON.parse(text);

    if (!config.providers || !Array.isArray(config.providers)) {
      throw new Error("Invalid providers file format");
    }

    for (const provider of config.providers) {
      await providersDB.setItem(provider.id, provider);
    }

    return;
  } catch (error) {
    console.error("Import providers failed:", error);
    throw new Error(
      "Failed to import providers. Please check the file format."
    );
  }
}
