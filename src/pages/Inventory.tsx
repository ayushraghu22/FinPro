import { useState } from "react";
import { Layout } from "@/components/Layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useInventory, UnitType } from "@/contexts/inventory-context";
// Removed Select import, will use Input for unit type
import { AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Removed unitTypes, will use free text input

export default function Inventory() {
  const { inventory, addItem, searchItems } = useInventory();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    itemName: "",
    purchasedPrice: "",
    units: "",
    unitType: "kg" as UnitType,
    expectedSellingPrice: "",
    purchasedDate: new Date().toISOString().split("T")[0],
    expiryDate: "",
    minStock: 5,
    category: "",
    supplier: "",
    notes: "",
  });

  const filtered = search ? searchItems(search) : inventory;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addItem({
      ...newItem,
      purchasedPrice: Number(newItem.purchasedPrice),
      units: Number(newItem.units),
      expectedSellingPrice: Number(newItem.expectedSellingPrice),
      minStock: Number(newItem.minStock),
    });
    setNewItem({
      itemName: "",
      purchasedPrice: "",
      units: "",
      unitType: "kg",
      expectedSellingPrice: "",
      purchasedDate: new Date().toISOString().split("T")[0],
      expiryDate: "",
      minStock: 5,
      category: "",
      supplier: "",
      notes: "",
    });
    setOpen(false);
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6 mt-16">
        <Card>
          <CardHeader>
            <CardTitle>Inventory</CardTitle>
            <CardDescription>Manage your store's inventory, add new items, and track low stock.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <Input
                placeholder="Search by item name..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="max-w-xs"
              />
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="ml-auto w-fit">Add Item</Button>
                </DialogTrigger>
                <DialogContent className="z-[70]">
                  <DialogHeader>
                    <DialogTitle>Add New Inventory Item</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAdd} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Item Name</label>
                        <Input
                          placeholder="e.g. Sugar"
                          value={newItem.itemName}
                          onChange={e => setNewItem({ ...newItem, itemName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Purchased Price</label>
                        <Input
                          type="number"
                          placeholder="e.g. 50"
                          value={newItem.purchasedPrice}
                          min={0}
                          onChange={e => setNewItem({ ...newItem, purchasedPrice: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Units</label>
                        <Input
                          type="number"
                          placeholder="e.g. 10"
                          value={newItem.units}
                          min={0}
                          onChange={e => setNewItem({ ...newItem, units: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Unit Type</label>
                        <Input
                          placeholder="e.g. kg, ltr, qty"
                          value={newItem.unitType}
                          onChange={e => setNewItem({ ...newItem, unitType: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Expected Selling Price</label>
                        <Input
                          type="number"
                          placeholder="e.g. 60"
                          value={newItem.expectedSellingPrice}
                          min={0}
                          onChange={e => setNewItem({ ...newItem, expectedSellingPrice: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Purchased Date</label>
                        <Input
                          type="date"
                          value={newItem.purchasedDate}
                          onChange={e => setNewItem({ ...newItem, purchasedDate: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                        <Input
                          type="date"
                          value={newItem.expiryDate}
                          onChange={e => setNewItem({ ...newItem, expiryDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Minimum Stock</label>
                        <Input
                          type="number"
                          placeholder="e.g. 5"
                          value={newItem.minStock}
                          min={0}
                          onChange={e => setNewItem({ ...newItem, minStock: Number(e.target.value) })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <Input
                          placeholder="e.g. Snacks"
                          value={newItem.category}
                          onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Supplier</label>
                        <Input
                          placeholder="e.g. Local Supplier"
                          value={newItem.supplier}
                          onChange={e => setNewItem({ ...newItem, supplier: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Notes</label>
                        <Input
                          placeholder="e.g. Store in cool place"
                          value={newItem.notes}
                          onChange={e => setNewItem({ ...newItem, notes: e.target.value })}
                        />
                      </div>
                    </div>
                    <Button type="submit">Add Item</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <div className="rounded-md border overflow-x-auto mb-8">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Purchased Price</TableHead>
                    <TableHead>Units</TableHead>
                    <TableHead>Unit Type</TableHead>
                    <TableHead>Expected Selling Price</TableHead>
                    <TableHead>Purchased Date</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(item => (
                    <TableRow key={item.id} className={item.units < item.minStock ? "bg-orange-50" : undefined}>
                      <TableCell className="font-medium flex items-center gap-2">
                        {item.itemName}
                        {item.units < item.minStock && (
                          <AlertTriangle className="inline h-4 w-4 text-orange-600" />
                        )}
                      </TableCell>
                      <TableCell>₹{item.purchasedPrice.toLocaleString()}</TableCell>
                      <TableCell>{item.units}</TableCell>
                      <TableCell>{item.unitType}</TableCell>
                      <TableCell>₹{item.expectedSellingPrice.toLocaleString()}</TableCell>
                      <TableCell>{new Date(item.purchasedDate).toLocaleDateString()}</TableCell>
                      <TableCell>{item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : "-"}</TableCell>
                      <TableCell>{item.category || "-"}</TableCell>
                      <TableCell>{item.supplier || "-"}</TableCell>
                      <TableCell>{item.notes || "-"}</TableCell>
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