/**
 * Admin Login Page — dark, authoritative theme.
 * Restricted portal for system administrators only.
 */

import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Lock, Shield, TriangleAlert } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../features/auth/useAuth";

export default function AdminLoginPage() {
  const { login, loginStatus } = useAuth();
  const navigate = useNavigate();
  const isLoggingIn = loginStatus === "logging-in";

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.12 0.025 240) 0%, oklch(0.16 0.03 250) 50%, oklch(0.14 0.02 230) 100%)",
      }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, oklch(0.7 0.1 80) 0px, oklch(0.7 0.1 80) 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, oklch(0.7 0.1 80) 0px, oklch(0.7 0.1 80) 1px, transparent 1px, transparent 40px)",
          }}
        />
        <div
          className="absolute top-[-200px] right-[-200px] w-[500px] h-[500px] rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, oklch(0.7 0.12 80) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-[-150px] left-[-150px] w-[400px] h-[400px] rounded-full opacity-8"
          style={{
            background:
              "radial-gradient(circle, oklch(0.55 0.08 240) 0%, transparent 70%)",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3 mb-10 relative z-10"
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: "oklch(0.7 0.12 80 / 0.15)" }}
        >
          <span
            className="text-lg font-bold"
            style={{ color: "oklch(0.85 0.12 80)" }}
          >
            CB
          </span>
        </div>
        <div>
          <p
            className="font-heading font-bold text-sm leading-none"
            style={{ color: "oklch(0.9 0.005 240)" }}
          >
            City Blood Bank
          </p>
          <p
            className="text-[10px] tracking-widest uppercase mt-0.5"
            style={{ color: "oklch(0.55 0.02 240)" }}
          >
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
        <div
          className="rounded-xl p-8 md:p-10"
          style={{
            background: "oklch(0.18 0.025 245)",
            border: "1px solid oklch(0.28 0.02 245)",
            boxShadow:
              "0 24px 60px oklch(0.05 0.02 240 / 0.6), 0 4px 12px oklch(0.05 0.02 240 / 0.4)",
          }}
        >
          <div className="flex flex-col items-center text-center mb-8">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
              style={{
                background: "oklch(0.7 0.12 80 / 0.12)",
                border: "1px solid oklch(0.7 0.12 80 / 0.25)",
              }}
            >
              <Shield
                className="h-8 w-8"
                style={{ color: "oklch(0.78 0.14 80)" }}
              />
            </div>
            <h1
              className="font-heading text-2xl font-bold mb-1"
              style={{ color: "oklch(0.95 0.005 240)" }}
            >
              Administrator Portal
            </h1>
            <p className="text-sm" style={{ color: "oklch(0.55 0.015 240)" }}>
              Authorized personnel only
            </p>
          </div>

          <div
            className="flex items-start gap-3 rounded-lg p-4 mb-8"
            style={{
              background: "oklch(0.7 0.12 80 / 0.08)",
              border: "1px solid oklch(0.7 0.12 80 / 0.2)",
            }}
          >
            <TriangleAlert
              className="h-4 w-4 mt-0.5 flex-shrink-0"
              style={{ color: "oklch(0.75 0.14 80)" }}
            />
            <p
              className="text-xs leading-relaxed"
              style={{ color: "oklch(0.7 0.06 80)" }}
            >
              This portal is restricted to system administrators. Unauthorized
              access attempts are logged.
            </p>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <div
              className="flex-1 h-px"
              style={{ background: "oklch(0.28 0.02 245)" }}
            />
            <Lock
              className="h-3.5 w-3.5"
              style={{ color: "oklch(0.4 0.015 240)" }}
            />
            <div
              className="flex-1 h-px"
              style={{ background: "oklch(0.28 0.02 245)" }}
            />
          </div>

          <Button
            type="button"
            size="lg"
            data-ocid="admin-login.submit_button"
            onClick={login}
            disabled={isLoggingIn}
            className="w-full h-12 font-semibold text-sm tracking-wide transition-all"
            style={{
              background: isLoggingIn
                ? "oklch(0.55 0.08 80)"
                : "oklch(0.65 0.13 80)",
              color: "oklch(0.12 0.02 240)",
              border: "none",
            }}
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Sign In as Administrator
              </>
            )}
          </Button>

          {isLoggingIn && (
            <div
              data-ocid="admin-login.loading_state"
              className="mt-4 text-center text-xs"
              style={{ color: "oklch(0.48 0.015 240)" }}
            >
              Verifying credentials securely...
            </div>
          )}

          <p
            className="text-center text-xs mt-6"
            style={{ color: "oklch(0.4 0.012 240)" }}
          >
            Not an administrator?{" "}
            <button
              type="button"
              onClick={() => navigate({ to: "/user-login" })}
              data-ocid="admin-login.link"
              className="underline underline-offset-2 transition-colors cursor-pointer"
              style={{
                color: "oklch(0.58 0.06 240)",
                background: "none",
                border: "none",
              }}
            >
              User / Donor Portal →
            </button>
          </p>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-10 text-xs relative z-10"
        style={{ color: "oklch(0.35 0.012 240)" }}
      >
        © {new Date().getFullYear()}. Built with ❤ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          className="underline underline-offset-2"
          target="_blank"
          rel="noreferrer"
        >
          caffeine.ai
        </a>
      </motion.p>
    </div>
  );
}
