import { useState, useRef, useCallback, KeyboardEvent, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Send, Loader2, Mic, MicOff } from 'lucide-react';
import { ChatState } from '@/types/chat';
import { useLanguage } from '@/contexts/LanguageContext';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  chatState: ChatState;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
}

export const ChatInput = ({ 
  onSendMessage, 
  chatState, 
  placeholder,
  maxLength = 500,
  disabled = false
}: ChatInputProps) => {
  const { t, language } = useLanguage();
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  const isLoading = chatState === 'typing' || chatState === 'thinking';
  const canSend = message.trim().length > 0 && !isLoading && !disabled;

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      // Set language for speech recognition
      const langMap: Record<string, string> = {
        'en': 'en-US',
        'hi': 'hi-IN',
        'te': 'te-IN',
        'mr': 'mr-IN',
        'kn': 'kn-IN',
        'ta': 'ta-IN',
        'gu': 'gu-IN'
      };
      recognitionRef.current.lang = langMap[language] || 'en-US';
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMessage(prev => (prev + ' ' + transcript).trim());
        setIsListening(false);
        setTimeout(adjustTextareaHeight, 0);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = Math.min(textarea.scrollHeight, 120); // Max 3 lines
      textarea.style.height = `${scrollHeight}px`;
    }
  }, []);

  const handleInputChange = (value: string) => {
    if (value.length <= maxLength) {
      setMessage(value);
      setTimeout(adjustTextareaHeight, 0);
    }
  };

  const handleSend = () => {
    if (!canSend) return;
    
    const messageToSend = message.trim();
    setMessage('');
    onSendMessage(messageToSend);
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const toggleVoiceRecording = () => {
    if (!recognitionRef.current) return;
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const isVoiceSupported = true; // Force show for testing - normally: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  const getStatusText = () => {
    switch (chatState) {
      case 'typing':
        return 'Sending...';
      case 'thinking':
        return 'Assistant is thinking...';
      case 'error':
        return 'Error occurred';
      default:
        return `${message.length}/${maxLength}`;
    }
  };

  return (
    <div className="border-t bg-background p-4">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? t('listening') : (placeholder || t('inputPlaceholder'))}
              disabled={isLoading || disabled || isListening}
              className={cn(
                "min-h-[40px] max-h-[120px] resize-none transition-all duration-200",
                "border-input focus-visible:ring-1 focus-visible:ring-ring",
                "disabled:opacity-50",
                isListening && "border-primary bg-primary/5"
              )}
              rows={1}
            />
          </div>
          
          {isVoiceSupported && (
            <Button
              onClick={toggleVoiceRecording}
              disabled={isLoading || disabled}
              size="icon"
              variant={isListening ? "default" : "outline"}
              className={cn(
                "h-10 w-10 shrink-0 transition-all duration-200",
                isListening && "bg-primary text-primary-foreground animate-pulse"
              )}
            >
              {isListening ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
          )}
          
          <Button
            onClick={handleSend}
            disabled={!canSend}
            size="icon"
            className={cn(
              "h-10 w-10 shrink-0 transition-all duration-200",
              canSend 
                ? "bg-primary hover:bg-primary/90 shadow-sm" 
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>
            {isListening ? (
              <span className="text-primary font-medium">🎤 {t('listening')}</span>
            ) : (
              <>{t('pressEnter')}{isVoiceSupported && t('micForVoice')}</>
            )}
          </span>
          <span className={cn(
            "transition-colors",
            message.length > maxLength * 0.9 && "text-financial-warning",
            message.length >= maxLength && "text-financial-loss"
          )}>
            {getStatusText()}
          </span>
        </div>
      </div>
    </div>
  );
};