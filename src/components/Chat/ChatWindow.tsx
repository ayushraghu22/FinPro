import { useEffect, useRef, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ChatSuggestions } from './ChatSuggestions';
import { LanguageSelection } from './LanguageSelection';
import { useChat } from '@/hooks/useChat';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Bot, MessageCircle, Globe } from 'lucide-react';
import { Language } from '@/lib/translations';

interface ChatWindowProps {
  className?: string;
  showTimestamps?: boolean;
  welcomeMessage?: string;
}

export const ChatWindow = ({ 
  className,
  showTimestamps = false
}: ChatWindowProps) => {
  const { t } = useLanguage();
  const [showLanguageSelection, setShowLanguageSelection] = useState(true);
  const {
    messages,
    chatState,
    suggestions,
    messagesEndRef,
    sendMessage,
    clearChat,
    addMessage
  } = useChat();

  const initializedRef = useRef(false);

  // Add welcome message after language selection
  const handleLanguageSelect = (lang: Language) => {
    setShowLanguageSelection(false);
    // Add welcome message in selected language
    setTimeout(() => {
      addMessage(t('welcomeMessage'), 'assistant', 'text');
    }, 300);
  };

  const handleSuggestionClick = (action: string) => {
    // Convert action to natural language message
    const actionMessages: Record<string, string> = {
      'show-expenses': 'Show me my recent expenses',
      'add-expense': 'Help me add a new expense',
      'show-profit': 'Show me the profit analysis',
      'show-revenue': 'Display revenue chart',
      'show-inventory': 'Check my inventory status',
      'show-low-stock': 'Show items with low stock',
      'show-help': 'What can you help me with?'
    };

    const message = actionMessages[action] || `Help me with ${action}`;
    sendMessage(message);
  };

  return (
    <div className={cn(
      "flex flex-col h-full bg-background border rounded-lg shadow-card",
      className
    )}>
      {/* Chat Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30">
        <p className="text-xs text-muted-foreground">
          {chatState === 'thinking' ? t('thinking') : 
           chatState === 'typing' ? t('typing') : 
           t('online')}
        </p>
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={() => {
                clearChat();
                setShowLanguageSelection(true);
              }}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              title="Change language"
            >
              <Globe className="h-3 w-3" />
              <span>Language</span>
            </button>
          )}
          {messages.length > 1 && (
            <span className="text-muted-foreground">•</span>
          )}
          {messages.length > 1 && (
            <button
              onClick={clearChat}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('clearChat')}
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="flex flex-col">
          {messages.length === 0 && showLanguageSelection ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-center p-6 mb-4">
                <h4 className="text-lg font-semibold mb-2">Welcome to FinPro Assistant</h4>
                <p className="text-sm text-muted-foreground">
                  Select your preferred language to start
                </p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center p-6">
              <MessageCircle className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h4 className="font-medium text-muted-foreground mb-2">
                {t('noMessages')}
              </h4>
              <p className="text-sm text-muted-foreground/70 max-w-sm">
                {t('noMessagesDesc')}
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                showTimestamp={showTimestamps}
              />
            ))
          )}
          
          {/* Typing indicator */}
          {chatState === 'thinking' && (
            <div className="flex gap-3 py-3 px-4">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted shrink-0">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-1 bg-muted rounded-lg px-3 py-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" 
                       style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" 
                       style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" 
                       style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Show language selection if no messages, otherwise show suggestions */}
      {messages.length === 0 && showLanguageSelection ? (
        <LanguageSelection onLanguageSelect={handleLanguageSelect} />
      ) : (
        <>
          {/* Suggestions */}
          <ChatSuggestions
            suggestions={suggestions}
            onSuggestionClick={handleSuggestionClick}
            disabled={chatState === 'thinking' || chatState === 'typing'}
          />

          {/* Input */}
          <ChatInput
            onSendMessage={sendMessage}
            chatState={chatState}
            disabled={chatState === 'error'}
          />
        </>
      )}
    </div>
  );
};