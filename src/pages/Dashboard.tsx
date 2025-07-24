import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout/Layout";
import { useNavigate } from "react-router-dom";
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

const Dashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: "Total Revenue",
      value: "₹2,45,670",
      change: "+12.5%",
      trend: "up",
      icon: TrendingUp,
      color: "text-financial-profit",
    },
    {
      title: "Monthly Expenses",
      value: "₹1,89,430",
      change: "-3.2%",
      trend: "down",
      icon: TrendingDown,
      color: "text-financial-loss",
    },
    {
      title: "Net Profit",
      value: "₹56,240",
      change: "+8.1%",
      trend: "up",
      icon: DollarSign,
      color: "text-financial-profit",
    },
    {
      title: "Inventory Value",
      value: "₹3,78,920",
      change: "+5.4%",
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

  const recentTransactions = [
    { type: "Sale", amount: "+₹2,450", description: "Customer #1234", time: "2 hours ago" },
    { type: "Purchase", amount: "-₹1,200", description: "Supplier ABC Ltd", time: "4 hours ago" },
    { type: "Sale", amount: "+₹3,670", description: "Customer #1235", time: "6 hours ago" },
    { type: "Expense", amount: "-₹850", description: "Electricity Bill", time: "1 day ago" },
    { type: "Sale", amount: "+₹1,950", description: "Customer #1236", time: "1 day ago" },
  ];

  const upcomingBills = [
    { name: "Rent Payment", amount: "₹25,000", dueDate: "Tomorrow", status: "pending" },
    { name: "Electricity Bill", amount: "₹3,450", dueDate: "In 3 days", status: "pending" },
    { name: "Internet Bill", amount: "₹1,200", dueDate: "In 5 days", status: "pending" },
  ];

  return (
    <Layout>
      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
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
                {recentTransactions.map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div>
                      <div className="font-medium text-sm">{transaction.type}</div>
                      <div className="text-xs text-muted-foreground">{transaction.description}</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium text-sm ${
                        transaction.amount.startsWith('+') ? 'text-financial-profit' : 'text-financial-loss'
                      }`}>
                        {transaction.amount}
                      </div>
                      <div className="text-xs text-muted-foreground">{transaction.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" onClick={() => navigate("/finances")}>
                View All Transactions
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Bills */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Upcoming Bills</CardTitle>
              <CardDescription>Bills due for payment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingBills.map((bill, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div>
                      <div className="font-medium text-sm">{bill.name}</div>
                      <div className="text-xs text-muted-foreground">Due: {bill.dueDate}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-sm text-financial-loss">{bill.amount}</div>
                      <div className="text-xs text-financial-warning">Pending</div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" onClick={() => navigate("/bills")}>
                Manage All Bills
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;