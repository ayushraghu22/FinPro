import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import translations from '@/data/translations.json';
import financialTips from '@/data/financial-tips.json';

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
  language: Language;
  setLanguage: (lang: Language) => void;
  languages: Array<{ code: string; name: string; nativeName: string }>;
  t: (key: string) => string;
  messages: Message[];
  chatState: ChatState;
  suggestions: Suggestion[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
  sendMessage: (message: string) => void;
  clearChat: () => void;
  addMessage: (message: string, sender: 'user' | 'assistant', type: MessageType, data?: any) => void;
  businessData: {
    expenses: any[];
    inventory: any[];
    sales: any[];
    profit: any;
  };
  isMobile: boolean;
}

const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' }
];

const FIN_TIPS: Suggestion[] = [
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

const DEF_SUGS: Suggestion[] = [
  { text: "Show Expenses", action: "show-expenses" },
  { text: "Profit Analysis", action: "show-profit" },
  { text: "Check Inventory", action: "show-inventory" },
  { text: "Show Sales", action: "show-sales" },
  { text: "Learn Finance", action: "show-course" },
  { text: "Help", action: "show-help" }
];

const BIZ_DATA = {
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
  const getTip = (topic: string) => {
    const key = Object.keys(financialTips).find(k => 
      k.toLowerCase() === topic.toLowerCase()
    );
    
    const cont = key ? financialTips[key as keyof typeof financialTips] : null;
    
    return {
      message: cont || `Topic "${topic}" not found. Available topics: ${Object.keys(financialTips).join(', ')}`,
      type: 'text' as MessageType
    };
  };

  const [lang, setLangState] = useState<Language>(() => {
    const VER = 'v4.0';
    const curVer = localStorage.getItem('languageVersion');
    
    if (curVer !== VER) {
      localStorage.removeItem('preferredLanguage');
      localStorage.setItem('languageVersion', VER);
      return 'en';
    }
    
    const saved = localStorage.getItem('preferredLanguage');
    return (saved as Language) || 'en';
  });

  const [msgs, setMsgs] = useState<Message[]>([]);
  const [state, setState] = useState<ChatState>('idle');
  const [sugs] = useState<Suggestion[]>(DEF_SUGS);
  const msgEndRef = useRef<HTMLDivElement>(null);

  const [bizData] = useState(BIZ_DATA);

  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const setLanguage = (l: Language) => {
    setLangState(l);
    localStorage.setItem('preferredLanguage', l);
    document.documentElement.lang = l;
  };

  const t = (key: string): string => {
    const trans = translations[lang as keyof typeof translations];
    const res = trans?.[key as keyof typeof trans] || 
           translations.en[key as keyof typeof translations.en] || 
           key;
    
    return res;
  };

  const addMsg = (msg: string, sender: 'user' | 'assistant', type: MessageType = 'text', data?: any) => {
    const newMsg: Message = {
      id: Date.now().toString(),
      message: msg,
      sender,
      type,
      timestamp: Date.now(),
      data
    };
    setMsgs(prev => [...prev, newMsg]);
  };

  const clear = () => {
    setMsgs([]);
    setState('idle');
  };

  const send = async (txt: string) => {
    addMsg(txt, 'user');
    setState('thinking');

    await new Promise(resolve => setTimeout(resolve, 1000));

    const resp = processMsg(txt.toLowerCase());
    
    setState('typing');
    await new Promise(resolve => setTimeout(resolve, 500));

    addMsg(resp.message, 'assistant', resp.type, resp.data);
    setState('idle');
  };

  const processMsg = (txt: string) => {
    if (txt.startsWith('learn ')) {
      const topic = txt.replace('learn ', '');
      return getTip(topic);
    }

    if (txt.includes('course') || txt.includes('learn')) {
      return {
        message: `Choose a topic to learn:`,
        type: 'navigation' as MessageType,
        data: { 
          type: 'course',
          options: FIN_TIPS.map(tip => tip.text),
          category: 'learn'
        }
      };
    }

    if (txt.includes('expense') && txt.includes('show')) {
      const total = bizData.expenses.reduce((sum, exp) => sum + exp.amount, 0);
      
      return {
        message: `${bizData.expenses.map(exp => {
          const desc = exp.description;
          const amt = `₹${exp.amount.toLocaleString()}`;
          return `${desc.padEnd(20)} ${amt.padStart(8)}`;
        }).join('\n')}
${''.padEnd(20)} ${'--------'.padStart(8)}
${'Total'.padEnd(20)} ${'₹' + total.toLocaleString().padStart(7)}`,
        type: 'data' as MessageType,
        data: bizData.expenses
      };
    }

    if (txt.includes('profit') || txt.includes('analysis')) {
      return {
        message: `Revenue: ₹${bizData.profit.revenue.toLocaleString()}
Expenses: ₹${bizData.profit.expenses.toLocaleString()}
Net Profit: ₹${bizData.profit.netProfit.toLocaleString()}
Profit Margin: ${bizData.profit.profitMargin}%`,
        type: 'data' as MessageType,
        data: bizData.profit
      };
    }

    if (txt.includes('inventory') || txt.includes('stock')) {
      const low = bizData.inventory.filter(item => item.stock <= item.minStock);
      return {
        message: `${bizData.inventory.map(item => 
  `${item.name}: ${item.stock} units (Min: ${item.minStock})
Value: ₹${item.value.toLocaleString()} | ${item.stock <= item.minStock ? 'LOW STOCK' : 'Good'}`
).join('\n\n')}${low.length > 0 ? `\n\n${low.length} items low on stock` : ''}`,
        type: 'data' as MessageType,
        data: bizData.inventory
      };
    }

    if (txt.includes('sales') || txt.includes('revenue')) {
      const totalSales = bizData.sales.reduce((sum, sale) => sum + sale.amount, 0);
      return {
        message: `${bizData.sales.map(sale => 
  `${sale.customer} - ₹${sale.amount.toLocaleString()}
${sale.date} | ${sale.product}`
).join('\n\n')}

Total: ₹${totalSales.toLocaleString()}`,
        type: 'data' as MessageType,
        data: bizData.sales
      };
    }

    if (txt.includes('help')) {
      return {
        message: t('help'),
        type: 'text' as MessageType
      };
    }

    const resp = {
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

    for (const [keyword, response] of Object.entries(resp)) {
      if (txt.includes(keyword)) {
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

  const ctx: ChatContextType = {
    language: lang,
    setLanguage,
    languages: LANGUAGES,
    t,
    
    messages: msgs,
    chatState: state,
    suggestions: sugs,
    messagesEndRef: msgEndRef,
    sendMessage: send,
    clearChat: clear,
    addMessage: addMsg,
    
    businessData: bizData,
    
    isMobile: mobile
  };

  return (
    <ChatContext.Provider value={ctx}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext needs ChatProvider');
  }
  return context;
};