import React, { createContext, useContext, useState, useEffect } from "react";

// Removed UnitType, unitType is now a string

export interface InventoryItem {
  id: string;
  itemName: string;
  purchasedPrice: number;
  units: number;
  unitType: string;
  expectedSellingPrice: number;
  purchasedDate: string;
  expiryDate: string;
  minStock: number;
  category?: string;
  supplier?: string;
  notes?: string;
}

interface InventoryContextType {
  inventory: InventoryItem[];
  addItem: (item: Omit<InventoryItem, "id">) => void;
  updateItem: (id: string, item: Partial<InventoryItem>) => void;
  deleteItem: (id: string) => void;
  searchItems: (query: string) => InventoryItem[];
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
};

const dummyInventory: InventoryItem[] = [
  {
    id: "1",
    itemName: "Milk",
    purchasedPrice: 40,
    units: 10,
    unitType: "ltr",
    expectedSellingPrice: 50,
    purchasedDate: "2024-06-01",
    expiryDate: "2024-06-10",
    minStock: 5,
    category: "Dairy",
    supplier: "Local Dairy",
    notes: "Keep refrigerated",
  },
  {
    id: "2",
    itemName: "Rice",
    purchasedPrice: 60,
    units: 25,
    unitType: "kg",
    expectedSellingPrice: 70,
    purchasedDate: "2024-05-20",
    expiryDate: "2025-05-20",
    minStock: 10,
    category: "Grains",
    supplier: "Agro Supplier",
    notes: "Store in dry place",
  },
  {
    id: "3",
    itemName: "Biscuits",
    purchasedPrice: 10,
    units: 3,
    unitType: "qty",
    expectedSellingPrice: 15,
    purchasedDate: "2024-06-05",
    expiryDate: "2024-09-01",
    minStock: 5,
    category: "Snacks",
    supplier: "Bakers",
    notes: "",
  },
];

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem("inventory");
    if (!saved) return dummyInventory;
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length === 0) {
        return dummyInventory;
      }
      return parsed;
    } catch {
      return dummyInventory;
    }
  });

  useEffect(() => {
    localStorage.setItem("inventory", JSON.stringify(inventory));
  }, [inventory]);

  const addItem = (item: Omit<InventoryItem, "id">) => {
    const newItem = { ...item, id: crypto.randomUUID() };
    setInventory((prev) => [newItem, ...prev]);
  };

  const updateItem = (id: string, item: Partial<InventoryItem>) => {
    setInventory((prev) => prev.map((i) => (i.id === id ? { ...i, ...item } : i)));
  };

  const deleteItem = (id: string) => {
    setInventory((prev) => prev.filter((i) => i.id !== id));
  };

  const searchItems = (query: string) => {
    return inventory.filter((item) =>
      item.itemName.toLowerCase().includes(query.toLowerCase())
    );
  };

  return (
    <InventoryContext.Provider value={{ inventory, addItem, updateItem, deleteItem, searchItems }}>
      {children}
    </InventoryContext.Provider>
  );
}; 