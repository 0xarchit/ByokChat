import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Sidebar } from '@/components/Sidebar';
import { ChatWindow } from '@/components/ChatWindow';
import { NewChatDialog } from '@/components/NewChatDialog';
import { AddProviderDialog } from '@/components/AddProviderDialog';
import { EditChatDialog } from '@/components/EditChatDialog';
import { SettingsDialog } from '@/components/SettingsDialog';
import { useChatStore } from '@/store/chatStore';
import { useProviderStore } from '@/store/providerStore';
import { useSettingsStore } from '@/store/settingsStore';
import { ChatSession } from '@/types/chat';

const Index = () => {
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [newProviderOpen, setNewProviderOpen] = useState(false);
  const [editChatOpen, setEditChatOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [chatToEdit, setChatToEdit] = useState<ChatSession | null>(null);
  
  const { loadChats } = useChatStore();
  const { loadProviders } = useProviderStore();
  const { loadSettings, theme } = useSettingsStore();

  useEffect(() => {
    loadChats();
    loadProviders();
    loadSettings();
  }, [loadChats, loadProviders, loadSettings]);

  const handleEditChat = (chat: ChatSession) => {
    setChatToEdit(chat);
    setEditChatOpen(true);
  };

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark', 'cyber-aurora');
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <div className="flex h-screen overflow-hidden w-full max-w-full">
      <Toaster position="top-right" />
      
      <Sidebar
        onNewChat={() => setNewChatOpen(true)}
        onNewProvider={() => setNewProviderOpen(true)}
        onSettingsOpen={() => setSettingsOpen(true)}
        onEditChat={handleEditChat}
      />
      
      <ChatWindow />
      
      <NewChatDialog open={newChatOpen} onOpenChange={setNewChatOpen} />
      <AddProviderDialog open={newProviderOpen} onOpenChange={setNewProviderOpen} />
      <EditChatDialog open={editChatOpen} onOpenChange={setEditChatOpen} chat={chatToEdit} />
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
};

export default Index;
