import { useState } from "react";
import { Layout } from "@/components/Layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useTransactions, Transaction } from "@/contexts/transactions-context";

export default function Transactions() {
  const { transactions, addTransaction } = useTransactions();
  const { toast } = useToast();

  const [newTransaction, setNewTransaction] = useState<Omit<Transaction, "id">>({
    description: "",
    amount: 0,
    type: "expense",
    category: "",
    date: new Date().toISOString().split('T')[0],
  });

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    addTransaction(newTransaction);
    setNewTransaction({
      description: "",
      amount: 0,
      type: "expense",
      category: "",
      date: new Date().toISOString().split('T')[0],
    });
    toast({
      title: "Success",
      description: "New transaction has been added successfully.",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6 mt-16">
        {/* Add New Transaction Form */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Transaction</CardTitle>
            <CardDescription>Enter the details of the new transaction</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Input
                    placeholder="Description"
                    value={newTransaction.description}
                    onChange={(e) =>
                      setNewTransaction({ ...newTransaction, description: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={newTransaction.amount}
                    onChange={(e) =>
                      setNewTransaction({ ...newTransaction, amount: Number(e.target.value) })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Select
                    value={newTransaction.type}
                    onValueChange={(value: "income" | "expense") =>
                      setNewTransaction({ ...newTransaction, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Select
                    value={newTransaction.category}
                    onValueChange={(value) =>
                      setNewTransaction({ ...newTransaction, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Utilities">Utilities</SelectItem>
                      <SelectItem value="Rent">Rent</SelectItem>
                      <SelectItem value="Salary">Salary</SelectItem>
                      <SelectItem value="Investment">Investment</SelectItem>
                      <SelectItem value="Others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Input
                    type="date"
                    value={newTransaction.date}
                    onChange={(e) =>
                      setNewTransaction({ ...newTransaction, date: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <Button type="submit">Add Transaction</Button>
            </form>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card>
          <CardHeader>
            <CardTitle>All Transactions</CardTitle>
            <CardDescription>View and manage all your transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell className={transaction.type === "income" ? "text-green-600" : "text-red-600"}>
                        ₹{transaction.amount.toLocaleString()}
                      </TableCell>
                      <TableCell className="capitalize">{transaction.type}</TableCell>
                      <TableCell>{transaction.category}</TableCell>
                      <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
