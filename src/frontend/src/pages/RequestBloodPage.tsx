/**
 * User page for submitting blood requests and viewing request history with status.
 */

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useState } from "react";
import { toast } from "sonner";
import {
  EmptyState,
  ErrorState,
  InlineLoader,
} from "../components/LoadingState";
import StatusBadge from "../components/StatusBadge";
import { BLOOD_GROUPS } from "../config/constants";
import { useAuth } from "../features/auth/useAuth";
import {
  useCreateRequest,
  useGetUserRequests,
} from "../features/user/requestsApi";

export default function RequestBloodPage() {
  const { identity } = useAuth();
  const userId = identity?.getPrincipal();
  const requestsQuery = useGetUserRequests(userId);
  const createRequestMutation = useCreateRequest();
  const [formData, setFormData] = useState({
    bloodGroup: "",
    units: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.bloodGroup || !formData.units) {
      toast.error("Please fill in all required fields");
      return;
    }

    const units = Number.parseInt(formData.units);
    if (Number.isNaN(units) || units <= 0) {
      toast.error("Units must be a positive number");
      return;
    }

    try {
      await createRequestMutation.mutateAsync({
        bloodGroup: formData.bloodGroup,
        units: BigInt(units),
      });

      toast.success("Blood request submitted successfully!");
      setFormData({ bloodGroup: "", units: "" });
    } catch (error: any) {
      toast.error(error.message || "Failed to submit request");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Request Blood</h1>
        <p className="text-muted-foreground mt-1">
          Submit a blood request and track its status
        </p>
      </div>

      {/* Request Form */}
      <Card>
        <CardHeader>
          <CardTitle>Submit Blood Request</CardTitle>
          <CardDescription>
            Fill in the details below to request blood
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bloodGroup">Blood Group *</Label>
                <Select
                  value={formData.bloodGroup}
                  onValueChange={(value) =>
                    setFormData({ ...formData, bloodGroup: value })
                  }
                >
                  <SelectTrigger>
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
                <Label htmlFor="units">Units Required *</Label>
                <Input
                  id="units"
                  type="number"
                  min="1"
                  value={formData.units}
                  onChange={(e) =>
                    setFormData({ ...formData, units: e.target.value })
                  }
                  placeholder="Enter number of units"
                  required
                />
              </div>
            </div>
            <Button type="submit" disabled={createRequestMutation.isPending}>
              {createRequestMutation.isPending
                ? "Submitting..."
                : "Submit Request"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Request History */}
      <Card>
        <CardHeader>
          <CardTitle>My Requests</CardTitle>
          <CardDescription>
            View your blood request history and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {requestsQuery.isLoading ? (
            <InlineLoader />
          ) : requestsQuery.error ? (
            <ErrorState error={requestsQuery.error as Error} />
          ) : !requestsQuery.data || requestsQuery.data.length === 0 ? (
            <EmptyState message="No requests yet. Submit your first request above." />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Blood Group</TableHead>
                    <TableHead>Units</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requestsQuery.data.map((request) => (
                    <TableRow key={request.id.toString()}>
                      <TableCell>#{request.id.toString()}</TableCell>
                      <TableCell className="font-medium">
                        {request.bloodGroup}
                      </TableCell>
                      <TableCell>{request.units.toString()}</TableCell>
                      <TableCell>
                        {new Date(
                          Number(request.requestDate) / 1000000,
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={request.status} />
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
