import React, { createContext, useContext, useState, useEffect } from "react";

export interface Transaction {
  id: string;
  itemName: string;
  units: number;
  sellingDate: string;
  purchasingPrice: number;
  expectedSellingPrice: number;
  description: string;
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
      itemName: "LED TV",
      units: 5,
      sellingDate: "2024-06-01",
      purchasingPrice: 15000,
      expectedSellingPrice: 18000,
      description: "42-inch Smart LED TV",
    },
    {
      id: "2",
      itemName: "Refrigerator",
      units: 2,
      sellingDate: "2024-06-03",
      purchasingPrice: 22000,
      expectedSellingPrice: 26000,
      description: "Double door, 300L capacity",
    },
    {
      id: "3",
      itemName: "Microwave Oven",
      units: 3,
      sellingDate: "2024-06-05",
      purchasingPrice: 7000,
      expectedSellingPrice: 9000,
      description: "Convection, 25L",
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
      new Date(b.sellingDate).getTime() - new Date(a.sellingDate).getTime()
    );
    return limit ? sorted.slice(0, limit) : sorted;
  };

  return (
    <TransactionsContext.Provider value={{ transactions, addTransaction, deleteTransaction, getRecentTransactions }}>
      {children}
    </TransactionsContext.Provider>
  );
};
