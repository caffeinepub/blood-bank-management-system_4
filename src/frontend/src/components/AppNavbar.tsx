/**
 * Responsive navigation bar with official City Blood Bank branding.
 * Includes emergency top bar, role-based nav links, and logout functionality.
 */

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate } from "@tanstack/react-router";
import { Droplet, LogOut, Menu, PhoneCall } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../features/auth/useAuth";

export default function AppNavbar() {
  const { isAdmin, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigation = (path: string) => {
    navigate({ to: path as any });
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
  };

  const adminLinks = [
    { label: "Dashboard", path: "/admin-dashboard" },
    { label: "Donors", path: "/donors" },
    { label: "Blood Stock", path: "/blood-stock" },
    { label: "Manage Requests", path: "/manage-requests" },
  ];

  const userLinks = [
    { label: "Dashboard", path: "/user-dashboard" },
    { label: "Blood Stock", path: "/blood-stock" },
    { label: "Request Blood", path: "/request-blood" },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Emergency top bar */}
      <div className="bg-primary text-primary-foreground text-center text-xs py-1.5 px-4 font-medium">
        <span className="inline-flex items-center gap-1.5">
          <PhoneCall className="h-3 w-3" />
          Emergency: <strong>1800-BLOOD</strong>
          <span className="mx-2 opacity-50">|</span>
          citybloodbank@health.gov
        </span>
      </div>

      {/* Main navbar */}
      <div className="bg-white border-b border-border shadow-xs">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10">
                <Droplet className="h-5 w-5 text-primary fill-primary/30" />
              </div>
              <div>
                <p className="font-heading font-bold text-foreground text-base leading-none">
                  City Blood Bank
                </p>
                <p className="text-[10px] text-muted-foreground tracking-widest uppercase">
                  Est. 2020
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {links.map((link) => (
                <button
                  type="button"
                  key={link.path}
                  data-ocid={`nav.${link.label.toLowerCase().replace(/\s+/g, "_")}.link`}
                  onClick={() => handleNavigation(link.path)}
                  className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* User Info & Logout */}
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground leading-none">
                  {userProfile?.name || "User"}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">
                  {isAdmin ? "Administrator" : "Member"}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                data-ocid="nav.logout.button"
                onClick={handleLogout}
                className="border-border"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  data-ocid="nav.mobile_menu.button"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" data-ocid="nav.sheet">
                <div className="flex flex-col gap-4 mt-8">
                  <div className="pb-4 border-b">
                    <div className="flex items-center gap-2 mb-1">
                      <Droplet className="h-4 w-4 text-primary" />
                      <p className="font-heading font-bold">City Blood Bank</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {userProfile?.name || "User"} &middot;{" "}
                      {isAdmin ? "Administrator" : "Member"}
                    </p>
                  </div>
                  {links.map((link) => (
                    <button
                      type="button"
                      key={link.path}
                      data-ocid={`nav.mobile.${link.label.toLowerCase().replace(/\s+/g, "_")}.link`}
                      onClick={() => handleNavigation(link.path)}
                      className="text-left text-sm font-medium hover:text-primary transition-colors py-1"
                    >
                      {link.label}
                    </button>
                  ))}
                  <Button
                    variant="outline"
                    data-ocid="nav.mobile_logout.button"
                    onClick={handleLogout}
                    className="mt-4"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
