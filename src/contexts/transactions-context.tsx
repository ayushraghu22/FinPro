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
      sellingDate: "2024-01-15",
      purchasingPrice: 15000,
      expectedSellingPrice: 18000,
      description: "42-inch Smart LED TV",
    },
    {
      id: "2",
      itemName: "Refrigerator",
      units: 3,
      sellingDate: "2024-02-20",
      purchasingPrice: 22000,
      expectedSellingPrice: 26000,
      description: "Double door, 300L capacity",
    },
    {
      id: "3",
      itemName: "Washing Machine",
      units: 4,
      sellingDate: "2024-05-10",
      purchasingPrice: 18000,
      expectedSellingPrice: 17000,
      description: "7kg Front Load",
    },
    {
      id: "4",
      itemName: "Laptop",
      units: 10,
      sellingDate: "2024-07-01",
      purchasingPrice: 45000,
      expectedSellingPrice: 52000,
      description: "15.6-inch, 8GB RAM",
    },
    {
      id: "5",
      itemName: "Smartphone",
      units: 20,
      sellingDate: "2024-12-15",
      purchasingPrice: 18000,
      expectedSellingPrice: 22000,
      description: "6.5-inch AMOLED",
    },
    {
      id: "6",
      itemName: "Air Conditioner",
      units: 6,
      sellingDate: "2025-03-01",
      purchasingPrice: 30000,
      expectedSellingPrice: 35000,
      description: "1.5 Ton Split AC",
    },
    {
      id: "7",
      itemName: "Smartwatch",
      units: 15,
      sellingDate: "2025-05-20",
      purchasingPrice: 7000,
      expectedSellingPrice: 9500,
      description: "Waterproof, GPS",
    },
    {
      id: "8",
      itemName: "Drone",
      units: 3,
      sellingDate: "2025-06-10",
      purchasingPrice: 25000,
      expectedSellingPrice: 20000,
      description: "4K Camera Drone",
    },
    {
      id: "9",
      itemName: "Electric Bike",
      units: 4,
      sellingDate: "2025-07-05",
      purchasingPrice: 50000,
      expectedSellingPrice: 54000,
      description: "Range 80km/charge",
    },
    {
      id: "10",
      itemName: "Gaming Console",
      units: 7,
      sellingDate: "2025-07-15",
      purchasingPrice: 25000,
      expectedSellingPrice: 23000,
      description: "Latest Gen Console",
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
