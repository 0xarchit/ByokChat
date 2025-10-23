"use client";
import { create } from "zustand";
import { Settings } from "@/types/chat";
import { settingsDB } from "@/lib/db";

interface SettingsStore extends Settings {
  loadSettings: () => Promise<void>;
  updateSettings: (settings: Partial<Settings>) => Promise<void>;
}

const defaultSettings: Settings = {
  theme: "dark",
  summarizeAfter: 20,
  retainMessages: 10,
  temperature: undefined,
  maxTokens: undefined,
};

export const useSettingsStore = create<SettingsStore>((set) => ({
  ...defaultSettings,

  loadSettings: async () => {
    const settings = await settingsDB.getItem<Settings>("settings");
    set(settings || defaultSettings);
  },

  updateSettings: async (newSettings) => {
    set((state) => {
      const updated = { ...state, ...newSettings };
      settingsDB.setItem("settings", {
        theme: updated.theme,
        summarizeAfter: updated.summarizeAfter,
        retainMessages: updated.retainMessages,
        temperature: updated.temperature,
        maxTokens: updated.maxTokens,
      });
      return updated;
    });
  },
}));
