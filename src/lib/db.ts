import localforage from "localforage";

export const chatsDB = localforage.createInstance({
  name: "ai-chatbot",
  storeName: "chats",
});

export const messagesDB = localforage.createInstance({
  name: "ai-chatbot",
  storeName: "messages",
});

export const settingsDB = localforage.createInstance({
  name: "ai-chatbot",
  storeName: "settings",
});

export const providersDB = localforage.createInstance({
  name: "ai-chatbot",
  storeName: "providers",
});
