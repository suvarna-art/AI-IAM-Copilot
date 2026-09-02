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

  const [mobileSidebarOpen, setMobileSidebarOpen] =
    useState(false);

  const currentPage =
    pageConfig[location.pathname] ?? pageConfig["/"];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      <div className="flex min-h-screen min-w-0 flex-col lg:pl-64">
        <Header
          title={currentPage.title}
          subtitle={currentPage.subtitle}
          onMenuClick={() => setMobileSidebarOpen(true)}
        />

        {/* GLOBAL SESSION BANNER */}
        {isAdmin && (
          <div className="border-b border-emerald-500/10 bg-emerald-500/5 px-4 py-2 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-1 text-xs sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />

                <span className="font-semibold uppercase tracking-[0.14em] text-emerald-400">
                  Admin Session
                </span>

                <span className="text-slate-500">
                  •
                </span>

                <span className="text-slate-300">
                  {session.role?.replaceAll("_", " ")}
                </span>
              </div>

              <div className="text-slate-500">
                Administrative governance actions enabled
              </div>

            </div>
          </div>
        )}

        {isDemo && (
          <div className="border-b border-amber-500/10 bg-amber-500/5 px-4 py-2 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-1 text-xs sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-400" />

                <span className="font-semibold uppercase tracking-[0.14em] text-amber-400">
                  Demo Mode
                </span>

                <span className="text-slate-500">
                  •
                </span>

                <span className="text-slate-300">
                  Read Only
                </span>

                <span className="hidden text-slate-500 sm:inline">
                  •
                </span>

                <span className="hidden text-slate-400 sm:inline">
                  Synthetic Enterprise Data
                </span>
              </div>

              <div className="text-slate-500">
                Governance modifications are disabled
              </div>

            </div>
          </div>
        )}

        <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}