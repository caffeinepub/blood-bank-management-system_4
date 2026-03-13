/**
 * Shared layout wrapper providing consistent page structure with official navbar
 * and institutional footer for all authenticated pages.
 */

import { Outlet, useNavigate } from "@tanstack/react-router";
import { Clock, Droplet, PhoneCall } from "lucide-react";
import { useEffect } from "react";
import { useAuth } from "../features/auth/useAuth";
import AppNavbar from "./AppNavbar";
import LoadingState from "./LoadingState";

export default function AppLayout() {
  const {
    isAuthenticated,
    isLoading,
    userProfile,
    profileLoading,
    profileFetched,
  } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    const currentPath = window.location.hash.replace("#", "") || "/";
    if (
      isAuthenticated &&
      !profileLoading &&
      profileFetched &&
      userProfile === null &&
      currentPath !== "/register"
    ) {
      navigate({ to: "/register" });
    }
  }, [isAuthenticated, profileLoading, profileFetched, userProfile, navigate]);

  if (isLoading || profileLoading) {
    return <LoadingState />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppNavbar />
      <main className="container mx-auto px-4 py-8 flex-1">
        <Outlet />
      </main>

      {/* Official Footer */}
      <footer className="bg-foreground text-primary-foreground mt-16">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Org info */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Droplet className="h-5 w-5 fill-primary/40" />
                <p className="font-heading font-bold text-base">
                  City Blood Bank
                </p>
              </div>
              <p className="text-sm opacity-70 leading-relaxed">
                123 Medical District,
              </p>
              <p className="text-sm opacity-70">City — 400001</p>
              <p className="text-sm opacity-70 mt-2">
                citybloodbank@health.gov
              </p>
            </div>

            {/* Quick links */}
            <div>
              <p className="font-heading font-semibold mb-3 text-sm tracking-wide uppercase opacity-60">
                Quick Links
              </p>
              <ul className="space-y-2 text-sm opacity-75">
                <li className="hover:opacity-100 transition-opacity">
                  Dashboard
                </li>
                <li className="hover:opacity-100 transition-opacity">
                  Blood Stock
                </li>
                <li className="hover:opacity-100 transition-opacity">
                  Contact
                </li>
              </ul>
            </div>

            {/* Emergency */}
            <div>
              <p className="font-heading font-semibold mb-3 text-sm tracking-wide uppercase opacity-60">
                Emergency Helpline
              </p>
              <div className="flex items-center gap-2 text-sm mb-2">
                <PhoneCall className="h-4 w-4 opacity-80" />
                <span className="font-bold text-base">1800-BLOOD</span>
              </div>
              <p className="text-xs opacity-60 mb-3">
                Available 24 hours, 7 days a week
              </p>
              <div className="flex items-center gap-2 text-sm opacity-75">
                <Clock className="h-4 w-4" />
                <span>Office: Mon–Fri 8 AM – 8 PM</span>
              </div>
            </div>
          </div>

          <div className="border-t border-primary-foreground/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs opacity-50">
            <p>
              © {new Date().getFullYear()} City Blood Bank. All rights reserved.
            </p>
            <p>An initiative of the City Health Authority</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
