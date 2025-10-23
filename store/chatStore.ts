"use client";

import { create } from "zustand";
import { nanoid } from "nanoid";
import { ChatSession, Message } from "@/types/chat";
import { chatsDB, messagesDB } from "@/lib/db";

interface ChatStore {
  chats: ChatSession[];
  currentChatId: string | null;
  messages: Record<string, Message[]>;
  isLoading: boolean;

  loadChats: () => Promise<void>;
  createChat: (
    chat: Omit<ChatSession, "id" | "createdAt" | "updatedAt" | "messageCount">
  ) => Promise<string>;
  updateChat: (chatId: string, updates: Partial<ChatSession>) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  setCurrentChat: (chatId: string) => void;

  loadMessages: (chatId: string) => Promise<void>;
  addMessage: (message: Omit<Message, "id" | "timestamp">) => Promise<void>;
  updateChatSummary: (chatId: string, summary: string) => Promise<void>;
  clearMessages: (chatId: string, keepLast: number) => Promise<void>;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: [],
  currentChatId: null,
  messages: {},
  isLoading: false,

  loadChats: async () => {
    const chats: ChatSession[] = [];
    await chatsDB.iterate<ChatSession, void>((value) => {
      chats.push(value);
    });
    chats.sort((a, b) => b.updatedAt - a.updatedAt);
    set({ chats });
  },

  createChat: async (chatData) => {
    const chat: ChatSession = {
      ...chatData,
      id: nanoid(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messageCount: 0,
    };

    await chatsDB.setItem(chat.id, chat);
    set((state) => ({ chats: [chat, ...state.chats], currentChatId: chat.id }));
    return chat.id;
  },

  updateChat: async (chatId, updates) => {
    const chat = await chatsDB.getItem<ChatSession>(chatId);
    if (chat) {
      const updated = { ...chat, ...updates, updatedAt: Date.now() };
      await chatsDB.setItem(chatId, updated);
      set((state) => ({
        chats: state.chats.map((c) => (c.id === chatId ? updated : c)),
      }));
    }
  },

  deleteChat: async (chatId) => {
    await chatsDB.removeItem(chatId);
    await messagesDB.removeItem(chatId);
    set((state) => ({
      chats: state.chats.filter((c) => c.id !== chatId),
      currentChatId:
        state.currentChatId === chatId ? null : state.currentChatId,
      messages: { ...state.messages, [chatId]: undefined },
    }));
  },

  setCurrentChat: (chatId) => {
    set({ currentChatId: chatId });
    get().loadMessages(chatId);
  },

  loadMessages: async (chatId) => {
    const messages = await messagesDB.getItem<Message[]>(chatId);
    set((state) => ({
      messages: { ...state.messages, [chatId]: messages || [] },
    }));
  },

  addMessage: async (messageData) => {
    const message: Message = {
      ...messageData,
      id: nanoid(),
      timestamp: Date.now(),
    };

    const chatId = message.chatId;
    const currentMessages = get().messages[chatId] || [];
    const updatedMessages = [...currentMessages, message];

    await messagesDB.setItem(chatId, updatedMessages);

    const chat = await chatsDB.getItem<ChatSession>(chatId);
    if (chat) {
      chat.messageCount = updatedMessages.filter(
        (m) => m.role !== "system"
      ).length;
      chat.updatedAt = Date.now();
      await chatsDB.setItem(chatId, chat);

      set((state) => ({
        messages: { ...state.messages, [chatId]: updatedMessages },
        chats: state.chats.map((c) => (c.id === chatId ? chat : c)),
      }));
    }
  },

  updateChatSummary: async (chatId, summary) => {
    const chat = await chatsDB.getItem<ChatSession>(chatId);
    if (chat) {
      chat.summary = summary;
      await chatsDB.setItem(chatId, chat);
      set((state) => ({
        chats: state.chats.map((c) => (c.id === chatId ? chat : c)),
      }));
    }
  },

  clearMessages: async (chatId, keepLast) => {
    const messages = await messagesDB.getItem<Message[]>(chatId);
    if (messages && messages.length > keepLast) {
      const kept = messages.slice(-keepLast);
      await messagesDB.setItem(chatId, kept);
      set((state) => ({
        messages: { ...state.messages, [chatId]: kept },
      }));
    }
  },
}));
