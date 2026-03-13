/**
 * Public landing page shown to unauthenticated users.
 * Official government/hospital aesthetic for City Blood Bank.
 */

import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Clock,
  Droplet,
  Heart,
  PhoneCall,
  Shield,
  UserPlus,
} from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../features/auth/useAuth";

const STEPS = [
  {
    icon: UserPlus,
    title: "Register & Verify",
    desc: "Create your account with a valid ID. Our system verifies your identity and eligibility for blood donation or requests.",
  },
  {
    icon: Droplet,
    title: "Request Blood",
    desc: "Submit a blood request specifying the type and units needed. Our admin team reviews every request within hours.",
  },
  {
    icon: CheckCircle,
    title: "Get Matched & Fulfilled",
    desc: "We match your request to available stock. Once approved, coordinate pickup at our medical district centre.",
  },
];

const STATS = [
  {
    label: "Blood Types Managed",
    value: "8",
    sub: "A+, A\u2212, B+, B\u2212, O+, O\u2212, AB+, AB\u2212",
  },
  {
    label: "System Availability",
    value: "24/7",
    sub: "Round-the-clock access",
  },
  {
    label: "Trusted Institution",
    value: "Est. 2020",
    sub: "Serving the community",
  },
];

function goTo(path: string) {
  window.location.href = path;
}

export default function LandingPage() {
  const { loginStatus } = useAuth();
  const isLoggingIn = loginStatus === "logging-in";

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      {/* Top emergency bar */}
      <div className="bg-primary text-primary-foreground text-center text-xs py-2 px-4 font-medium tracking-wide">
        \ud83e\ude78 Emergency Helpline: <strong>1800-BLOOD</strong>{" "}
        &nbsp;|&nbsp; citybloodbank@health.gov
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-border shadow-xs">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
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
          <nav className="hidden md:flex items-center gap-6">
            {["About", "How It Works", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>
          {/* Dual sign-in buttons in navbar */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              data-ocid="landing.admin-login.button"
              onClick={() => goTo("/admin-login")}
              disabled={isLoggingIn}
              className="hidden sm:inline-flex border-border text-foreground hover:bg-secondary font-medium text-xs"
            >
              <Shield className="h-3 w-3 mr-1" />
              Admin
            </Button>
            <Button
              size="sm"
              data-ocid="landing.user-login.button"
              onClick={() => goTo("/user-login")}
              disabled={isLoggingIn}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs"
            >
              <Droplet className="h-3 w-3 mr-1" />
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-white border-b border-border">
        {/* Decorative crimson strip */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/5 translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 right-24 w-64 h-64 rounded-full bg-accent/20 translate-y-1/2" />
        </div>
        <div className="container mx-auto px-8 py-20 md:py-28 relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase mb-6">
              <Shield className="h-3 w-3" /> Official City Health Authority
            </div>
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-foreground leading-[1.1] mb-6">
              Saving Lives,
              <br />
              <span className="text-primary">One Drop</span> at a Time
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl">
              The City Blood Bank Management System provides a secure,
              transparent platform for managing blood donations, stock, and
              emergency requests \u2014 serving our community 24 hours a day, 7
              days a week.
            </p>
            {/* Two CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                data-ocid="landing.hero.primary_button"
                onClick={() => goTo("/user-login")}
                disabled={isLoggingIn}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-12 px-8"
              >
                <Droplet className="h-4 w-4 mr-2" />
                User / Donor Login
              </Button>
              <Button
                size="lg"
                variant="outline"
                data-ocid="landing.hero.secondary_button"
                onClick={() => goTo("/admin-login")}
                disabled={isLoggingIn}
                className="h-12 px-8 border-border"
              >
                <Shield className="h-4 w-4 mr-2" />
                Admin Login
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-primary text-primary-foreground py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:divide-x divide-primary-foreground/20">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.5 }}
                className="text-center px-6"
              >
                <p className="font-heading text-4xl font-bold tracking-tight">
                  {stat.value}
                </p>
                <p className="font-semibold text-sm mt-1 opacity-90">
                  {stat.label}
                </p>
                <p className="text-xs opacity-65 mt-0.5">{stat.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-2">
              Process
            </p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
              How It Works
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              Three simple steps to access our blood bank management system.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i, duration: 0.5 }}
                  className="relative bg-white rounded-lg border border-border p-8 shadow-xs"
                >
                  {/* Step number */}
                  <span className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center font-heading">
                    {i + 1}
                  </span>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-white border-y border-border py-16">
        <div className="container mx-auto px-4 text-center">
          <Heart className="h-10 w-10 text-primary mx-auto mb-4" />
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-3">
            Ready to Access the System?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Sign in with your credentials to manage donors, check blood stock,
            and process requests.
          </p>
          <Button
            size="lg"
            data-ocid="landing.cta.primary_button"
            onClick={() => goTo("/user-login")}
            disabled={isLoggingIn}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-12 px-10"
          >
            <Droplet className="h-4 w-4 mr-2" />
            User / Donor Login
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-primary-foreground">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Droplet className="h-5 w-5 fill-primary/40" />
                <p className="font-heading font-bold text-base">
                  City Blood Bank
                </p>
              </div>
              <p className="text-sm opacity-70 leading-relaxed">
                123 Medical District, City \u2014 400001
              </p>
              <p className="text-sm opacity-70 mt-1">
                citybloodbank@health.gov
              </p>
            </div>
            <div>
              <p className="font-heading font-semibold mb-3 text-sm tracking-wide uppercase opacity-60">
                Quick Links
              </p>
              <ul className="space-y-2 text-sm opacity-75">
                <li>
                  <button
                    type="button"
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    className="hover:opacity-100 transition-opacity"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="hover:opacity-100 transition-opacity"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="hover:opacity-100 transition-opacity"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-heading font-semibold mb-3 text-sm tracking-wide uppercase opacity-60">
                Emergency
              </p>
              <div className="flex items-center gap-2 text-sm mb-2">
                <PhoneCall className="h-4 w-4 opacity-80" />
                <span className="font-bold">1800-BLOOD</span>
              </div>
              <p className="text-xs opacity-60">
                Available 24 hours, 7 days a week
              </p>
              <div className="flex items-center gap-2 text-sm mt-3">
                <Clock className="h-4 w-4 opacity-80" />
                <span className="opacity-75">
                  Mon\u2013Fri: 8 AM \u2013 8 PM
                </span>
              </div>
            </div>
          </div>
          <div className="border-t border-primary-foreground/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs opacity-50">
            <p>
              City Blood Bank \u00a9 {new Date().getFullYear()} | All rights
              reserved | For emergencies call: 1800-BLOOD
            </p>
            <p>An initiative of the City Health Authority</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
