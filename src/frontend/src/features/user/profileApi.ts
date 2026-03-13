/**
 * User profile API wrapper with React Query integration.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useActor } from "../../hooks/useActor";

export function useRegisterProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.registerProfile(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
      queryClient.invalidateQueries({ queryKey: ["currentUserRole"] });
    },
  });
}
