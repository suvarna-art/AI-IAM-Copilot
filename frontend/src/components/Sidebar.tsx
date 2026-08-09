import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  KeyRound,
  Bot,
  BarChart3,
  Settings,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const navigation = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Identities",
    path: "/identities",
    icon: Users,
  },
  {
    name: "Access Control",
    path: "/access-control",
    icon: ShieldCheck,
  },
  {
    name: "Roles",
    path: "/roles",
    icon: KeyRound,
  },
  {
    name: "AI Copilot",
    path: "/copilot",
    icon: Bot,
  },
  {
    name: "Analytics",
    path: "/analytics",
    icon: BarChart3,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  return (
    <aside className="flex min-h-screen w-64 flex-col border-r border-slate-800 bg-slate-950">

      {/* =====================================================
          BRAND
      ===================================================== */}

      <div className="border-b border-slate-800 px-6 py-7">

        <h1 className="text-xl font-bold tracking-tight text-cyan-400">
          IdentityForge AI
        </h1>

        <p className="mt-1 text-xs text-slate-500">
          Enterprise Identity Intelligence
        </p>

      </div>

      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <nav className="flex-1 space-y-2 px-4 py-6">

        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                [
                  "flex items-center gap-4 rounded-xl px-4 py-3",
                  "text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white",
                ].join(" ")
              }
            >
              <Icon size={19} />

              <span>{item.name}</span>
            </NavLink>
          );
        })}

      </nav>

      {/* =====================================================
          SECURITY SCORE
      ===================================================== */}

      <div className="border-t border-slate-800 p-4">

        <div className="rounded-xl bg-slate-900/80 p-4">

          <p className="text-xs text-slate-500">
            Security Score
          </p>

          <p className="mt-2 text-2xl font-bold text-emerald-400">
            94%
          </p>

          <p className="mt-1 text-[11px] text-slate-500">
            Excellent security posture
          </p>

        </div>

      </div>

    </aside>
  );
}