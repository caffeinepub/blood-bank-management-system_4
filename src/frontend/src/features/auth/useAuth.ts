/**
 * Authentication facade hook that composes Internet Identity and backend actor
 * to provide centralized auth state, role checking, and navigation helpers.
 *
 * This hook manages the complete auth flow:
 * 1. Internet Identity sign-in
 * 2. Backend actor initialization with identity
 * 3. User profile and role fetching
 * 4. Role-based redirect logic
 */

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect } from "react";
import type { UserProfile } from "../../backend";
import { UserRole } from "../../backend";
import { useActor } from "../../hooks/useActor";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";

export function useAuth() {
  const {
    identity,
    login: iiLogin,
    clear: iiClear,
    loginStatus,
    isInitializing,
  } = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  // Fetch user profile
  const profileQuery = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
    retry: false,
  });

  // Fetch user role
  const roleQuery = useQuery<UserRole>({
    queryKey: ["currentUserRole"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
    retry: false,
  });

  const userProfile = profileQuery.data;
  const userRole = roleQuery.data;
  const isAdmin = userRole === UserRole.admin;
  const isUser = userRole === UserRole.user;

  // Combined loading state
  const isLoading =
    isInitializing ||
    actorFetching ||
    (isAuthenticated && (profileQuery.isLoading || roleQuery.isLoading));

  // Login handler
  const login = useCallback(async () => {
    try {
      await iiLogin();
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.message === "User is already authenticated") {
        await iiClear();
        setTimeout(() => iiLogin(), 300);
      }
      throw error;
    }
  }, [iiLogin, iiClear]);

  // Logout handler - clears all cached data
  const logout = useCallback(async () => {
    await iiClear();
    queryClient.clear();
    navigate({ to: "/login" });
  }, [iiClear, queryClient, navigate]);

  // Redirect logic after successful authentication
  useEffect(() => {
    if (isAuthenticated && !isLoading && userProfile && userRole) {
      const currentPath = window.location.hash.replace("#", "") || "/";

      // Don't redirect if already on a valid page
      if (
        currentPath !== "/" &&
        currentPath !== "/login" &&
        currentPath !== "/register"
      ) {
        return;
      }

      // Redirect based on role
      if (isAdmin) {
        navigate({ to: "/admin-dashboard" });
      } else if (isUser) {
        navigate({ to: "/user-dashboard" });
      }
    }
  }, [
    isAuthenticated,
    isLoading,
    userProfile,
    userRole,
    isAdmin,
    isUser,
    navigate,
  ]);

  return {
    // Auth state
    isAuthenticated,
    isLoading,
    identity,
    loginStatus,

    // User data
    userProfile,
    userRole,
    isAdmin,
    isUser,

    // Profile query states
    profileLoading: profileQuery.isLoading,
    profileFetched: profileQuery.isFetched,

    // Actions
    login,
    logout,
  };
}
