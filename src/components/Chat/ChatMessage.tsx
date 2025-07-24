import { ChatMessage as ChatMessageType } from '@/types/chat';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
  showTimestamp?: boolean;
}

export const ChatMessage = ({ message, showTimestamp = false }: ChatMessageProps) => {
  const isUser = message.sender === 'user';
  const isSystem = message.type === 'system';
  
  if (isSystem) {
    return (
      <div className="flex justify-center py-2">
        <div className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex gap-3 py-3 px-4",
      isUser ? "flex-row-reverse" : "flex-row"
    )}>
      <Avatar className={cn(
        "h-8 w-8 shrink-0",
        isUser ? "bg-primary" : "bg-muted"
      )}>
        <AvatarFallback className={cn(
          "text-xs",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted"
        )}>
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>
      
      <div className={cn(
        "flex flex-col gap-1 max-w-[80%]",
        isUser ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "rounded-lg px-3 py-2 text-sm break-words",
          isUser 
            ? "bg-primary text-primary-foreground shadow-sm" 
            : "bg-muted text-foreground shadow-sm border"
        )}>
          <div className="whitespace-pre-wrap leading-relaxed">
            {message.content}
          </div>
        </div>
        
        {showTimestamp && (
          <div className="text-xs text-muted-foreground px-1">
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        )}
      </div>
    </div>
  );
};