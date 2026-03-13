/**
 * User-facing API wrapper for blood requests with React Query integration.
 */

import type { Principal } from "@dfinity/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Request } from "../../backend";
import { useActor } from "../../hooks/useActor";

export function useGetUserRequests(userId: Principal | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<Request[]>({
    queryKey: ["userRequests", userId?.toString()],
    queryFn: async () => {
      if (!actor || !userId) throw new Error("Actor or user ID not available");
      return actor.getRequestsByUser(userId);
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function useCreateRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      bloodGroup,
      units,
    }: { bloodGroup: string; units: bigint }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createRequest(bloodGroup, units);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userRequests"] });
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
}
