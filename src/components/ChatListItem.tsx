import { MessageSquare, Trash2, Edit, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatSession } from "@/types/chat";
import { useChatStore } from "@/store/chatStore";
import { cn } from "@/lib/utils";
import {
  exportIndividualChat,
  importIndividualChat,
} from "@/lib/individual-export";
import toast from "react-hot-toast";
import { useRef } from "react";

interface ChatListItemProps {
  chat: ChatSession;
  isActive: boolean;
  onClick: () => void;
  onEdit: () => void;
}

export function ChatListItem({
  chat,
  isActive,
  onClick,
  onEdit,
}: ChatListItemProps) {
  const { deleteChat, loadChats } = useChatStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete "${chat.name}"?`)) {
      deleteChat(chat.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  };

  const handleExport = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await exportIndividualChat(chat.id);
      toast.success("Chat exported successfully");
    } catch (error) {
      toast.error("Failed to export chat");
    }
  };

  const handleImportClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await importIndividualChat(file);
      await loadChats();
      toast.success("Chat imported successfully");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to import chat";
      toast.error(message);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors",
        isActive ? "bg-primary/10 text-primary" : "hover:bg-muted/50"
      )}
    >
      <MessageSquare className="h-4 w-4 shrink-0" />
      <span className="flex-1 truncate text-sm">{chat.name}</span>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={handleExport}
          title="Export chat"
        >
          <Download className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={handleEdit}
          title="Edit chat"
        >
          <Edit className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={handleDelete}
          title="Delete chat"
        >
          <Trash2 className="h-3 w-3" />
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
  );
}
