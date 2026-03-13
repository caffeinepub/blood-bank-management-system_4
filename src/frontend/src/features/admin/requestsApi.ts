/**
 * Admin API wrapper for request moderation with React Query integration.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Request } from "../../backend";
import type { Variant_pending_approved_rejected } from "../../backend";
import { useActor } from "../../hooks/useActor";

export function useGetRequestsByStatus(
  status: Variant_pending_approved_rejected,
) {
  const { actor, isFetching } = useActor();

  return useQuery<Request[]>({
    queryKey: ["requests", status],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getRequestsByStatus(status);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateRequestStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      requestId,
      status,
    }: { requestId: bigint; status: Variant_pending_approved_rejected }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateRequestStatus(requestId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
}
