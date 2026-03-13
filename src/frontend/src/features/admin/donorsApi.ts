/**
 * Admin API wrapper for donor CRUD operations with React Query integration.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Donor } from "../../backend";
import { useActor } from "../../hooks/useActor";

export function useGetAllDonors() {
  const { actor, isFetching } = useActor();

  return useQuery<Donor[]>({
    queryKey: ["donors"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getAllDonors();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddDonor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (donor: Donor) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addDonor(donor);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donors"] });
    },
  });
}
