/**
 * Admin helper for initializing sample data with React Query mutation.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useActor } from "../../hooks/useActor";

export function useInitSampleData() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.initSampleData();
    },
    onSuccess: () => {
      // Invalidate all relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["donors"] });
      queryClient.invalidateQueries({ queryKey: ["bloodStock"] });
    },
  });
}
