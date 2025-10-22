import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { AIProvider } from '@/types/chat';
import { providersDB } from '@/lib/db';

interface ProviderStore {
  providers: AIProvider[];
  
  loadProviders: () => Promise<void>;
  addProvider: (provider: Omit<AIProvider, 'id' | 'createdAt' | 'currentKeyIndex'>) => Promise<string>;
  updateProvider: (id: string, updates: Partial<AIProvider>) => Promise<void>;
  deleteProvider: (id: string) => Promise<void>;
  rotateKey: (providerId: string) => Promise<void>;
  getProvider: (id: string) => AIProvider | undefined;
}

export const useProviderStore = create<ProviderStore>((set, get) => ({
  providers: [],

  loadProviders: async () => {
    const providers: AIProvider[] = [];
    await providersDB.iterate<AIProvider, void>((value) => {
      providers.push(value);
    });
    providers.sort((a, b) => b.createdAt - a.createdAt);
    set({ providers });
  },

  addProvider: async (providerData) => {
    const provider: AIProvider = {
      ...providerData,
      id: nanoid(),
      createdAt: Date.now(),
      currentKeyIndex: 0
    };
    
    await providersDB.setItem(provider.id, provider);
    set((state) => ({ providers: [provider, ...state.providers] }));
    return provider.id;
  },

  updateProvider: async (id, updates) => {
    const provider = await providersDB.getItem<AIProvider>(id);
    if (provider) {
      const updated = { ...provider, ...updates };
      await providersDB.setItem(id, updated);
      set((state) => ({
        providers: state.providers.map((p) => (p.id === id ? updated : p))
      }));
    }
  },

  deleteProvider: async (id) => {
    await providersDB.removeItem(id);
    set((state) => ({
      providers: state.providers.filter((p) => p.id !== id)
    }));
  },

  rotateKey: async (providerId) => {
    const provider = await providersDB.getItem<AIProvider>(providerId);
    if (provider && provider.apiKeys.length > 0) {
      provider.currentKeyIndex = (provider.currentKeyIndex + 1) % provider.apiKeys.length;
      await providersDB.setItem(providerId, provider);
      set((state) => ({
        providers: state.providers.map((p) => (p.id === providerId ? provider : p))
      }));
    }
  },

  getProvider: (id) => {
    return get().providers.find((p) => p.id === id);
  }
}));
