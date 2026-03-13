/**
 * Admin-only page for managing donor records with CRUD operations.
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Principal } from "@dfinity/principal";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import AccessDeniedScreen from "../components/AccessDeniedScreen";
import {
  EmptyState,
  ErrorState,
  InlineLoader,
} from "../components/LoadingState";
import { BLOOD_GROUPS } from "../config/constants";
import { useAddDonor, useGetAllDonors } from "../features/admin/donorsApi";
import { useAuth } from "../features/auth/useAuth";

export default function DonorsPage() {
  const { isAdmin } = useAuth();
  const donorsQuery = useGetAllDonors();
  const addDonorMutation = useAddDonor();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bloodGroup: "",
    age: "",
    contact: "",
  });

  if (!isAdmin) {
    return <AccessDeniedScreen />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.bloodGroup ||
      !formData.age ||
      !formData.contact.trim()
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const age = Number.parseInt(formData.age);
    if (Number.isNaN(age) || age < 18 || age > 65) {
      toast.error("Age must be between 18 and 65");
      return;
    }

    try {
      // Generate a unique principal for the donor using random bytes
      const randomBytes = new Uint8Array(29);
      crypto.getRandomValues(randomBytes);
      const donorId = Principal.fromUint8Array(randomBytes);

      await addDonorMutation.mutateAsync({
        id: donorId,
        name: formData.name.trim(),
        bloodGroup: formData.bloodGroup,
        age: BigInt(age),
        contact: formData.contact.trim(),
        lastDonationDate: BigInt(Date.now() * 1000000), // Convert to nanoseconds
      });

      toast.success("Donor added successfully!");
      setDialogOpen(false);
      setFormData({ name: "", bloodGroup: "", age: "", contact: "" });
    } catch (error: any) {
      toast.error(error.message || "Failed to add donor");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Donor Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage blood donor records
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button data-ocid="donors.open_modal_button">
              <Plus className="h-4 w-4 mr-2" />
              Add Donor
            </Button>
          </DialogTrigger>
          <DialogContent data-ocid="donors.dialog">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Add New Donor</DialogTitle>
                <DialogDescription>
                  Enter donor information below
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    data-ocid="donors.input"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter donor name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bloodGroup">Blood Group *</Label>
                  <Select
                    value={formData.bloodGroup}
                    onValueChange={(value) =>
                      setFormData({ ...formData, bloodGroup: value })
                    }
                  >
                    <SelectTrigger data-ocid="donors.select">
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      {BLOOD_GROUPS.map((group) => (
                        <SelectItem key={group} value={group}>
                          {group}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    min="18"
                    max="65"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                    placeholder="18-65"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Number *</Label>
                  <Input
                    id="contact"
                    type="tel"
                    value={formData.contact}
                    onChange={(e) =>
                      setFormData({ ...formData, contact: e.target.value })
                    }
                    placeholder="Enter contact number"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  data-ocid="donors.cancel_button"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  data-ocid="donors.submit_button"
                  disabled={addDonorMutation.isPending}
                >
                  {addDonorMutation.isPending ? "Adding..." : "Add Donor"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registered Donors</CardTitle>
          <CardDescription>View and manage all blood donors</CardDescription>
        </CardHeader>
        <CardContent>
          {donorsQuery.isLoading ? (
            <InlineLoader />
          ) : donorsQuery.error ? (
            <ErrorState error={donorsQuery.error as Error} />
          ) : !donorsQuery.data || donorsQuery.data.length === 0 ? (
            <EmptyState
              data-ocid="donors.empty_state"
              message="No donors registered yet. Add your first donor to get started."
            />
          ) : (
            <div className="overflow-x-auto">
              <Table data-ocid="donors.table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Blood Group</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Last Donation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donorsQuery.data.map((donor, index) => (
                    <TableRow
                      key={donor.id.toString()}
                      data-ocid={`donors.item.${index + 1}`}
                    >
                      <TableCell className="font-medium">
                        {donor.name}
                      </TableCell>
                      <TableCell>{donor.bloodGroup}</TableCell>
                      <TableCell>{donor.age.toString()}</TableCell>
                      <TableCell>{donor.contact}</TableCell>
                      <TableCell>
                        {new Date(
                          Number(donor.lastDonationDate) / 1000000,
                        ).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
