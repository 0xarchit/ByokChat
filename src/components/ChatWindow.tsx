import { useState, useRef, useEffect } from "react";
import { Send, Loader2, StopCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChatStore } from "@/store/chatStore";
import { MessageBubble } from "./MessageBubble";
import { sendChatMessage } from "@/lib/api";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

export function ChatWindow() {
  const { currentChatId, messages, chats, addMessage } = useChatStore();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentChat = chats.find((c) => c.id === currentChatId);
  const currentMessages = currentChatId ? messages[currentChatId] || [] : [];

  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current;
      scrollElement.scrollTo({
        top: scrollElement.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [currentMessages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || !currentChatId || !currentChat || isLoading) return;

    const userMessage = input.trim();

    if (
      currentChat.maxInputCharacters &&
      userMessage.length > currentChat.maxInputCharacters
    ) {
      toast.error(
        `Message exceeds character limit of ${currentChat.maxInputCharacters}`
      );
      return;
    }

    if (currentChat.maxInputWords) {
      const wordCount = userMessage
        .split(/\s+/)
        .filter((w) => w.length > 0).length;
      if (wordCount > currentChat.maxInputWords) {
        toast.error(
          `Message exceeds word limit of ${currentChat.maxInputWords}`
        );
        return;
      }
    }

    setInput("");
    setIsLoading(true);

    try {
      await addMessage({
        chatId: currentChatId,
        role: "user",
        content: userMessage,
      });

      const response = await sendChatMessage(
        currentChat,
        userMessage,
        currentMessages
      );

      await addMessage({
        chatId: currentChatId,
        role: "assistant",
        content: response.content,
        tokenCount: response.tokenCount,
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send message"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!currentChatId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center space-y-4 px-4 max-w-md">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <Send className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
            Welcome to AI Chat
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Select a chat from the sidebar or create a new one to start your
            conversation
          </p>
        </div>
      </div>
    );
  }

  const getInputLimitText = () => {
    const parts = [];
    if (currentChat?.maxInputCharacters) {
      parts.push(`${input.length}/${currentChat.maxInputCharacters} chars`);
    }
    if (currentChat?.maxInputWords) {
      const wordCount = input.split(/\s+/).filter((w) => w.length > 0).length;
      parts.push(`${wordCount}/${currentChat.maxInputWords} words`);
    }
    return parts.length > 0 ? parts.join(" • ") : "";
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-background relative">
      {}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <h2 className="font-semibold text-sm sm:text-base truncate text-foreground">
            {currentChat?.name || "Chat"}
          </h2>
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {currentChat?.model}
          </p>
        </div>
      </div>

      {}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6">
          {currentMessages.length === 0 ? (
            <div className="flex items-center justify-center h-full min-h-[300px]">
              <div className="text-center space-y-3 text-muted-foreground">
                <p className="text-sm sm:text-base">No messages yet</p>
                <p className="text-xs sm:text-sm">Start a conversation below</p>
              </div>
            </div>
          ) : (
            currentMessages
              .filter((m) => m.role !== "system")
              .map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))
          )}
          {isLoading && (
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {}
      <div className="border-t bg-background sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          {getInputLimitText() && (
            <div className="text-xs text-muted-foreground mb-2 text-right">
              {getInputLimitText()}
            </div>
          )}
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message AI..."
              className={cn(
                "resize-none pr-12 sm:pr-14 min-h-[52px] max-h-[200px]",
                "text-sm sm:text-base",
                "rounded-2xl sm:rounded-3xl",
                "border-2 focus:border-primary",
                "transition-all duration-200",
                "bg-background"
              )}
              rows={1}
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              size="icon"
              className={cn(
                "absolute right-2 bottom-2",
                "rounded-full w-8 h-8 sm:w-9 sm:h-9",
                "transition-all duration-200",
                !input.trim() && !isLoading && "opacity-50"
              )}
            >
              {isLoading ? (
                <StopCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </Button>
          </div>
          <p className="text-[10px] sm:text-xs text-muted-foreground text-center mt-3">
            AI can make mistakes. Check important info.
          </p>
        </div>
      </div>
    </div>
  );
}
