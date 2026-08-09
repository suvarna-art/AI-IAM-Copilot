import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";

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

  "/access-reviews": {
    title: "Access Reviews",
    subtitle: "Identity access certification and governance",
  },

  "/privileged-access": {
    title: "Privileged Access",
    subtitle: "Privileged identity and elevated access monitoring",
  },

  "/risk-intelligence": {
    title: "Risk Intelligence",
    subtitle: "Enterprise identity risk intelligence and analysis",
  },

  "/activity": {
    title: "Activity",
    subtitle: "Enterprise identity and security activity",
  },

  "/copilot": {
    title: "AI Copilot",
    subtitle: "Intelligent IAM analysis and governance assistance",
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

  const currentPage =
    pageConfig[location.pathname] ?? pageConfig["/"];

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <Sidebar />

      {/* =====================================================
          MAIN APPLICATION AREA
      ===================================================== */}

      <div className="flex min-w-0 flex-1 flex-col">

        {/* =================================================
            HEADER
        ================================================= */}

        <Header
          title={currentPage.title}
          subtitle={currentPage.subtitle}
        />

        {/* =================================================
            PAGE CONTENT
        ================================================= */}

        <main className="flex-1 p-8">
          {children}
        </main>

      </div>

    </div>
  );
}