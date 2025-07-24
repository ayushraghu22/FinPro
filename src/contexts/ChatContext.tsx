import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import translations from '@/data/translations.json';
import financialTips from '@/data/financial-tips.json';

// Types - Only English
type Language = 'en';
type ChatState = 'idle' | 'thinking' | 'typing' | 'error';
type MessageType = 'text' | 'action' | 'data';

interface Message {
  id: string;
  message: string;
  sender: 'user' | 'assistant';
  type: MessageType;
  timestamp: number;
  data?: any;
}

interface Suggestion {
  text: string;
  action: string;
}

interface ChatContextType {
  // Language
  language: Language;
  setLanguage: (lang: Language) => void;
  languages: Array<{ code: string; name: string; nativeName: string }>;
  t: (key: string) => string;
  
  // Chat
  messages: Message[];
  chatState: ChatState;
  suggestions: Suggestion[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
  sendMessage: (message: string) => void;
  clearChat: () => void;
  addMessage: (message: string, sender: 'user' | 'assistant', type: MessageType, data?: any) => void;
  
  // Business Data (for quick actions)
  businessData: {
    expenses: any[];
    inventory: any[];
    sales: any[];
    profit: any;
  };
  
  // Utilities
  isMobile: boolean;
}

// Language definitions - Only English
const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' }
];

// Financial Literacy Course - 10 Essential Tips
const FINANCIAL_LITERACY_TIPS: Suggestion[] = [
  { text: "What is Budget?", action: "tip-budget" },
  { text: "Track Your Money", action: "tip-tracking" },
  { text: "Profit vs Revenue", action: "tip-profit" },
  { text: "Emergency Fund", action: "tip-emergency" },
  { text: "Business Expenses", action: "tip-expenses" },
  { text: "Cash Flow Basics", action: "tip-cashflow" },
  { text: "Save Money Tips", action: "tip-saving" },
  { text: "Debt Management", action: "tip-debt" },
  { text: "Investment Basics", action: "tip-investment" },
  { text: "Tax Planning", action: "tip-tax" }
];

// Default suggestions - Read-only actions
const DEFAULT_SUGGESTIONS: Suggestion[] = [
  { text: "Show Expenses", action: "show-expenses" },
  { text: "Profit Analysis", action: "show-profit" },
  { text: "Check Inventory", action: "show-inventory" },
  { text: "Show Sales", action: "show-sales" },
  { text: "Learn Finance", action: "show-course" },
  { text: "Help", action: "show-help" }
];

// Mock business data - matching dashboard data
const MOCK_BUSINESS_DATA = {
  expenses: [
    { id: 1, amount: 25000, category: 'Rent', date: '2024-01-15', description: 'Rent Payment' },
    { id: 2, amount: 850, category: 'Utilities', date: '2024-01-14', description: 'Electricity Bill' },
    { id: 3, amount: 1200, category: 'Inventory', date: '2024-01-13', description: 'Supplier ABC Ltd' }
  ],
  inventory: [
    { id: 1, name: 'Product A', stock: 45, minStock: 10, value: 2250 },
    { id: 2, name: 'Product B', stock: 8, minStock: 15, value: 400 },
    { id: 3, name: 'Product C', stock: 120, minStock: 25, value: 6000 }
  ],
  sales: [
    { id: 1, amount: 2450, product: 'Product A', date: '2024-01-15', customer: 'Customer #1234' },
    { id: 2, amount: 3670, product: 'Product C', date: '2024-01-14', customer: 'Customer #1235' },
    { id: 3, amount: 1950, product: 'Product A', date: '2024-01-13', customer: 'Customer #1236' }
  ],
  profit: {
    revenue: 245670,
    expenses: 189430,
    netProfit: 56240,
    profitMargin: 22.9
  }
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  // Financial Literacy Tips Content - Load from JSON
  const getFinancialTip = (topic: string) => {
    console.log('getFinancialTip called with topic:', topic);
    
    // Find topic with case-insensitive match
    const topicKey = Object.keys(financialTips).find(key => 
      key.toLowerCase() === topic.toLowerCase()
    );
    
    const content = topicKey ? financialTips[topicKey as keyof typeof financialTips] : null;
    console.log('Topic lookup result:', content ? 'Found' : 'Not found');
    console.log('Matched key:', topicKey);
    
    return {
      message: content || `Topic "${topic}" not found. Available topics: ${Object.keys(financialTips).join(', ')}`,
      type: 'text' as MessageType
    };
  };

  // Language state
  const [language, setLanguageState] = useState<Language>(() => {
    // Version check to clear old cached data when language mapping changes
    const LANGUAGE_VERSION = 'v4.0'; // English only version
    const currentVersion = localStorage.getItem('languageVersion');
    
    if (currentVersion !== LANGUAGE_VERSION) {
      localStorage.removeItem('preferredLanguage');
      localStorage.setItem('languageVersion', LANGUAGE_VERSION);
      return 'en';
    }
    
    const saved = localStorage.getItem('preferredLanguage');
    return (saved as Language) || 'en';
  });

  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatState, setChatState] = useState<ChatState>('idle');
  const [suggestions] = useState<Suggestion[]>(DEFAULT_SUGGESTIONS);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Business data state
  const [businessData] = useState(MOCK_BUSINESS_DATA);

  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Language functions
  const setLanguage = (lang: Language) => {
    console.log('🌍 Language Selection Debug:');
    console.log('Button clicked for language:', lang);
    console.log('Language object:', LANGUAGES.find(l => l.code === lang));
    
    // Force immediate state update
    setLanguageState(lang);
    localStorage.setItem('preferredLanguage', lang);
    document.documentElement.lang = lang;
    
    // Force re-render to ensure state is updated
    setTimeout(() => {
      console.log('🔄 After state update, current language:', lang);
    }, 0);
  };

  const t = (key: string): string => {
    const langTranslations = translations[language as keyof typeof translations];
    const result = langTranslations?.[key as keyof typeof langTranslations] || 
           translations.en[key as keyof typeof translations.en] || 
           key;
    
    // Debug logging for welcome message
    if (key === 'welcomeMessage') {
      console.log('🔍 Translation Debug:');
      console.log('Selected language:', language);
      console.log('Available translations:', Object.keys(translations));
      console.log('Result for welcomeMessage:', result);
      console.log('Expected Telugu text should start with: నమస్తే');
    }
    
    return result;
  };

  // Chat functions
  const addMessage = (message: string, sender: 'user' | 'assistant', type: MessageType = 'text', data?: any) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      message,
      sender,
      type,
      timestamp: Date.now(),
      data
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const clearChat = () => {
    setMessages([]);
    setChatState('idle');
  };

  const sendMessage = async (message: string) => {
    // Add user message
    addMessage(message, 'user');
    setChatState('thinking');

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Process message and generate response
    const response = processMessage(message.toLowerCase());
    
    setChatState('typing');
    await new Promise(resolve => setTimeout(resolve, 500));

    // Add assistant response
    addMessage(response.message, 'assistant', response.type, response.data);
    setChatState('idle');
  };

  const processMessage = (message: string) => {
    // Handle course topic selection FIRST (more specific)
    if (message.startsWith('learn ')) {
      const topic = message.replace('learn ', '');
      console.log('Debug - Topic received:', topic);
      return getFinancialTip(topic);
    }

    // Financial Literacy Course Navigation
    if (message.includes('course') || message.includes('learn')) {
      return {
        message: `Choose a topic to learn:`,
        type: 'navigation' as MessageType,
        data: { 
          type: 'course',
          options: FINANCIAL_LITERACY_TIPS.map(tip => tip.text),
          category: 'learn'
        }
      };
    }

    // Quick action responses with business data
    if (message.includes('expense') && message.includes('show')) {
      const totalExpenses = businessData.expenses.reduce((sum, exp) => sum + exp.amount, 0);
      
      return {
        message: `${businessData.expenses.map(exp => {
          const desc = exp.description;
          const amount = `₹${exp.amount.toLocaleString()}`;
          return `${desc.padEnd(20)} ${amount.padStart(8)}`;
        }).join('\n')}
${''.padEnd(20)} ${'--------'.padStart(8)}
${'Total'.padEnd(20)} ${'₹' + totalExpenses.toLocaleString().padStart(7)}`,
        type: 'data' as MessageType,
        data: businessData.expenses
      };
    }

    if (message.includes('profit') || message.includes('analysis')) {
      return {
        message: `Revenue: ₹${businessData.profit.revenue.toLocaleString()}
Expenses: ₹${businessData.profit.expenses.toLocaleString()}
Net Profit: ₹${businessData.profit.netProfit.toLocaleString()}
Profit Margin: ${businessData.profit.profitMargin}%`,
        type: 'data' as MessageType,
        data: businessData.profit
      };
    }

    if (message.includes('inventory') || message.includes('stock')) {
      const lowStock = businessData.inventory.filter(item => item.stock <= item.minStock);
      return {
        message: `${businessData.inventory.map(item => 
  `${item.name}: ${item.stock} units (Min: ${item.minStock})
Value: ₹${item.value.toLocaleString()} | ${item.stock <= item.minStock ? 'LOW STOCK' : 'Good'}`
).join('\n\n')}${lowStock.length > 0 ? `\n\n${lowStock.length} items low on stock` : ''}`,
        type: 'data' as MessageType,
        data: businessData.inventory
      };
    }

    if (message.includes('sales') || message.includes('revenue')) {
      const totalSales = businessData.sales.reduce((sum, sale) => sum + sale.amount, 0);
      return {
        message: `${businessData.sales.map(sale => 
  `${sale.customer} - ₹${sale.amount.toLocaleString()}
${sale.date} | ${sale.product}`
).join('\n\n')}

Total: ₹${totalSales.toLocaleString()}`,
        type: 'data' as MessageType,
        data: businessData.sales
      };
    }

    if (message.includes('help')) {
      return {
        message: t('help'),
        type: 'text' as MessageType
      };
    }

    // Default responses based on language
    const responses = {
      'expenses': t('expenses'),
      'profit': t('profitLoss'),
      'inventory': t('inventory'),
      'sales': t('sales'),
      'loan': t('loans'),
      'tax': t('tax'),
      'report': t('reports'),
      'hello': t('greeting'),
      'hi': t('greeting'),
      'namaste': t('greeting')
    };

    for (const [keyword, response] of Object.entries(responses)) {
      if (message.includes(keyword)) {
        return {
          message: response,
          type: 'text' as MessageType
        };
      }
    }

    return {
      message: t('default'),
      type: 'text' as MessageType
    };
  };

  const contextValue: ChatContextType = {
    // Language
    language,
    setLanguage,
    languages: LANGUAGES,
    t,
    
    // Chat
    messages,
    chatState,
    suggestions,
    messagesEndRef,
    sendMessage,
    clearChat,
    addMessage,
    
    // Business Data
    businessData,
    
    // Utilities
    isMobile
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};