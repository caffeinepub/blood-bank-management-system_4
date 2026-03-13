/**
 * User/Donor Login Page — warm, welcoming blood bank theme.
 * For patients and donors accessing their portal.
 */

import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { Droplet, Heart, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../features/auth/useAuth";

export default function UserLoginPage() {
  const { login, loginStatus } = useAuth();
  const navigate = useNavigate();
  const isLoggingIn = loginStatus === "logging-in";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-120px] right-[-80px] w-[380px] h-[380px] rounded-full bg-primary/5" />
        <div className="absolute bottom-[-80px] left-[-60px] w-[280px] h-[280px] rounded-full bg-primary/4" />
        <div className="absolute top-1/2 left-1/4 w-[180px] h-[180px] rounded-full bg-accent/10 -translate-y-1/2" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3 mb-10 relative z-10"
      >
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Droplet className="h-5 w-5 text-primary fill-primary/30" />
        </div>
        <div>
          <p className="font-heading font-bold text-foreground text-sm leading-none">
            City Blood Bank
          </p>
          <p className="text-[10px] text-muted-foreground tracking-widest uppercase mt-0.5">
            Est. 2020
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, delay: 0.1 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="bg-white rounded-2xl p-8 md:p-10 shadow-official border border-border">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative mb-5">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Heart className="h-8 w-8 text-primary fill-primary/20" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center">
                <Droplet className="h-3.5 w-3.5 text-primary fill-primary/40" />
              </div>
            </div>
            <h1 className="font-heading text-2xl font-bold text-foreground mb-1">
              Patient &amp; Donor Portal
            </h1>
            <p className="text-sm text-muted-foreground">
              Access your blood requests and donation history
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-primary/5 border border-primary/15 p-4 mb-8">
            <Droplet className="h-4 w-4 text-primary fill-primary/30 flex-shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Sign in to view your blood type, check stock availability, submit
              requests, and track donation history.
            </p>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">
              Secure Sign In
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <Button
            type="button"
            size="lg"
            data-ocid="user-login.submit_button"
            onClick={login}
            disabled={isLoggingIn}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm tracking-wide"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <Heart className="h-4 w-4 mr-2" />
                Sign In to Continue
              </>
            )}
          </Button>

          {isLoggingIn && (
            <div
              data-ocid="user-login.loading_state"
              className="mt-3 text-center text-xs text-muted-foreground"
            >
              Connecting securely...
            </div>
          )}

          <p className="text-center text-xs text-muted-foreground mt-6">
            Are you an administrator?{" "}
            <button
              type="button"
              onClick={() => navigate({ to: "/admin-login" })}
              data-ocid="user-login.link"
              className="text-foreground font-medium underline underline-offset-2 hover:text-primary transition-colors cursor-pointer"
              style={{ background: "none", border: "none" }}
            >
              Admin Portal →
            </button>
          </p>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-10 text-xs text-muted-foreground relative z-10"
      >
        © {new Date().getFullYear()}. Built with ❤ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          className="underline underline-offset-2 hover:text-foreground transition-colors"
          target="_blank"
          rel="noreferrer"
        >
          caffeine.ai
        </a>
      </motion.p>
    </div>
  );
}
