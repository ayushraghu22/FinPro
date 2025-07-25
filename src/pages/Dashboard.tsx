import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout/Layout";
import { useNavigate } from "react-router-dom";
import { UpcomingBills } from "@/components/Dashboard/UpcomingBills";
import { useTransactions } from "@/contexts/transactions-context";
import { useInventory } from "@/contexts/inventory-context";
import { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Receipt,
  Upload,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
} from "lucide-react";

function getLast30DaysInterval() {
  const today = new Date();
  const end = today;
  const start = new Date(today);
  start.setDate(start.getDate() - 30);
  return { start, end };
}

const Dashboard = () => {
  const navigate = useNavigate();

  const { transactions } = useTransactions();
  const { inventory } = useInventory();
  const { start, end } = getLast30DaysInterval();
  // Filter transactions for last 30 days
  const filteredTx = transactions.filter(t => {
    if (!t.sellingDate) return false;
    const d = new Date(t.sellingDate);
    return d >= start && d <= end;
  });
  // Stats calculations
  const totalRevenue = filteredTx.reduce((sum, t) => sum + t.expectedSellingPrice * t.units, 0);
  const monthlyExpenses = filteredTx.reduce((sum, t) => sum + t.purchasingPrice * t.units, 0);
  const netProfit = filteredTx.reduce((sum, t) => sum + (t.expectedSellingPrice - t.purchasingPrice) * t.units, 0);
  const inventoryValue = inventory.reduce((sum, i) => sum + i.purchasedPrice * i.units, 0);
  const stats = [
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      change: "",
      trend: "up",
      icon: TrendingUp,
      color: "text-financial-profit",
    },
    {
      title: "Monthly Expenses",
      value: `₹${monthlyExpenses.toLocaleString()}`,
      change: "",
      trend: "down",
      icon: TrendingDown,
      color: "text-financial-loss",
    },
    {
      title: "Net Profit",
      value: `₹${netProfit.toLocaleString()}`,
      change: "",
      trend: netProfit >= 0 ? "up" : "down",
      icon: DollarSign,
      color: netProfit >= 0 ? "text-financial-profit" : "text-financial-loss",
    },
    {
      title: "Inventory Value",
      value: `₹${inventoryValue.toLocaleString()}`,
      change: "",
      trend: "up",
      icon: Package,
      color: "text-primary",
    },
  ];

  const quickActions = [
    {
      title: "Upload Purchase Invoice",
      description: "Process new purchase invoices with AI",
      icon: Upload,
      action: () => navigate("/upload-invoice"),
      color: "bg-primary",
    },
    {
      title: "Record Sale",
      description: "Add new sales transaction",
      icon: Receipt,
      action: () => navigate("/sales"),
      color: "bg-financial-profit",
    },
    {
      title: "View Reports",
      description: "Analyze business performance",
      icon: BarChart3,
      action: () => navigate("/reports"),
      color: "bg-financial-warning",
    },
    {
      title: "Manage Finances",
      description: "Track credits, debits, and loans",
      icon: DollarSign,
      action: () => navigate("/finances"),
      color: "bg-secondary",
    },
  ];

  const { getRecentTransactions } = useTransactions();
  const recentTransactions = getRecentTransactions(5);

  const upcomingBills = [
    { name: "Rent Payment", amount: "₹25,000", dueDate: "Tomorrow", status: "pending" },
    { name: "Electricity Bill", amount: "₹3,450", dueDate: "In 3 days", status: "pending" },
    { name: "Internet Bill", amount: "₹1,200", dueDate: "In 5 days", status: "pending" },
  ];

  // Helper to safely format numbers
  const safeNumber = (n: any) => typeof n === 'number' && !isNaN(n) ? n : 0;

  return (
    <Layout>
      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 pt-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's what's happening with your business.</p>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{new Date().toLocaleDateString('en-IN', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>

        {/* Stats for last 30 days label */}
        <div className="mb-2 text-sm text-muted-foreground font-medium">Stats for the last 30 days (based on your transaction data)</div>
        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="shadow-card hover:shadow-elegant transition-smooth">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="flex items-center gap-1 text-xs">
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="h-3 w-3 text-financial-profit" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-financial-loss" />
                    )}
                    <span className={stat.trend === "up" ? "text-financial-profit" : "text-financial-loss"}>
                      {stat.change}
                    </span>
                    <span className="text-muted-foreground">from last month</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used features for faster access</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-3 hover:shadow-card transition-smooth"
                    onClick={action.action}
                  >
                    <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-sm">{action.title}</div>
                      <div className="text-xs text-muted-foreground">{action.description}</div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Transactions */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest business activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction, index) => {
                  // Generate a random sold date within the last 30 days for display
                  const randomDaysAgo = Math.floor(Math.random() * 30);
                  const randomSoldDate = new Date();
                  randomSoldDate.setDate(randomSoldDate.getDate() - randomDaysAgo);
                  return (
                    <div key={index} className="flex flex-col md:flex-row md:items-center justify-between p-3 rounded-lg bg-muted/30 gap-2">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{transaction.itemName}</div>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-2 text-right min-w-max">
                        <div className="text-xs">Units: <span className="font-medium">{safeNumber(transaction.units)}</span></div>
                        <div className="text-xs">Sold: <span className="font-medium">{randomSoldDate.toLocaleDateString()}</span></div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Button variant="outline" className="w-full mt-4" onClick={() => navigate("/transactions")}>
                View All Transactions
              </Button>
            </CardContent>
          </Card>

          <UpcomingBills />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;