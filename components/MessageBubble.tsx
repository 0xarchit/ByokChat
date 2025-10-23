import { memo, useState } from "react";
import { motion } from "framer-motion";
import { Copy, Trash2, Check, User, Bot } from "lucide-react";
import { Message, ChatSession } from "@/types/chat";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { Button } from "./ui/button";
import { useChatStore } from "@/store/chatStore";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = memo(
  function MessageBubble({ message }: MessageBubbleProps) {
    const isUser = message.role === "user";
    const [copied, setCopied] = useState(false);
    const { messages, currentChatId } = useChatStore();

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(message.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success("Copied to clipboard");
      } catch (error) {
        toast.error("Failed to copy");
      }
    };

    const handleDelete = async () => {
      if (!currentChatId) return;

      if (confirm("Delete this message?")) {
        try {
          const currentMessages = messages[currentChatId] || [];
          const updatedMessages = currentMessages.filter(
            (m) => m.id !== message.id
          );

          const { messagesDB, chatsDB } = await import("@/lib/db");

          await messagesDB.setItem(currentChatId, updatedMessages);

          const chat = await chatsDB.getItem<ChatSession>(currentChatId);
          if (chat) {
            chat.messageCount = updatedMessages.filter(
              (m: Message) => m.role !== "system"
            ).length;
            chat.updatedAt = Date.now();
            await chatsDB.setItem(currentChatId, chat);

            const { useChatStore } = await import("@/store/chatStore");
            useChatStore.setState((state) => ({
              messages: { ...state.messages, [currentChatId]: updatedMessages },
              chats: state.chats.map((c) =>
                c.id === currentChatId ? chat : c
              ),
            }));
          }

          toast.success("Message deleted");
        } catch (error) {
          toast.error("Failed to delete message");
        }
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "group/message w-full",
          isUser ? "bg-transparent" : "bg-muted/30"
        )}
      >
        <div className="max-w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex items-start gap-3 sm:gap-4">
            {}
            <div
              className={cn(
                "w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0",
                isUser
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted border border-border"
              )}
            >
              {isUser ? (
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </div>

            {}
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">
                  {isUser ? "You" : "AI"}
                </span>
              </div>

              <div
                className={cn(
                  "prose prose-sm sm:prose-base dark:prose-invert max-w-none",
                  "text-foreground leading-relaxed",
                  "[&>*]:my-2 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                )}
              >
                {isUser ? (
                  <div className="whitespace-pre-wrap break-words text-sm sm:text-base">
                    {message.content}
                  </div>
                ) : (
                  <div className="w-full overflow-hidden">
                    <MarkdownRenderer content={message.content} />
                  </div>
                )}
              </div>

              {}
              {message.tokenCount && (
                <div className="text-xs text-muted-foreground pt-1">
                  {message.tokenCount.toLocaleString()} tokens
                </div>
              )}

              {}
              <div className="flex items-center gap-1 pt-1 opacity-0 group-hover/message:opacity-100 transition-opacity duration-200">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs hover:bg-muted"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 mr-1 text-green-600" />
                      <span className="hidden sm:inline">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 mr-1" />
                      <span className="hidden sm:inline">Copy</span>
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs text-destructive hover:bg-destructive/10"
                  onClick={handleDelete}
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  <span className="hidden sm:inline">Delete</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.message.id === nextProps.message.id &&
      prevProps.message.content === nextProps.message.content &&
      prevProps.message.tokenCount === nextProps.message.tokenCount
    );
  }
);
