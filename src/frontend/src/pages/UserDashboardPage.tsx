/**
 * User dashboard with summary cards showing available blood stock and request statistics.
 */

import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { Clock, Droplet, FileText } from "lucide-react";
import { Variant_pending_approved_rejected } from "../backend";
import { InlineLoader } from "../components/LoadingState";
import SummaryCard from "../components/SummaryCard";
import { useAuth } from "../features/auth/useAuth";
import { useGetUserRequests } from "../features/user/requestsApi";
import { useGetAllBloodStock } from "../features/user/stockApi";

export default function UserDashboardPage() {
  const { identity } = useAuth();
  const navigate = useNavigate();
  const stockQuery = useGetAllBloodStock();
  const userId = identity?.getPrincipal();
  const requestsQuery = useGetUserRequests(userId);

  const totalGroups = stockQuery.data?.length || 0;
  const totalUnits =
    stockQuery.data?.reduce(
      (sum, stock) => sum + Number(stock.unitsAvailable),
      0,
    ) || 0;
  const myRequests = requestsQuery.data?.length || 0;
  const pendingRequests =
    requestsQuery.data?.filter(
      (r) => r.status === Variant_pending_approved_rejected.pending,
    ).length || 0;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="pb-6 border-b border-border">
        <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-1">
          Member Portal
        </p>
        <h1 className="font-heading text-3xl font-bold text-foreground">
          Your Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          View blood availability and manage your requests
        </p>
      </div>

      {/* Summary Cards */}
      {stockQuery.isLoading || requestsQuery.isLoading ? (
        <InlineLoader />
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <SummaryCard
            title="Blood Groups Available"
            value={totalGroups}
            description={`${totalUnits} total units`}
            icon={Droplet}
          />
          <SummaryCard
            title="My Requests"
            value={myRequests}
            description="Total requests submitted"
            icon={FileText}
          />
          <SummaryCard
            title="Pending Requests"
            value={pendingRequests}
            description="Awaiting approval"
            icon={Clock}
          />
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="font-heading text-lg font-semibold text-foreground mb-4">
          Quick Actions
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Button
            size="lg"
            className="h-24 font-semibold"
            data-ocid="user.view_stock.primary_button"
            onClick={() => navigate({ to: "/blood-stock" })}
          >
            <Droplet className="h-6 w-6 mr-2" />
            View Blood Stock
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-24 font-semibold"
            data-ocid="user.request_blood.secondary_button"
            onClick={() => navigate({ to: "/request-blood" })}
          >
            <FileText className="h-6 w-6 mr-2" />
            Request Blood
          </Button>
        </div>
      </div>
    </div>
  );
}
