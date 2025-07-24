import React, { createContext, useContext, useState, useEffect } from "react";

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
}

interface TransactionsContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  deleteTransaction: (id: string) => void;
  getRecentTransactions: (limit?: number) => Transaction[];
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

export const useTransactions = () => {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error("useTransactions must be used within a TransactionsProvider");
  }
  return context;
};

export const TransactionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Dummy transactions to show on first load
  const dummyTransactions: Transaction[] = [
    {
      id: "1",
      description: "Office Rent",
      amount: 25000,
      type: "expense",
      category: "Rent",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    },
    {
      id: "2",
      description: "Client Payment",
      amount: 50000,
      type: "income",
      category: "Sales",
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    },
    {
      id: "3",
      description: "Internet Bill",
      amount: 1200,
      type: "expense",
      category: "Utilities",
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    },
    {
      id: "4",
      description: "Software Subscription",
      amount: 3000,
      type: "expense",
      category: "Software",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    },
    {
      id: "5",
      description: "Consulting Income",
      amount: 15000,
      type: "income",
      category: "Consulting",
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    },
  ];

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem("transactions");
    if (!saved) return dummyTransactions;
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length === 0) {
        return dummyTransactions;
      }
      return parsed;
    } catch {
      return dummyTransactions;
    }
  });

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = {
      ...transaction,
      id: crypto.randomUUID(),
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const getRecentTransactions = (limit?: number) => {
    const sorted = [...transactions].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return limit ? sorted.slice(0, limit) : sorted;
  };

  return (
    <TransactionsContext.Provider value={{ transactions, addTransaction, deleteTransaction, getRecentTransactions }}>
      {children}
    </TransactionsContext.Provider>
  );
};
