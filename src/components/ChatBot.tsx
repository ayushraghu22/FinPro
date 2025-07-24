import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Bot, MessageCircle, X, Minimize2, Maximize2, Send, Mic, Globe } from 'lucide-react';
import { useChatContext } from '@/contexts/ChatContext';

// Message Component
const ChatMessage = ({ message, showTimestamp = false, onSendMessage }: any) => {
  const isUser = message.sender === 'user';
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  return (
    <div className={cn("flex gap-3 py-3 px-4", isUser && "flex-row-reverse")}>
      <div className={cn(
        "flex items-center justify-center h-8 w-8 rounded-full shrink-0",
        isUser ? "bg-primary text-primary-foreground" : "bg-muted"
      )}>
        {isUser ? "U" : <Bot className="h-4 w-4" />}
      </div>
      <div className={cn("flex flex-col gap-1 max-w-[80%]", isUser && "items-end")}>
        <div className={cn(
          "rounded-lg px-3 py-2 text-sm",
          isUser 
            ? "bg-primary text-primary-foreground ml-auto" 
            : "bg-muted",
          message.type === 'data' && "font-mono whitespace-pre overflow-x-auto"
        )}>
          {message.message}
        </div>
        
        {/* Navigation buttons */}
        {message.type === 'navigation' && message.data && (
          <div className="flex flex-wrap gap-2 mt-2">
            {message.data.options.map((option: string, index: number) => (
              <button
                key={index}
                className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-md border border-blue-300 transition-colors"
                onClick={() => {
                  if (message.data.category === 'learn') {
                    onSendMessage(`learn ${option}`);
                  } else {
                    onSendMessage(`show ${message.data.category} for ${option}`);
                  }
                }}
              >
                {option}
              </button>
            ))}
          </div>
        )}
        
        
        {showTimestamp && (
          <span className="text-xs text-muted-foreground">
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
        )}
      </div>
    </div>
  );
};

// Chat Input Component
const ChatInput = ({ onSendMessage, chatState, disabled }: any) => {
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const { t } = useChatContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="p-4 border-t bg-background">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('inputPlaceholder')}
            disabled={disabled}
            className="w-full px-3 py-2 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
          />
        </div>
        <Button
          type="button"
          size="icon"
          variant="outline"
          className={cn("shrink-0", isListening && "bg-primary text-primary-foreground")}
          onClick={() => setIsListening(!isListening)}
          disabled={disabled}
        >
          <Mic className="h-4 w-4" />
        </Button>
        <Button
          type="submit"
          size="icon"
          disabled={!message.trim() || disabled}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
      <p className="text-xs text-muted-foreground mt-1 text-center">
        {t('pressEnter')}{!isListening && t('micForVoice')}
      </p>
    </div>
  );
};

// Chat Suggestions Component
const ChatSuggestions = ({ suggestions, onSuggestionClick, disabled }: any) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="p-4 border-t bg-muted/30">
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion: any, index: number) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onSuggestionClick(suggestion.action)}
            disabled={disabled}
            className="text-xs hover:bg-primary hover:text-primary-foreground"
          >
            {suggestion.text}
          </Button>
        ))}
      </div>
    </div>
  );
};

// Language Selection Component
const LanguageSelection = ({ onLanguageSelect }: any) => {
  const { language: currentLanguage, setLanguage, languages, t, addMessage } = useChatContext();

  const handleLanguageSelect = (langCode: string) => {
    console.log('🔄 Language button clicked:', langCode);
    setLanguage(langCode);
    
    // Direct translation mapping to avoid React state issues
    const directTranslations = {
      en: "Hey! What do you need?",
      hi: "हैलो! क्या चाहिए?"
    };
    
    const welcomeMsg = directTranslations[langCode as keyof typeof directTranslations] || directTranslations.en;
    
    console.log('📄 Direct translation result:', welcomeMsg);
    
    // Call parent handler with direct message
    onLanguageSelect(langCode, welcomeMsg);
  };

  return (
    <div className="p-4 bg-muted/30 border-t">
      <p className="text-sm text-muted-foreground mb-3 text-center">
        Choose your preferred language / अपनी पसंदीदा भाषा चुनें
      </p>
      <div className="grid grid-cols-2 gap-2">
        {languages.map((lang: any) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageSelect(lang.code)}
            className={cn(
              "px-4 py-3 rounded-lg text-sm font-medium transition-all",
              "hover:bg-primary/10 hover:shadow-sm border border-border",
              currentLanguage === lang.code 
                ? "bg-primary text-primary-foreground shadow-sm" 
                : "bg-background"
            )}
          >
            <div className="flex flex-col items-center gap-1">
              <span className="text-base">{lang.nativeName}</span>
              <span className="text-xs opacity-70">{lang.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// Main ChatBot Component
export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showLanguageSelection, setShowLanguageSelection] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    messages,
    chatState,
    suggestions,
    sendMessage,
    clearChat,
    addMessage,
    t,
    isMobile
  } = useChatContext();

  // Add welcome message after language selection
  const handleLanguageSelect = (langCode: string, welcomeMsg: string) => {
    console.log('🎯 Received language selection:', langCode, 'Message:', welcomeMsg);
    setShowLanguageSelection(false);
    
    // Force immediate context language update and wait for it
    setTimeout(() => {
      addMessage(welcomeMsg, 'assistant', 'text');
    }, 100); // Reduced timeout since we have direct message
  };

  const handleSuggestionClick = (action: string) => {
    const actionMessages: Record<string, string> = {
      'show-expenses': 'Show me my recent expenses',
      'show-profit': 'Show me the profit analysis',
      'show-inventory': 'Check my inventory status',
      'show-sales': 'Show me recent sales',
      'show-course': 'Show me the financial course',
      'show-help': 'What can you help me with?'
    };

    const message = actionMessages[action] || `Help me with ${action}`;
    sendMessage(message);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Chat Button (when closed)
  if (!isOpen) {
    return (
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
    );
  }

  // Chat Window (when open)
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
        {/* Chat Header */}
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
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
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

        {/* Chat Content (only when not minimized) */}
        {!isMinimized && (
          <div className="flex flex-col h-[calc(100%-52px)]">
            {/* Status Bar */}
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
                  <>
                    <span className="text-muted-foreground">•</span>
                    <button
                      onClick={clearChat}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {t('clearChat')}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 min-h-0">
              <div className="flex flex-col">
                {messages.length === 0 ? (
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
                  messages.map((message: any) => (
                    <ChatMessage
                      key={message.id}
                      message={message}
                      showTimestamp={!isMobile}
                      onSendMessage={sendMessage}
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

            {/* Bottom Section */}
            <ChatSuggestions
              suggestions={suggestions}
              onSuggestionClick={handleSuggestionClick}
              disabled={chatState === 'thinking' || chatState === 'typing'}
            />
            <ChatInput
              onSendMessage={sendMessage}
              chatState={chatState}
              disabled={chatState === 'error'}
            />
          </div>
        )}
      </div>
    </div>
  );
};