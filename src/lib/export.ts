import { chatsDB, messagesDB } from "./db";
import { ChatSession, Message } from "@/types/chat";

export interface ExportData {
  version: string;
  exportDate: number;
  chats: ChatSession[];
  messages: Record<string, Message[]>;
}

export async function exportAllChats(): Promise<void> {
  try {
    const chats: ChatSession[] = [];
    const messages: Record<string, Message[]> = {};

    await chatsDB.iterate<ChatSession, void>((chat) => {
      chats.push(chat);
    });

    for (const chat of chats) {
      const chatMessages = await messagesDB.getItem<Message[]>(chat.id);
      if (chatMessages) {
        messages[chat.id] = chatMessages;
      }
    }

    const exportData: ExportData = {
      version: "1.0",
      exportDate: Date.now(),
      chats,
      messages,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `chat-export-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Export failed:", error);
    throw new Error("Failed to export chats");
  }
}

export async function importChats(file: File): Promise<number> {
  try {
    const text = await file.text();
    const data: ExportData = JSON.parse(text);

    if (!data.version || !data.chats || !data.messages) {
      throw new Error("Invalid import file format");
    }

    let importedCount = 0;

    for (const chat of data.chats) {
      const existingChat = await chatsDB.getItem<ChatSession>(chat.id);

      if (!existingChat) {
        await chatsDB.setItem(chat.id, chat);

        if (data.messages[chat.id]) {
          await messagesDB.setItem(chat.id, data.messages[chat.id]);
        }

        importedCount++;
      }
    }

    return importedCount;
  } catch (error) {
    console.error("Import failed:", error);
    throw new Error("Failed to import chats");
  }
}
