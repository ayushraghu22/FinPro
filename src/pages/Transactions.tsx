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
import { useTransactions } from "@/contexts/transactions-context";

type TransactionForm = {
  itemName: string;
  units: string | number;
  sellingDate: string;
  purchasingPrice: string | number;
  expectedSellingPrice: string | number;
  description: string;
};

export default function Transactions() {
  const { transactions, addTransaction } = useTransactions();
  const { toast } = useToast();

  const [newTransaction, setNewTransaction] = useState<TransactionForm>({
    itemName: "",
    units: "",
    sellingDate: new Date().toISOString().split('T')[0],
    purchasingPrice: "",
    expectedSellingPrice: "",
    description: "",
  });

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    addTransaction({
      ...newTransaction,
      units: Number(newTransaction.units),
      purchasingPrice: Number(newTransaction.purchasingPrice),
      expectedSellingPrice: Number(newTransaction.expectedSellingPrice),
    } as any);
    setNewTransaction({
      itemName: "",
      units: "",
      sellingDate: new Date().toISOString().split('T')[0],
      purchasingPrice: "",
      expectedSellingPrice: "",
      description: "",
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
                  <label className="block text-sm font-medium text-gray-700">Item name</label>
                  <Input
                    placeholder="e.g. LED TV"
                    value={newTransaction.itemName}
                    onChange={(e) => setNewTransaction({ ...newTransaction, itemName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Units</label>
                  <Input
                    type="number"
                    value={newTransaction.units}
                    min={1}
                    onChange={(e) => setNewTransaction({ ...newTransaction, units: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Selling Date</label>
                  <Input
                    type="date"
                    value={newTransaction.sellingDate}
                    onChange={(e) => setNewTransaction({ ...newTransaction, sellingDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Purchasing Price</label>
                  <Input
                    type="number"
                    value={newTransaction.purchasingPrice}
                    min={0}
                    onChange={(e) => setNewTransaction({ ...newTransaction, purchasingPrice: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Expected Selling Price</label>
                  <Input
                    type="number"
                    value={newTransaction.expectedSellingPrice}
                    min={0}
                    onChange={(e) => setNewTransaction({ ...newTransaction, expectedSellingPrice: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <Input
                    placeholder="e.g. 42-inch Smart LED TV"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
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
                    <TableHead>Item Name</TableHead>
                    <TableHead>Units</TableHead>
                    <TableHead>Selling Date</TableHead>
                    <TableHead>Purchasing Price</TableHead>
                    <TableHead>Expected Selling Price</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...transactions]
                    .sort((a, b) => new Date(b.sellingDate).getTime() - new Date(a.sellingDate).getTime())
                    .map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.itemName}</TableCell>
                        <TableCell>{transaction.units}</TableCell>
                        <TableCell>{new Date(transaction.sellingDate).toLocaleDateString()}</TableCell>
                        <TableCell>₹{transaction.purchasingPrice.toLocaleString()}</TableCell>
                        <TableCell>₹{transaction.expectedSellingPrice.toLocaleString()}</TableCell>
                        <TableCell>{transaction.description}</TableCell>
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
