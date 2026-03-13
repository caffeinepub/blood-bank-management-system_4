/**
 * Admin-only page to view, filter, and manage all blood requests.
 * Supports approving and rejecting pending requests.
 */

import { Badge } from "@/components/ui/badge";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Variant_pending_approved_rejected } from "../backend";
import AccessDeniedScreen from "../components/AccessDeniedScreen";
import {
  EmptyState,
  ErrorState,
  InlineLoader,
} from "../components/LoadingState";
import {
  useGetRequestsByStatus,
  useUpdateRequestStatus,
} from "../features/admin/requestsApi";
import { useAuth } from "../features/auth/useAuth";

type StatusFilter = "pending" | "approved" | "rejected";

function statusVariant(
  status: Variant_pending_approved_rejected,
): "default" | "secondary" | "destructive" {
  if (status === Variant_pending_approved_rejected.approved) return "default";
  if (status === Variant_pending_approved_rejected.rejected)
    return "destructive";
  return "secondary";
}

function RequestsTable({ statusFilter }: { statusFilter: StatusFilter }) {
  const status = Variant_pending_approved_rejected[statusFilter];
  const requestsQuery = useGetRequestsByStatus(status);
  const updateMutation = useUpdateRequestStatus();

  const handleApprove = async (requestId: bigint) => {
    try {
      await updateMutation.mutateAsync({
        requestId,
        status: Variant_pending_approved_rejected.approved,
      });
      toast.success("Request approved successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to approve request");
    }
  };

  const handleReject = async (requestId: bigint) => {
    try {
      await updateMutation.mutateAsync({
        requestId,
        status: Variant_pending_approved_rejected.rejected,
      });
      toast.success("Request rejected");
    } catch (error: any) {
      toast.error(error.message || "Failed to reject request");
    }
  };

  if (requestsQuery.isLoading) {
    return <InlineLoader />;
  }

  if (requestsQuery.error) {
    return <ErrorState error={requestsQuery.error as Error} />;
  }

  const requests = requestsQuery.data ?? [];

  if (requests.length === 0) {
    return (
      <EmptyState
        data-ocid={`requests.${statusFilter}.empty_state`}
        message={`No ${statusFilter} requests found.`}
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table data-ocid={`requests.${statusFilter}.table`}>
        <TableHeader>
          <TableRow>
            <TableHead>Request ID</TableHead>
            <TableHead>Blood Group</TableHead>
            <TableHead>Units</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            {statusFilter === "pending" && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request, index) => (
            <TableRow
              key={request.id.toString()}
              data-ocid={`requests.item.${index + 1}`}
            >
              <TableCell className="font-mono text-xs">
                #{request.id.toString()}
              </TableCell>
              <TableCell>
                <span className="font-semibold text-destructive">
                  {request.bloodGroup}
                </span>
              </TableCell>
              <TableCell>{request.units.toString()} units</TableCell>
              <TableCell>
                {new Date(
                  Number(request.requestDate) / 1000000,
                ).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Badge variant={statusVariant(request.status)}>
                  {request.status ===
                    Variant_pending_approved_rejected.pending && (
                    <Clock className="h-3 w-3 mr-1" />
                  )}
                  {request.status ===
                    Variant_pending_approved_rejected.approved && (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  )}
                  {request.status ===
                    Variant_pending_approved_rejected.rejected && (
                    <XCircle className="h-3 w-3 mr-1" />
                  )}
                  {request.status}
                </Badge>
              </TableCell>
              {statusFilter === "pending" && (
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      data-ocid={`requests.item.${index + 1}.confirm_button`}
                      disabled={updateMutation.isPending}
                      onClick={() => handleApprove(request.id)}
                    >
                      <CheckCircle className="h-3.5 w-3.5 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      data-ocid={`requests.item.${index + 1}.delete_button`}
                      disabled={updateMutation.isPending}
                      onClick={() => handleReject(request.id)}
                    >
                      <XCircle className="h-3.5 w-3.5 mr-1" />
                      Reject
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function ManageRequestsPage() {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<StatusFilter>("pending");

  if (!isAdmin) {
    return <AccessDeniedScreen />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Manage Requests</h1>
        <p className="text-muted-foreground mt-1">
          Review and action blood requests from users
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Blood Requests</CardTitle>
          <CardDescription>
            Filter requests by status and take action on pending ones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as StatusFilter)}
          >
            <TabsList className="mb-4" data-ocid="requests.filter.tab">
              <TabsTrigger value="pending" data-ocid="requests.pending.tab">
                <Clock className="h-4 w-4 mr-1.5" />
                Pending
              </TabsTrigger>
              <TabsTrigger value="approved" data-ocid="requests.approved.tab">
                <CheckCircle className="h-4 w-4 mr-1.5" />
                Approved
              </TabsTrigger>
              <TabsTrigger value="rejected" data-ocid="requests.rejected.tab">
                <XCircle className="h-4 w-4 mr-1.5" />
                Rejected
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              <RequestsTable statusFilter="pending" />
            </TabsContent>
            <TabsContent value="approved">
              <RequestsTable statusFilter="approved" />
            </TabsContent>
            <TabsContent value="rejected">
              <RequestsTable statusFilter="rejected" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
