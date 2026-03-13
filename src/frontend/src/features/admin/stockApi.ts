/**
 * Admin API wrapper for blood stock management with React Query integration.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { BloodStock } from "../../backend";
import { useActor } from "../../hooks/useActor";

export function useUpdateBloodStock() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (stock: BloodStock) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateBloodStock(stock);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bloodStock"] });
    },
  });
}
