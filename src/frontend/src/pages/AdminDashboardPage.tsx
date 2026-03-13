/**
 * Admin dashboard with summary cards, sample data initialization, and request moderation.
 */

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Database, Droplet, FileText, Users } from "lucide-react";
import { toast } from "sonner";
import { Variant_pending_approved_rejected } from "../backend";
import AccessDeniedScreen from "../components/AccessDeniedScreen";
import {
  EmptyState,
  ErrorState,
  InlineLoader,
} from "../components/LoadingState";
import StatusBadge from "../components/StatusBadge";
import SummaryCard from "../components/SummaryCard";
import { useGetAllDonors } from "../features/admin/donorsApi";
import {
  useGetRequestsByStatus,
  useUpdateRequestStatus,
} from "../features/admin/requestsApi";
import { useInitSampleData } from "../features/admin/sampleData";
import { useAuth } from "../features/auth/useAuth";
import { useGetAllBloodStock } from "../features/user/stockApi";

export default function AdminDashboardPage() {
  const { isAdmin } = useAuth();
  const donorsQuery = useGetAllDonors();
  const stockQuery = useGetAllBloodStock();
  const pendingRequestsQuery = useGetRequestsByStatus(
    Variant_pending_approved_rejected.pending,
  );
  const initSampleDataMutation = useInitSampleData();
  const updateStatusMutation = useUpdateRequestStatus();

  if (!isAdmin) {
    return <AccessDeniedScreen />;
  }

  const handleInitSampleData = async () => {
    try {
      await initSampleDataMutation.mutateAsync();
      toast.success("Sample data initialized successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to initialize sample data");
    }
  };

  const handleApprove = async (requestId: bigint) => {
    try {
      await updateStatusMutation.mutateAsync({
        requestId,
        status: Variant_pending_approved_rejected.approved,
      });
      toast.success("Request approved");
    } catch (error: any) {
      toast.error(error.message || "Failed to approve request");
    }
  };

  const handleReject = async (requestId: bigint) => {
    try {
      await updateStatusMutation.mutateAsync({
        requestId,
        status: Variant_pending_approved_rejected.rejected,
      });
      toast.success("Request rejected");
    } catch (error: any) {
      toast.error(error.message || "Failed to reject request");
    }
  };

  const totalDonors = donorsQuery.data?.length || 0;
  const totalStock =
    stockQuery.data?.reduce(
      (sum, stock) => sum + Number(stock.unitsAvailable),
      0,
    ) || 0;
  const pendingRequests = pendingRequestsQuery.data?.length || 0;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="pb-6 border-b border-border">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-1">
              Administration
            </p>
            <h1 className="font-heading text-3xl font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage blood bank operations and oversee requests
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                data-ocid="admin.init_data.open_modal_button"
              >
                <Database className="h-4 w-4 mr-2" />
                Initialize Sample Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent data-ocid="admin.init_data.dialog">
              <AlertDialogHeader>
                <AlertDialogTitle>Initialize Sample Data?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will clear existing donors and stock data and populate
                  the system with sample data for demonstration purposes.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel data-ocid="admin.init_data.cancel_button">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  data-ocid="admin.init_data.confirm_button"
                  onClick={handleInitSampleData}
                  disabled={initSampleDataMutation.isPending}
                >
                  {initSampleDataMutation.isPending
                    ? "Initializing..."
                    : "Initialize"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          title="Total Donors"
          value={totalDonors}
          description="Registered blood donors"
          icon={Users}
        />
        <SummaryCard
          title="Blood Units Available"
          value={totalStock}
          description="Total units in stock"
          icon={Droplet}
        />
        <SummaryCard
          title="Pending Requests"
          value={pendingRequests}
          description="Awaiting approval"
          icon={FileText}
        />
      </div>

      {/* Pending Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Pending Blood Requests</CardTitle>
          <CardDescription>
            Review and approve or reject blood requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingRequestsQuery.isLoading ? (
            <InlineLoader />
          ) : pendingRequestsQuery.error ? (
            <ErrorState error={pendingRequestsQuery.error as Error} />
          ) : !pendingRequestsQuery.data ||
            pendingRequestsQuery.data.length === 0 ? (
            <EmptyState message="No pending requests" />
          ) : (
            <div className="overflow-x-auto">
              <Table data-ocid="admin.requests.table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Blood Group</TableHead>
                    <TableHead>Units</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingRequestsQuery.data.map((request, idx) => (
                    <TableRow
                      key={request.id.toString()}
                      data-ocid={`admin.requests.item.${idx + 1}`}
                    >
                      <TableCell>#{request.id.toString()}</TableCell>
                      <TableCell className="font-medium">
                        {request.bloodGroup}
                      </TableCell>
                      <TableCell>{request.units.toString()}</TableCell>
                      <TableCell>
                        <StatusBadge status={request.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            data-ocid="admin.requests.approve.button"
                            onClick={() => handleApprove(request.id)}
                            disabled={updateStatusMutation.isPending}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            data-ocid="admin.requests.delete_button"
                            onClick={() => handleReject(request.id)}
                            disabled={updateStatusMutation.isPending}
                          >
                            Reject
                          </Button>
                        </div>
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
