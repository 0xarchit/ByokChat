export interface Message {
  id: string;
  chatId: string;
  role: "system" | "user" | "assistant";
  content: string;
  timestamp: number;
  tokenCount?: number;
}

export interface AIProvider {
  id: string;
  name: string;
  apiUrl: string;
  baseUrl?: string;
  apiKeys: string[];

  workerUrl?: string;
  maxIndex?: number;
  currentIndex?: number;
  models: string[];
  createdAt: number;
  currentKeyIndex: number;
}

export interface ChatSession {
  id: string;
  name: string;
  providerId: string;
  model: string;
  systemPrompt: string;
  temperature?: number;
  maxTokens?: number;
  createdAt: number;
  updatedAt: number;
  summary?: string;
  messageCount: number;
  maxInputTokens?: number;
  maxLastMessages?: number;
  maxInputCharacters?: number;
  maxInputWords?: number;
  summarizeAfter?: number;
}

export interface APIKey {
  id: string;
  provider: string;
  key: string;
  name: string;
  isActive: boolean;
  errorCount: number;
  lastUsed?: number;
}

export interface Settings {
  theme: "light" | "dark" | "cyber-aurora";
  summarizeAfter: number;
  retainMessages: number;
  temperature?: number;
  maxTokens?: number;
}

export interface ChatContextMessage {
  role: "system" | "user" | "assistant";
  content: string;
}
