import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  MessageSquare,
  Settings,
  Menu,
  X,
  Zap,
  Download,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/store/chatStore";
import { ChatListItem } from "./ChatListItem";
import { cn } from "@/lib/utils";
import { ChatSession } from "@/types/chat";
import { exportAllChats, importChats } from "@/lib/export";
import toast from "react-hot-toast";

interface SidebarProps {
  onNewChat: () => void;
  onNewProvider: () => void;
  onSettingsOpen: () => void;
  onEditChat: (chat: ChatSession) => void;
}

export function Sidebar({
  onNewChat,
  onNewProvider,
  onSettingsOpen,
  onEditChat,
}: SidebarProps) {
  const { chats, currentChatId, setCurrentChat, loadChats } = useChatStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    try {
      await exportAllChats();
      toast.success("Chats exported successfully");
    } catch (error) {
      toast.error("Failed to export chats");
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const count = await importChats(file);
      await loadChats();
      toast.success(`Imported ${count} chat(s) successfully`);
    } catch (error) {
      toast.error("Failed to import chats");
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      {}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "fixed z-50 bg-background/80 backdrop-blur-sm shadow-md hover:bg-background",
          isCollapsed ? "top-4 left-4" : "top-4 left-[264px] lg:left-4"
        )}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
      </Button>

      {}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      <motion.aside
        initial={false}
        animate={{
          x: isCollapsed ? -280 : 0,
          opacity: isCollapsed ? 0 : 1,
        }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className={cn(
          "h-screen glass-effect border-r flex flex-col overflow-hidden w-[280px]",
          "fixed lg:relative z-40"
        )}
      >
        <div className="p-2 sm:p-3 md:p-4 border-b space-y-1.5 sm:space-y-2">
          <Button
            onClick={onNewChat}
            className="w-full text-xs sm:text-sm h-8 sm:h-9"
            size="sm"
          >
            <Plus className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            New Chat
          </Button>
          <Button
            onClick={onNewProvider}
            variant="outline"
            className="w-full text-xs sm:text-sm h-8 sm:h-9"
            size="sm"
          >
            <Zap className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            Add AI Provider
          </Button>
          <div className="flex gap-1.5 sm:gap-2">
            <Button
              onClick={handleExport}
              variant="outline"
              className="flex-1 text-xs sm:text-sm h-8 sm:h-9 px-2"
              size="sm"
            >
              <Download className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
              Export
            </Button>
            <Button
              onClick={handleImportClick}
              variant="outline"
              className="flex-1 text-xs sm:text-sm h-8 sm:h-9 px-2"
              size="sm"
            >
              <Upload className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
              Import
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </div>

        <ScrollArea className="flex-1 px-1.5 sm:px-2">
          <div className="space-y-1 py-2">
            {chats.map((chat) => (
              <ChatListItem
                key={chat.id}
                chat={chat}
                isActive={chat.id === currentChatId}
                onClick={() => setCurrentChat(chat.id)}
                onEdit={() => onEditChat(chat)}
              />
            ))}
            {chats.length === 0 && (
              <div className="text-center text-muted-foreground py-8 px-2 sm:px-4 text-xs sm:text-sm">
                <MessageSquare className="mx-auto mb-2 h-6 w-6 sm:h-8 sm:w-8 opacity-50" />
                No chats yet. Create one to get started!
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-2 sm:p-3 md:p-4 border-t">
          <Button
            variant="ghost"
            onClick={onSettingsOpen}
            className="w-full justify-start text-xs sm:text-sm h-8 sm:h-9"
            size="sm"
          >
            <Settings className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            Settings
          </Button>
        </div>
      </motion.aside>
    </>
  );
}
