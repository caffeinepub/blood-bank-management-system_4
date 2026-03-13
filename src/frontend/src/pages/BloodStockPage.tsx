/**
 * Blood stock page showing available units per blood group with search/filter and admin editing capabilities.
 */

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, Edit } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { BloodStock } from "../backend";
import {
  EmptyState,
  ErrorState,
  InlineLoader,
} from "../components/LoadingState";
import { LOW_STOCK_THRESHOLD } from "../config/constants";
import { useAuth } from "../features/auth/useAuth";
import {
  useGetAllBloodStock,
  useUpdateBloodStock,
} from "../features/user/stockApi";

export default function BloodStockPage() {
  const { isAdmin } = useAuth();
  const stockQuery = useGetAllBloodStock();
  const updateStockMutation = useUpdateBloodStock();
  const [searchTerm, setSearchTerm] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingStock, setEditingStock] = useState<BloodStock | null>(null);
  const [newUnits, setNewUnits] = useState("");

  const filteredStock = stockQuery.data?.filter((stock) =>
    stock.bloodGroup.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleEdit = (stock: BloodStock) => {
    setEditingStock(stock);
    setNewUnits(stock.unitsAvailable.toString());
    setEditDialogOpen(true);
  };

  const handleUpdateStock = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingStock) return;

    const units = Number.parseInt(newUnits);
    if (Number.isNaN(units) || units < 0) {
      toast.error("Please enter a valid number of units");
      return;
    }

    try {
      await updateStockMutation.mutateAsync({
        bloodGroup: editingStock.bloodGroup,
        unitsAvailable: BigInt(units),
      });

      toast.success("Stock updated successfully!");
      setEditDialogOpen(false);
      setEditingStock(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to update stock");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Blood Stock</h1>
        <p className="text-muted-foreground mt-1">
          View available blood units by group
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Blood Stock</CardTitle>
          <CardDescription>Current inventory of blood units</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search by blood group..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {stockQuery.isLoading ? (
            <InlineLoader />
          ) : stockQuery.error ? (
            <ErrorState error={stockQuery.error as Error} />
          ) : !filteredStock || filteredStock.length === 0 ? (
            <EmptyState
              message={
                searchTerm
                  ? "No matching blood groups found"
                  : "No blood stock available"
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Blood Group</TableHead>
                    <TableHead>Units Available</TableHead>
                    <TableHead>Status</TableHead>
                    {isAdmin && <TableHead>Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStock.map((stock) => {
                    const units = Number(stock.unitsAvailable);
                    const isLowStock = units < LOW_STOCK_THRESHOLD;

                    return (
                      <TableRow key={stock.bloodGroup}>
                        <TableCell className="font-medium text-lg">
                          {stock.bloodGroup}
                        </TableCell>
                        <TableCell className="text-lg">{units}</TableCell>
                        <TableCell>
                          {isLowStock && (
                            <div className="flex items-center gap-2 text-destructive">
                              <AlertCircle className="h-4 w-4" />
                              <span className="text-sm">Low Stock</span>
                            </div>
                          )}
                        </TableCell>
                        {isAdmin && (
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(stock)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Stock Dialog */}
      {isAdmin && (
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <form onSubmit={handleUpdateStock}>
              <DialogHeader>
                <DialogTitle>Update Blood Stock</DialogTitle>
                <DialogDescription>
                  Update units for {editingStock?.bloodGroup}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="units">Units Available *</Label>
                  <Input
                    id="units"
                    type="number"
                    min="0"
                    value={newUnits}
                    onChange={(e) => setNewUnits(e.target.value)}
                    placeholder="Enter number of units"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updateStockMutation.isPending}>
                  {updateStockMutation.isPending
                    ? "Updating..."
                    : "Update Stock"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
