import { useState } from "react";
import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";

import { useAuth } from "../auth/AuthContext";

interface AppShellProps {
  children: ReactNode;
}

const pageConfig: Record<
  string,
  {
    title: string;
    subtitle: string;
  }
> = {
  "/": {
    title: "Dashboard",
    subtitle: "Enterprise Identity Intelligence Platform",
  },

  "/identities": {
    title: "Identities",
    subtitle: "Enterprise identity inventory and security intelligence",
  },

  "/access-control": {
    title: "Access Control",
    subtitle: "Access assignments and governance controls",
  },

  "/access-reviews": {
    title: "Access Reviews",
    subtitle: "Identity access certification and governance",
  },

  "/privileged-access": {
    title: "Privileged Access",
    subtitle: "Privileged identity and elevated access monitoring",
  },

  "/roles": {
    title: "Roles",
    subtitle: "Role and permission governance",
  },

  "/risk-intelligence": {
    title: "Risk Intelligence",
    subtitle: "Enterprise identity risk intelligence and analysis",
  },

  "/permission-drift": {
    title: "Permission Drift",
    subtitle: "14-day entitlement usage analysis and governance intelligence",
  },

  "/activity": {
    title: "Activity",
    subtitle: "Enterprise identity and security activity",
  },

  "/copilot": {
    title: "AI Copilot",
    subtitle: "Intelligent IAM analysis and governance assistance",
  },

  "/analytics": {
    title: "Analytics",
    subtitle: "Identity and access analytics",
  },

  "/settings": {
    title: "Settings",
    subtitle: "Application and security configuration",
  },
};

export default function AppShell({
  children,
}: AppShellProps) {
  const location = useLocation();

  const {
    session,
    isAdmin,
    isDemo,
  } = useAuth();

  const [
    mobileSidebarOpen,
    setMobileSidebarOpen,
  ] = useState(false);

  const currentPage =
    pageConfig[location.pathname] ??
    pageConfig["/"];

  return (
    <div className="identityforge-background min-h-screen text-[var(--if-text-primary)]">

      {/* SIDEBAR */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onClose={() =>
          setMobileSidebarOpen(false)
        }
      />

      {/* APPLICATION FRAME */}
      <div className="relative z-10 flex min-h-screen min-w-0 flex-col lg:pl-64">

        {/* HEADER */}
        <Header
          title={currentPage.title}
          subtitle={currentPage.subtitle}
          onMenuClick={() =>
            setMobileSidebarOpen(true)
          }
        />

        {/* SESSION CONTEXT */}
        {isAdmin && (
          <section className="border-b border-emerald-400/10 bg-[rgba(85,214,162,0.035)] px-4 py-2.5 sm:px-6 lg:px-8">

            <div className="mx-auto flex max-w-[1800px] flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between">

              <div className="flex flex-wrap items-center gap-2.5">

                <span className="relative flex h-2.5 w-2.5 items-center justify-center">

                  <span className="absolute h-full w-full rounded-full bg-emerald-400/30" />

                  <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-300" />

                </span>

                <span className="font-semibold uppercase tracking-[0.16em] text-emerald-300">
                  Admin Session
                </span>

                <span className="text-[var(--if-text-faint)]">
                  /
                </span>

                <span className="font-medium text-[var(--if-text-secondary)]">
                  {session.role?.replaceAll(
                    "_",
                    " "
                  )}
                </span>

              </div>

              <div className="text-[var(--if-text-muted)]">
                Governance authority enabled
              </div>

            </div>

          </section>
        )}

        {isDemo && (
          <section className="border-b border-violet-400/10 bg-[rgba(155,140,255,0.045)] px-4 py-2.5 sm:px-6 lg:px-8">

            <div className="mx-auto flex max-w-[1800px] flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between">

              <div className="flex flex-wrap items-center gap-2.5">

                <span className="relative flex h-2.5 w-2.5 items-center justify-center">

                  <span className="absolute h-full w-full rounded-full bg-violet-400/30" />

                  <span className="relative h-1.5 w-1.5 rounded-full bg-violet-300" />

                </span>

                <span className="font-semibold uppercase tracking-[0.16em] text-violet-300">
                  Demo Mode
                </span>

                <span className="text-[var(--if-text-faint)]">
                  /
                </span>

                <span className="font-medium text-[var(--if-text-secondary)]">
                  Read Only
                </span>

                <span className="hidden text-[var(--if-text-faint)] sm:inline">
                  /
                </span>

                <span className="hidden text-[var(--if-text-muted)] sm:inline">
                  Synthetic Enterprise Dataset
                </span>

              </div>

              <div className="text-[var(--if-text-muted)]">
                Governance modifications disabled
              </div>

            </div>

          </section>
        )}

        {/* CONTENT ENVIRONMENT */}
        <main className="relative min-w-0 flex-1">

          {/* TRUST-FABRIC BACKGROUND */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">

            <div className="absolute left-[8%] top-[9%] h-[260px] w-[260px] rounded-full bg-[rgba(72,215,198,0.025)] blur-[90px]" />

            <div className="absolute right-[7%] top-[32%] h-[330px] w-[330px] rounded-full bg-[rgba(143,131,255,0.025)] blur-[110px]" />

            <div className="absolute bottom-[5%] left-[42%] h-[260px] w-[260px] rounded-full bg-[rgba(72,215,198,0.018)] blur-[100px]" />

          </div>

          {/* PAGE */}
          <div className="if-enter relative z-10 mx-auto w-full max-w-[1800px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">

            {children}

          </div>

        </main>

      </div>

    </div>
  );
}