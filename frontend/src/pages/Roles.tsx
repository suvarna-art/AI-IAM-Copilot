import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  KeyRound,
  Users,
  ShieldAlert,
  ShieldCheck,
  Search,
  Loader2,
  CheckCircle2,
} from "lucide-react";

import { getRoles } from "../services/roles";
import type { Role } from "../types/roles";

export default function Roles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRoles() {
      try {
        setLoading(true);
        setError("");

        const result = await getRoles();

        console.log("ROLES DATA:", result);

        setRoles(result);
      } catch (err) {
        console.error("Roles API Error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load enterprise roles."
        );
      } finally {
        setLoading(false);
      }
    }

    loadRoles();
  }, []);

  const filteredRoles = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return roles;
    }

    return roles.filter((role) =>
      [
        role.name,
        role.description,
        role.riskLevel,
        role.status,
      ].some((value) =>
        value.toLowerCase().includes(query)
      )
    );
  }, [roles, search]);

  const totalUsers = roles.reduce(
    (total, role) => total + role.users,
    0
  );

  const totalPermissions = roles.reduce(
    (total, role) => total + role.permissions,
    0
  );

  const highRiskRoles = roles.filter(
    (role) =>
      role.riskLevel.toLowerCase() === "high"
  ).length;

  const activeRoles = roles.filter(
    (role) =>
      role.status.toLowerCase() === "active"
  ).length;

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Loader2
            size={18}
            className="animate-spin"
          />
          Loading Roles...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
        <div className="flex items-center gap-2">
          <ShieldAlert
            size={19}
            className="text-red-400"
          />

          <p className="font-semibold text-red-400">
            Roles unavailable
          </p>
        </div>

        <p className="mt-2 text-sm text-slate-500">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-7">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <div className="flex items-center gap-2">

            <KeyRound
              size={22}
              className="text-cyan-400"
            />

            <h1 className="text-2xl font-bold text-white">
              Roles & Permissions
            </h1>

          </div>

          <p className="mt-1 text-sm text-slate-400">
            Enterprise role and permission management
          </p>
        </div>

        <span className="w-fit rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs font-medium text-cyan-400">
          IAM GOVERNANCE
        </span>

      </section>


      {/* =====================================================
          KPI CARDS
      ===================================================== */}

      <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">

        <MetricCard
          label="Total Roles"
          value={roles.length}
          icon={<KeyRound size={18} />}
          tone="cyan"
        />

        <MetricCard
          label="Assigned Users"
          value={totalUsers}
          icon={<Users size={18} />}
          tone="emerald"
        />

        <MetricCard
          label="Permissions"
          value={totalPermissions}
          icon={<ShieldCheck size={18} />}
          tone="cyan"
        />

        <MetricCard
          label="High Risk Roles"
          value={highRiskRoles}
          icon={<ShieldAlert size={18} />}
          tone="red"
        />

      </section>


      {/* =====================================================
          ROLE HEALTH
      ===================================================== */}

      <section className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>

            <p className="text-xs uppercase tracking-wide text-slate-500">
              Role Governance
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Current enterprise role health and assignment posture
            </p>

          </div>

          <div className="flex items-center gap-2">

            <CheckCircle2
              size={17}
              className="text-emerald-400"
            />

            <span className="text-sm font-medium text-emerald-400">
              {activeRoles} Active Roles
            </span>

          </div>

        </div>

      </section>


      {/* =====================================================
          SEARCH
      ===================================================== */}

      <section>

        <div className="relative max-w-xl">

          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search roles, descriptions, risk levels..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950/60 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500/40"
          />

        </div>

      </section>


      {/* =====================================================
          ROLES TABLE
      ===================================================== */}

      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/50">

        <div className="border-b border-slate-800 px-5 py-4">

          <p className="text-sm font-semibold text-white">
            Enterprise Roles
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {filteredRoles.length} role
            {filteredRoles.length === 1 ? "" : "s"} displayed
          </p>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[850px]">

            <thead>
              <tr className="border-b border-slate-800 text-left">

                <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-slate-500">
                  Role
                </th>

                <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-slate-500">
                  Users
                </th>

                <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-slate-500">
                  Permissions
                </th>

                <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-slate-500">
                  Risk
                </th>

                <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-slate-500">
                  Status
                </th>

              </tr>
            </thead>

            <tbody>

              {filteredRoles.map((role) => (

                <tr
                  key={role.id}
                  className="border-b border-slate-800/70 last:border-0 hover:bg-slate-900/40"
                >

                  <td className="px-5 py-5">

                    <div className="flex items-start gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10">
                        <KeyRound
                          size={17}
                          className="text-cyan-400"
                        />
                      </div>

                      <div>

                        <p className="text-sm font-semibold text-white">
                          {role.name}
                        </p>

                        <p className="mt-1 max-w-md text-xs leading-5 text-slate-500">
                          {role.description}
                        </p>

                      </div>

                    </div>

                  </td>

                  <td className="px-5 py-5">

                    <div className="flex items-center gap-2 text-sm text-slate-300">

                      <Users
                        size={15}
                        className="text-slate-500"
                      />

                      {role.users}

                    </div>

                  </td>

                  <td className="px-5 py-5">

                    <span className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm text-slate-300">
                      {role.permissions}
                    </span>

                  </td>

                  <td className="px-5 py-5">

                    <RiskBadge
                      risk={role.riskLevel}
                    />

                  </td>

                  <td className="px-5 py-5">

                    <StatusBadge
                      status={role.status}
                    />

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {filteredRoles.length === 0 && (
          <div className="px-5 py-12 text-center">

            <p className="text-sm text-slate-400">
              No roles match your search.
            </p>

          </div>
        )}

      </section>

    </div>
  );
}


/* =========================================================
   METRIC CARD
========================================================= */

function MetricCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number;
  icon: ReactNode;
  tone: "cyan" | "emerald" | "red";
}) {
  const styles = {
    cyan: "text-cyan-400",
    emerald: "text-emerald-400",
    red: "text-red-400",
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">

      <div className="flex items-center justify-between">

        <p className="text-xs uppercase tracking-wide text-slate-500">
          {label}
        </p>

        <span className={styles[tone]}>
          {icon}
        </span>

      </div>

      <p className={`mt-3 text-3xl font-bold ${styles[tone]}`}>
        {value}
      </p>

    </div>
  );
}


/* =========================================================
   RISK BADGE
========================================================= */

function RiskBadge({
  risk,
}: {
  risk: string;
}) {
  const normalized = risk.toLowerCase();

  const styles =
    normalized === "high"
      ? "border-red-500/20 bg-red-500/10 text-red-400"
      : normalized === "medium"
        ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
        : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-medium ${styles}`}
    >
      {risk}
    </span>
  );
}


/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const normalized = status.toLowerCase();

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-medium ${
        normalized === "active"
          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
          : "border-slate-700 bg-slate-800/50 text-slate-400"
      }`}
    >
      {status}
    </span>
  );
}