import {
  Activity,
  BarChart3,
  Bot,
  BrainCircuit,
  ClipboardCheck,
  GitCompareArrows,
  KeyRound,
  LayoutDashboard,
  LockKeyhole,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

import {
  NavLink,
} from "react-router-dom";

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
    name: "Permission Drift",
    path: "/permission-drift",
    icon: GitCompareArrows,
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
      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col
          border-r border-[var(--if-border-soft)]
          bg-[rgba(7,11,17,0.94)]
          shadow-[20px_0_60px_rgba(0,0,0,0.18)]
          backdrop-blur-xl
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
        <div className="relative border-b border-[var(--if-border-soft)] px-5 py-6">

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-teal-300/20 to-transparent" />

          <div className="flex items-start justify-between gap-3">

            <div className="min-w-0">

              <div className="flex items-center gap-3">

                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-teal-300/15 bg-[rgba(72,215,198,0.07)]">

                  <div className="absolute h-5 w-5 rounded-full border border-teal-300/20" />

                  <div className="h-2.5 w-2.5 rounded-full bg-teal-300 shadow-[0_0_18px_rgba(72,215,198,0.28)]" />

                </div>

                <div className="min-w-0">

                  <h1 className="if-brand-gradient truncate text-lg font-bold tracking-tight">
                    IdentityForge AI
                  </h1>

                  <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--if-text-muted)]">
                    Enterprise Identity Intelligence
                  </p>

                </div>

              </div>

            </div>

            <button
              type="button"
              aria-label="Close navigation"
              onClick={onClose}
              className="rounded-lg p-2 text-[var(--if-text-muted)] transition hover:bg-white/[0.04] hover:text-white lg:hidden"
            >
              <X size={20} />
            </button>

          </div>

        </div>

        {/* RAIL LABEL */}
        <div className="px-5 pt-5">

          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--if-text-faint)]">
            Identity Workspace
          </p>

        </div>

        {/* NAVIGATION */}
        <nav className="relative flex-1 overflow-y-auto px-3 py-4">

          {/* TRUST PATH */}
          <div className="pointer-events-none absolute bottom-5 left-[30px] top-5 w-px bg-gradient-to-b from-teal-300/20 via-violet-300/10 to-transparent" />

          <div className="space-y-1">

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
                      "group relative flex items-center gap-3 rounded-xl px-3 py-2.5",
                      "text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-white/[0.045] text-white"
                        : "text-[var(--if-text-secondary)] hover:bg-white/[0.025] hover:text-white",
                    ].join(" ")
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* ACTIVE TRUST MARK */}
                      <span
                        className={[
                          "absolute left-[-1px] top-1/2 h-7 w-[2px] -translate-y-1/2 rounded-full transition-all",
                          isActive
                            ? "bg-gradient-to-b from-teal-300 to-violet-300 opacity-100"
                            : "opacity-0",
                        ].join(" ")}
                      />

                      {/* NODE */}
                      <span
                        className={[
                          "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-all duration-200",
                          isActive
                            ? "border-teal-300/15 bg-[rgba(72,215,198,0.08)] text-teal-200"
                            : "border-transparent bg-transparent text-[var(--if-text-muted)] group-hover:border-white/[0.05] group-hover:bg-white/[0.025] group-hover:text-[var(--if-text-secondary)]",
                        ].join(" ")}
                      >
                        <Icon size={17} />
                      </span>

                      <span className="truncate">
                        {item.name}
                      </span>

                      {isActive && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-teal-300 shadow-[0_0_12px_rgba(72,215,198,0.45)]" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}

          </div>

        </nav>

        {/* SECURITY POSTURE */}
        <div className="border-t border-[var(--if-border-soft)] p-4">

          <div className="if-surface relative overflow-hidden p-4">

            <div className="pointer-events-none absolute right-[-18px] top-[-22px] h-20 w-20 rounded-full bg-[rgba(85,214,162,0.05)] blur-2xl" />

            <div className="relative">

              <div className="flex items-center justify-between gap-3">

                <div>

                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--if-text-muted)]">
                    Security Posture
                  </p>

                  <p className="mt-2 text-2xl font-bold text-[var(--if-allow)]">
                    94%
                  </p>

                </div>

                <div className="relative h-10 w-10 rounded-full border border-emerald-300/15 bg-emerald-300/[0.04]">

                  <div className="absolute inset-[7px] rounded-full border border-emerald-300/25" />

                  <div className="absolute inset-[13px] rounded-full bg-emerald-300/70" />

                </div>

              </div>

              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.04]">

                <div className="h-full w-[94%] rounded-full bg-gradient-to-r from-emerald-300/70 to-teal-300/70" />

              </div>

              <p className="mt-3 text-[11px] leading-5 text-[var(--if-text-muted)]">
                Governance posture remains within the trusted operating range.
              </p>

            </div>

          </div>

        </div>

      </aside>
    </>
  );
}