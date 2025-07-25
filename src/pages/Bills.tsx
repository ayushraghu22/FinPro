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

import { useBills, Bill } from "@/contexts/bills-context";

export default function Bills() {
  const { bills, addBill, updateBillStatus } = useBills();
  const [sortField, setSortField] = useState<keyof Bill>("dueDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const { toast } = useToast();

  const [newBill, setNewBill] = useState<Omit<Bill, "id">>({
    description: "",
    amount: 0,
    dueDate: "",
    status: "pending",
    category: "",
  });

  const handleSort = (field: keyof Bill) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedBills = [...bills].sort((a, b) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dateA = new Date(a.dueDate);
    const dateB = new Date(b.dueDate);
    dateA.setHours(0, 0, 0, 0);
    dateB.setHours(0, 0, 0, 0);

    // First, separate pending and paid bills
    if (a.status === "pending" && b.status === "paid") return -1;
    if (a.status === "paid" && b.status === "pending") return 1;

    // For pending bills, put upcoming bills first
    if (a.status === "pending" && b.status === "pending") {
      const aIsUpcoming = dateA >= today;
      const bIsUpcoming = dateB >= today;
      if (aIsUpcoming && !bIsUpcoming) return -1;
      if (!aIsUpcoming && bIsUpcoming) return 1;

      // If both are upcoming or both are past, sort by date
      if (aIsUpcoming === bIsUpcoming) {
        return sortOrder === "asc"
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      }
    }

    // Then sort by the selected field
    if (sortField === "dueDate") {
      return sortOrder === "asc"
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    }

    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    }

    return sortOrder === "asc"
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  const handleAddBill = (e: React.FormEvent) => {
    e.preventDefault();
    addBill(newBill);
    setNewBill({
      description: "",
      amount: 0,
      dueDate: "",
      status: "pending",
      category: "",
    });
    toast({
      title: "Success",
      description: "New bill has been added successfully.",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6 mt-16">
        {/* Add New Bill Form */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Bill</CardTitle>
            <CardDescription>Enter the details of the new bill to be added</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddBill} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Input
                    placeholder="Description"
                    value={newBill.description}
                    onChange={(e) =>
                      setNewBill({ ...newBill, description: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={newBill.amount}
                    onChange={(e) =>
                      setNewBill({ ...newBill, amount: Number(e.target.value) })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    type="date"
                    value={newBill.dueDate}
                    onChange={(e) =>
                      setNewBill({ ...newBill, dueDate: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Select
                    value={newBill.category}
                    onValueChange={(value) =>
                      setNewBill({ ...newBill, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Utilities">Utilities</SelectItem>
                      <SelectItem value="Rent">Rent</SelectItem>
                      <SelectItem value="Insurance">Insurance</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit">Add Bill</Button>
            </form>
          </CardContent>
        </Card>

        {/* Bills List */}
        <Card>
          <CardHeader>
            <CardTitle>Bills List</CardTitle>
            <CardDescription>Manage and track all your bills</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead onClick={() => handleSort("description")} className="cursor-pointer">
                      Description {sortField === "description" && (sortOrder === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead onClick={() => handleSort("amount")} className="cursor-pointer">
                      Amount {sortField === "amount" && (sortOrder === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead onClick={() => handleSort("dueDate")} className="cursor-pointer">
                      Due Date {sortField === "dueDate" && (sortOrder === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead onClick={() => handleSort("category")} className="cursor-pointer">
                      Category {sortField === "category" && (sortOrder === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead onClick={() => handleSort("status")} className="cursor-pointer">
                      Status {sortField === "status" && (sortOrder === "asc" ? "↑" : "↓")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedBills.map((bill) => {
                    const dueDate = new Date(bill.dueDate);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    dueDate.setHours(0, 0, 0, 0);
                    const isUpcoming = dueDate >= today;

                    return (
                      <TableRow 
                        key={bill.id}
                        className={bill.status === "pending" && isUpcoming ? "bg-orange-50" : undefined}
                      >
                        <TableCell>{bill.description}</TableCell>
                        <TableCell>₹{bill.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{new Date(bill.dueDate).toLocaleDateString()}</span>
                            {bill.status === "pending" && isUpcoming && (
                              <span className="text-xs text-orange-600">Upcoming</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{bill.category}</TableCell>
                        <TableCell>
                          <Button
                            variant={bill.status === "paid" ? "outline" : "default"}
                            onClick={() => {
                              updateBillStatus(bill.id, bill.status === "paid" ? "pending" : "paid");
                            }}
                          >
                            {bill.status === "paid" ? "Paid" : "Mark as Paid"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
