import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChatWindow } from './ChatWindow';
import { cn } from '@/lib/utils';
import { MessageCircle, X, Minimize2, Maximize2, Bot } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ChatToggleProps {
  className?: string;
}

export const ChatToggle = ({ className }: ChatToggleProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const isMobile = useIsMobile();

  if (!isOpen) {
    return (
      <div className={cn("relative", className)}>
        <Button
          size="icon"
          onClick={() => setIsOpen(true)}
          className={cn(
            "fixed bottom-6 right-6 z-[9999] h-14 w-14 rounded-full shadow-elegant",
            "bg-primary hover:bg-primary/90 transition-all duration-300",
            "hover:shadow-glow hover:scale-105"
          )}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  // Chat Window
  return (
    <div
      className={cn(
        "fixed z-[9999] transition-all duration-300",
        isMobile ? "inset-0" : "bottom-6 right-6",
        isMinimized && !isMobile && "bottom-6 right-6"
      )}
    >
      <div
        className={cn(
          "bg-background rounded-lg shadow-2xl border overflow-hidden transition-all duration-300",
          isMobile ? "w-full h-full rounded-none" : "w-[400px]",
          isMinimized && !isMobile ? "h-[60px] w-[300px]" : !isMobile && "h-[600px]"
        )}
      >
        {/* Chat Header with Window Controls */}
        <div className="flex items-center justify-between p-3 border-b bg-green-500">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-white" />
            <span className="font-semibold text-sm text-white">FinPro Assistant</span>
          </div>
          <div className="flex items-center gap-1">
            {!isMobile && (
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-white hover:bg-green-600"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? (
                  <Maximize2 className="h-4 w-4" />
                ) : (
                  <Minimize2 className="h-4 w-4" />
                )}
              </Button>
            )}
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-white hover:bg-green-600"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Chat Content */}
        {!isMinimized && (
          <ChatWindow 
            className="h-[calc(100%-52px)] border-none shadow-none rounded-none"
            showTimestamps={!isMobile}
          />
        )}
      </div>
    </div>
  );
};