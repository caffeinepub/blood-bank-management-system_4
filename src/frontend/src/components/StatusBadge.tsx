/**
 * Status badge component for displaying request status with appropriate colors.
 */

import { Badge } from "@/components/ui/badge";
import { Variant_pending_approved_rejected } from "../backend";

interface StatusBadgeProps {
  status: Variant_pending_approved_rejected;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getVariant = () => {
    switch (status) {
      case Variant_pending_approved_rejected.pending:
        return "secondary";
      case Variant_pending_approved_rejected.approved:
        return "default";
      case Variant_pending_approved_rejected.rejected:
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getLabel = () => {
    switch (status) {
      case Variant_pending_approved_rejected.pending:
        return "Pending";
      case Variant_pending_approved_rejected.approved:
        return "Approved";
      case Variant_pending_approved_rejected.rejected:
        return "Rejected";
      default:
        return "Unknown";
    }
  };

  return <Badge variant={getVariant()}>{getLabel()}</Badge>;
}
