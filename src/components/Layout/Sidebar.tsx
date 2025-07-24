import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Calculator,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Home,
  Receipt,
  Upload,
  CreditCard,
  PieChart,
  X,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigationItems = [
  { name: "Dashboard", icon: Home, path: "/dashboard" },
  { name: "Inventory", icon: Package, path: "/inventory" },
  { name: "Transactions", icon: Receipt, path: "/transactions" },
  { name: "Track Finances", icon: Calculator, path: "/finances" },
  { name: "Profit & Loss", icon: TrendingUp, path: "/profit-loss" },
  { name: "Loans", icon: DollarSign, path: "/loans" },
  { name: "Rents", icon: CreditCard, path: "/rents" },
  { name: "Bills to Pay", icon: Receipt, path: "/bills" },
  { name: "Upload Invoice", icon: Upload, path: "/upload-invoice" },
  { name: "Sales Data", icon: TrendingDown, path: "/sales" },
  { name: "Reports", icon: PieChart, path: "/reports" },
  { name: "Testing1", icon: PieChart, path: "/reports" },
  { name: "Testing2", icon: PieChart, path: "/reports" },
];

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 w-64 h-[calc(100vh-8rem)] bg-sidebar text-sidebar-foreground transform transition-transform duration-300 ease-in-out z-40 border-r border-sidebar-border",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0"
        )}
        style={{
          top: '4rem' // header height
        }}
      >
        {/* Mobile close button */}
        <div className="flex justify-end p-4 lg:hidden">
          <Button variant="ghost" size="icon" onClick={onClose} className="text-sidebar-foreground">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex flex-col gap-2 p-4 h-[calc(100%-4rem)] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-smooth text-sm font-medium",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-elegant"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
};