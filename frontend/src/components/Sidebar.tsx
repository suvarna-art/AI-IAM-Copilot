import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  LockKeyhole,
  ClipboardCheck,
  KeyRound,
  Bot,
  BrainCircuit,
  Activity,
  BarChart3,
  Settings,
  X,
} from "lucide-react";

import { NavLink } from "react-router-dom";

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

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
    name: "Privileged Access",
    path: "/privileged-access",
    icon: LockKeyhole,
  },
  {
    name: "Access Reviews",
    path: "/access-reviews",
    icon: ClipboardCheck,
  },
  {
    name: "Roles",
    path: "/roles",
    icon: KeyRound,
  },
  {
    name: "Risk Intelligence",
    path: "/risk-intelligence",
    icon: BrainCircuit,
  },
  {
    name: "Activity",
    path: "/activity",
    icon: Activity,
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

export default function Sidebar({
  mobileOpen,
  onClose,
}: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col
          border-r border-slate-800 bg-slate-950
          transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* BRAND */}
        <div className="flex items-start justify-between border-b border-slate-800 px-6 py-6">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-cyan-400">
              IdentityForge AI
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              Enterprise Identity Intelligence
            </p>
          </div>

          <button
            type="button"
            aria-label="Close navigation"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-900 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                onClick={onClose}
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

        {/* SECURITY SCORE */}
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
    </>
  );
}