import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Bill {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  status: "paid" | "pending";
  category: string;
}

interface BillsContextType {
  bills: Bill[];
  addBill: (bill: Omit<Bill, "id">) => void;
  updateBillStatus: (id: string, status: "paid" | "pending") => void;
  getUpcomingBills: () => Bill[];
}

const BillsContext = createContext<BillsContextType | undefined>(undefined);

export function BillsProvider({ children }: { children: ReactNode }) {
  const initialBills: Bill[] = [
    {
      id: "1",
      description: "Quarterly Shop Rent",
      amount: 45000,
      dueDate: "2026-07-01",
      status: "pending",
      category: "Rent"
    },
    {
      id: "2",
      description: "Electricity Bill",
      amount: 3800,
      dueDate: "2026-07-03",
      status: "pending",
      category: "Utilities"
    },
    {
      id: "3",
      description: "Business Insurance Premium",
      amount: 12500,
      dueDate: "2026-07-05",
      status: "pending",
      category: "Insurance"
    },
    {
      id: "4",
      description: "Internet & Phone Services",
      amount: 2200,
      dueDate: "2026-07-07",
      status: "pending",
      category: "Utilities"
    },
    {
      id: "5",
      description: "Equipment Maintenance Contract",
      amount: 7500,
      dueDate: "2026-07-10",
      status: "pending",
      category: "Maintenance"
    },
    {
      id: "6",
      description: "Staff Health Insurance",
      amount: 15000,
      dueDate: "2026-07-15",
      status: "pending",
      category: "Insurance"
    }
  ];

  const [bills, setBills] = useState<Bill[]>(() => {
    const savedBills = localStorage.getItem("bills");
    const parsedBills = savedBills ? JSON.parse(savedBills) : initialBills;
    // Ensure bills are persisted on first load
    if (!savedBills) {
      localStorage.setItem("bills", JSON.stringify(initialBills));
    }
    return parsedBills;
  });

  useEffect(() => {
    localStorage.setItem("bills", JSON.stringify(bills));
  }, [bills]);

  const addBill = (newBill: Omit<Bill, "id">) => {
    const id = Date.now().toString();
    setBills((prevBills) => [...prevBills, { ...newBill, id }]);
  };

  const updateBillStatus = (id: string, status: "paid" | "pending") => {
    setBills((prevBills) =>
      prevBills.map((bill) =>
        bill.id === id ? { ...bill, status } : bill
      )
    );
  };

  const getUpcomingBills = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison
    
    const filtered = bills.filter((bill) => {
      const dueDate = new Date(bill.dueDate);
      dueDate.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison
      return bill.status === "pending" && dueDate >= today;
    });

    const sorted = filtered.sort((a, b) => {
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      // First sort by date
      const dateDiff = dateA.getTime() - dateB.getTime();
      if (dateDiff !== 0) return dateDiff;
      // If same date, sort by amount (higher amount first)
      return b.amount - a.amount;
    });

    return sorted.slice(0, 5); // Get top 5 upcoming bills
  };

  return (
    <BillsContext.Provider value={{ bills, addBill, updateBillStatus, getUpcomingBills }}>
      {children}
    </BillsContext.Provider>
  );
}

export function useBills() {
  const context = useContext(BillsContext);
  if (context === undefined) {
    throw new Error("useBills must be used within a BillsProvider");
  }
  return context;
}
