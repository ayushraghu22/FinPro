import { useState, useCallback, useRef, useEffect } from 'react';
import { ChatMessage, ChatSession, ChatState, SuggestedAction } from '@/types/chat';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { TranslationKey } from '@/lib/translations';

interface UseChatOptions {
  maxMessages?: number;
  autoScroll?: boolean;
  persistHistory?: boolean;
}

export const useChat = (options: UseChatOptions = {}) => {
  const { maxMessages = 100, autoScroll = true, persistHistory = true } = options;
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatState, setChatState] = useState<ChatState>('idle');
  const [suggestions, setSuggestions] = useState<SuggestedAction[]>([]);
  const [showLanguageSelection, setShowLanguageSelection] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [autoScroll]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const generateMessageId = useCallback(() => {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const addMessage = useCallback((content: string, sender: 'user' | 'assistant', type: ChatMessage['type'] = 'text') => {
    const newMessage: ChatMessage = {
      id: generateMessageId(),
      content,
      sender,
      timestamp: new Date(),
      type
    };

    setMessages(prev => {
      const updated = [...prev, newMessage];
      return updated.length > maxMessages ? updated.slice(-maxMessages) : updated;
    });

    return newMessage;
  }, [generateMessageId, maxMessages]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    try {
      setChatState('typing');
      
      // Add user message
      addMessage(content, 'user');
      
      // Simulate assistant thinking
      setChatState('thinking');
      
      // Get assistant response
      const response = await getAssistantResponse(content, t);
      
      // Add assistant response
      setTimeout(() => {
        addMessage(response, 'assistant');
        setChatState('idle');
        
        // Update suggestions based on context
        updateSuggestions(content, response);
      }, 800 + Math.random() * 1200); // Natural response delay
      
    } catch (error) {
      setChatState('error');
      toast({
        title: "Chat Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      
      setTimeout(() => setChatState('idle'), 2000);
    }
  }, [addMessage, toast]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setSuggestions([]);
    setChatState('idle');
  }, []);

  const updateSuggestions = useCallback((userMessage: string, assistantResponse: string) => {
    const newSuggestions: SuggestedAction[] = [];
    
    // Context-aware suggestions based on conversation
    if (userMessage.toLowerCase().includes('expense') || userMessage.toLowerCase().includes('cost')) {
      newSuggestions.push(
        { id: 'expense-report', label: 'View Expense Report', action: 'show-expenses', icon: 'Receipt' },
        { id: 'add-expense', label: 'Add New Expense', action: 'add-expense', icon: 'Plus' }
      );
    }
    
    if (userMessage.toLowerCase().includes('profit') || userMessage.toLowerCase().includes('revenue')) {
      newSuggestions.push(
        { id: 'profit-analysis', label: 'Profit Analysis', action: 'show-profit', icon: 'TrendingUp' },
        { id: 'revenue-chart', label: 'Revenue Chart', action: 'show-revenue', icon: 'BarChart3' }
      );
    }
    
    if (userMessage.toLowerCase().includes('inventory') || userMessage.toLowerCase().includes('stock')) {
      newSuggestions.push(
        { id: 'inventory-status', label: 'Check Inventory', action: 'show-inventory', icon: 'Package' },
        { id: 'low-stock', label: 'Low Stock Items', action: 'show-low-stock', icon: 'AlertTriangle' }
      );
    }

    // Always include help option
    newSuggestions.push(
      { id: 'help', label: 'Help & Support', action: 'show-help', icon: 'HelpCircle' }
    );
    
    setSuggestions(newSuggestions.slice(0, 4)); // Limit to 4 suggestions
  }, []);

  return {
    messages,
    chatState,
    suggestions,
    messagesEndRef,
    sendMessage,
    clearChat,
    addMessage
  };
};

// Business-specific response logic
const getAssistantResponse = async (userMessage: string, t: (key: TranslationKey) => string): Promise<string> => {
  const message = userMessage.toLowerCase();
  
  // Financial queries
  if (message.includes('profit') || message.includes('loss') || message.includes('लाभ') || message.includes('हानि') || message.includes('లాభం') || message.includes('నష్టం')) {
    return t('profitLoss');
  }
  
  if (message.includes('expense') || message.includes('cost') || message.includes('खर्च') || message.includes('ఖర్చు') || message.includes('செலவு')) {
    return t('expenses');
  }
  
  if (message.includes('inventory') || message.includes('stock') || message.includes('इन्वेंट्री') || message.includes('స్టాక్') || message.includes('சரக்கு')) {
    return t('inventory');
  }
  
  if (message.includes('sale') || message.includes('revenue') || message.includes('बिक्री') || message.includes('విక్రయం') || message.includes('விற்பனை')) {
    return t('sales');
  }
  
  if (message.includes('loan') || message.includes('credit') || message.includes('ऋण') || message.includes('రుణం') || message.includes('கடன்')) {
    return t('loans');
  }
  
  if (message.includes('tax') || message.includes('gst') || message.includes('कर') || message.includes('పన్ను') || message.includes('வரி')) {
    return t('tax');
  }
  
  if (message.includes('report') || message.includes('analytics') || message.includes('रिपोर्ट') || message.includes('నివేదిక') || message.includes('அறிக்கை')) {
    return t('reports');
  }
  
  // Greeting responses
  if (message.includes('hello') || message.includes('hi') || message.includes('hey') || message.includes('नमस्ते') || message.includes('నమస్తే') || message.includes('வணக்கம்')) {
    return t('greeting');
  }
  
  if (message.includes('help') || message.includes('support') || message.includes('मदद') || message.includes('సహాయం') || message.includes('உதவி')) {
    return t('help');
  }
  
  // Default helpful response
  return t('default');
};