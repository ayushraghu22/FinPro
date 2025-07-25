import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Bot, MessageCircle, X, Minimize2, Maximize2, Send, Mic, Globe } from 'lucide-react';
import { useChatContext } from '@/contexts/ChatContext';

const ChatMessage = ({ message, showTimestamp = false, onSendMessage }: any) => {
  const usr = message.sender === 'user';
  
  const fmtDt = (dateStr: string) => {
    const dt = new Date(dateStr);
    return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  return (
    <div className={cn("flex gap-3 py-3 px-4", usr && "flex-row-reverse")}>
      <div className={cn(
        "flex items-center justify-center h-8 w-8 rounded-full shrink-0",
        usr ? "bg-primary text-primary-foreground" : "bg-muted"
      )}>
        {usr ? "U" : <Bot className="h-4 w-4" />}
      </div>
      <div className={cn("flex flex-col gap-1 max-w-[80%]", usr && "items-end")}>
        <div className={cn(
          "rounded-lg px-3 py-2 text-sm",
          usr ? "bg-primary text-primary-foreground ml-auto" : "bg-muted",
          message.type === 'data' && "font-mono whitespace-pre overflow-x-auto"
        )}>
          {message.message}
        </div>
        
        {message.type === 'navigation' && message.data && (
          <div className="flex flex-wrap gap-2 mt-2">
            {message.data.options.map((option: string, idx: number) => (
              <button
                key={idx}
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

const ChatInput = ({ onSendMessage, chatState, disabled }: any) => {
  const [msg, setMsg] = useState('');
  const [listening, setListening] = useState(false);
  const { t } = useChatContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (msg.trim() && !disabled) {
      onSendMessage(msg.trim());
      setMsg('');
    }
  };

  const keyPress = (e: React.KeyboardEvent) => {
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
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyPress={keyPress}
            placeholder={t('inputPlaceholder')}
            disabled={disabled}
            className="w-full px-3 py-2 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
          />
        </div>
        <Button
          type="button"
          size="icon"
          variant="outline"
          className={cn("shrink-0", listening && "bg-primary text-primary-foreground")}
          onClick={() => setListening(!listening)}
          disabled={disabled}
        >
          <Mic className="h-4 w-4" />
        </Button>
        <Button
          type="submit"
          size="icon"
          disabled={!msg.trim() || disabled}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
      <p className="text-xs text-muted-foreground mt-1 text-center">
        {t('pressEnter')}{!listening && t('micForVoice')}
      </p>
    </div>
  );
};

const ChatSuggestions = ({ suggestions, onSuggestionClick, disabled }: any) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="p-4 border-t bg-muted/30">
      <div className="flex flex-wrap gap-2">
        {suggestions.map((sug: any, idx: number) => (
          <Button
            key={idx}
            variant="outline"
            size="sm"
            onClick={() => onSuggestionClick(sug.action)}
            disabled={disabled}
            className="text-xs hover:bg-primary hover:text-primary-foreground"
          >
            {sug.text}
          </Button>
        ))}
      </div>
    </div>
  );
};

const LanguageSelection = ({ onLanguageSelect }: any) => {
  const { language: curLang, setLanguage, languages, t, addMessage } = useChatContext();

  const handleLangSelect = (code: string) => {
    setLanguage(code);
    
    const trans = {
      en: "Hey! What do you need?",
      hi: "हैलो! क्या चाहिए?"
    };
    
    const msg = trans[code as keyof typeof trans] || trans.en;
    
    onLanguageSelect(code, msg);
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
            onClick={() => handleLangSelect(lang.code)}
            className={cn(
              "px-4 py-3 rounded-lg text-sm font-medium transition-all",
              "hover:bg-primary/10 hover:shadow-sm border border-border",
              curLang === lang.code 
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

export const ChatBot = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [showLangSelect, setShowLangSelect] = useState(true);
  const msgEndRef = useRef<HTMLDivElement>(null);

  const authPaths = ['/dashboard', '/finances', '/profit-loss', '/loans', '/rents', '/bills', '/upload-invoice', '/sales', '/reports'];
  const isAuth = authPaths.some(path => location.pathname.startsWith(path));
  
  const {
    messages,
    chatState: state,
    suggestions: sugs,
    sendMessage: send,
    clearChat: clear,
    addMessage,
    t,
    isMobile: mobile
  } = useChatContext();

  const handleLangSelect = (code: string, msg: string) => {
    setShowLangSelect(false);
    
    setTimeout(() => {
      addMessage(msg, 'assistant', 'text');
    }, 100);
  };

  const handleSugClick = (action: string) => {
    const actMsgs: Record<string, string> = {
      'show-expenses': 'Show me my recent expenses',
      'show-profit': 'Show me the profit analysis',
      'show-inventory': 'Check my inventory status',
      'show-sales': 'Show me recent sales',
      'show-course': 'Show me the financial course',
      'show-help': 'What can you help me with?'
    };

    const txt = actMsgs[action] || `Help me with ${action}`;
    send(txt);
  };

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isAuth) {
    return null;
  }

  if (!open) {
    return (
      <Button
        size="icon"
        onClick={() => setOpen(true)}
        className={cn("fixed bottom-6 right-6 z-[9999] h-14 w-14 rounded-full shadow-elegant bg-primary hover:bg-primary/90 transition-all duration-300 hover:shadow-glow hover:scale-105")}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div
      className={cn(
        "fixed z-[9999] transition-all duration-300",
        mobile ? "inset-0" : "bottom-6 right-6",
        minimized && !mobile && "bottom-6 right-6"
      )}
    >
      <div
        className={cn(
          "bg-background rounded-lg shadow-2xl border overflow-hidden transition-all duration-300",
          mobile ? "w-full h-full rounded-none" : "w-[400px]",
          minimized && !mobile ? "h-[60px] w-[300px]" : !mobile && "h-[600px]"
        )}
      >
        <div className="flex items-center justify-between p-3 border-b bg-green-500">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-white" />
            <span className="font-semibold text-sm text-white">FinPro Assistant</span>
          </div>
          <div className="flex items-center gap-1">
            {!mobile && (
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-white hover:bg-green-600"
                onClick={() => setMinimized(!minimized)}
              >
                {minimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
            )}
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-white hover:bg-green-600"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!minimized && (
          <div className="flex flex-col h-[calc(100%-52px)]">
            <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30">
              <p className="text-xs text-muted-foreground">
                {state === 'thinking' ? t('thinking') : 
                 state === 'typing' ? t('typing') : 
                 t('online')}
              </p>
              <div className="flex items-center gap-2">
                {messages.length > 0 && (
                  <button
                    onClick={() => {
                      clear();
                      setShowLangSelect(true);
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
                      onClick={clear}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {t('clearChat')}
                    </button>
                  </>
                )}
              </div>
            </div>

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
                      showTimestamp={!mobile}
                      onSendMessage={send}
                    />
                  ))
                )}
                
                {state === 'thinking' && (
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
                
                <div ref={msgEndRef} />
              </div>
            </ScrollArea>

            <ChatSuggestions
              suggestions={sugs}
              onSuggestionClick={handleSugClick}
              disabled={state === 'thinking' || state === 'typing'}
            />
            <ChatInput
              onSendMessage={send}
              chatState={state}
              disabled={state === 'error'}
            />
          </div>
        )}
      </div>
    </div>
  );
};