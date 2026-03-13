/**
 * User-facing API wrapper for viewing blood stock with React Query integration.
 */

import { useQuery } from "@tanstack/react-query";
import type { BloodStock } from "../../backend";
import { useActor } from "../../hooks/useActor";

export function useGetAllBloodStock() {
  const { actor, isFetching } = useActor();

  return useQuery<BloodStock[]>({
    queryKey: ["bloodStock"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getAllBloodStock();
    },
    enabled: !!actor && !isFetching,
  });
}

// Re-export admin mutation for use in BloodStockPage
export { useUpdateBloodStock } from "../admin/stockApi";
