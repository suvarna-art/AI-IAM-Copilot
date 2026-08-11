import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import {
  ShieldAlert,
  ShieldCheck,
  Users,
  KeyRound,
  Search,
  Loader2,
  LockKeyhole,
  UserX,
} from "lucide-react";

import { getPrivilegedAccounts } from "../services/privilegedAccess";
import type { PrivilegedAccount } from "../types/privilegedAccess";

export default function PrivilegedAccess() {
  const [accounts, setAccounts] = useState<PrivilegedAccount[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPrivilegedAccounts() {
      try {
        setLoading(true);
        setError("");

        const result = await getPrivilegedAccounts();

        console.log("PRIVILEGED ACCESS DATA:", result);

        setAccounts(result);
      } catch (err) {
        console.error("Privileged Access API Error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load privileged access data."
        );
      } finally {
        setLoading(false);
      }
    }

    loadPrivilegedAccounts();
  }, []);

  const filteredAccounts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return accounts;
    }

    return accounts.filter((account) =>
      [
        account.username,
        account.displayName,
        account.department,
        account.role,
        account.riskLevel,
        account.status,
      ].some((value) =>
        value.toLowerCase().includes(query)
      )
    );
  }, [accounts, search]);

  const highRiskAccounts = accounts.filter(
    (account) =>
      account.riskLevel.toLowerCase() === "high" ||
      account.riskLevel.toLowerCase() === "critical"
  ).length;

  const mfaDisabledAccounts = accounts.filter(
    (account) => !account.mfaEnabled
  ).length;

  const inactiveAccounts = accounts.filter(
    (account) =>
      account.status.toLowerCase() === "inactive"
  ).length;

  const averageRiskScore =
    accounts.length > 0
      ? Math.round(
          accounts.reduce(
            (total, account) =>
              total + account.riskScore,
            0
          ) / accounts.length
        )
      : 0;

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Loader2
            size={18}
            className="animate-spin"
          />
          Loading Privileged Access...
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
            Privileged Access unavailable
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

            <LockKeyhole
              size={22}
              className="text-cyan-400"
            />

            <h1 className="text-2xl font-bold text-white">
              Privileged Access
            </h1>

          </div>

          <p className="mt-1 text-sm text-slate-400">
            Privileged identity and elevated access monitoring
          </p>
        </div>

        <span className="w-fit rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-medium text-red-400">
          ELEVATED ACCESS
        </span>

      </section>


      {/* =====================================================
          KPI CARDS
      ===================================================== */}

      <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">

        <MetricCard
          label="Privileged Accounts"
          value={accounts.length}
          icon={<Users size={18} />}
          tone="cyan"
        />

        <MetricCard
          label="High Risk"
          value={highRiskAccounts}
          icon={<ShieldAlert size={18} />}
          tone="red"
        />

        <MetricCard
          label="MFA Disabled"
          value={mfaDisabledAccounts}
          icon={<ShieldCheck size={18} />}
          tone="amber"
        />

        <MetricCard
          label="Avg Risk Score"
          value={averageRiskScore}
          icon={<KeyRound size={18} />}
          tone="cyan"
        />

      </section>


      {/* =====================================================
          SECURITY POSTURE
      ===================================================== */}

      <section className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Privileged Access Posture
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Elevated identity accounts requiring continuous monitoring
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">

            <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs text-red-400">
              {highRiskAccounts} High Risk
            </span>

            <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs text-amber-400">
              {mfaDisabledAccounts} MFA Disabled
            </span>

            <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-400">
              {inactiveAccounts} Inactive
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
            placeholder="Search privileged accounts..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950/60 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500/40"
          />

        </div>

      </section>


      {/* =====================================================
          PRIVILEGED ACCOUNT TABLE
      ===================================================== */}

      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/50">

        <div className="border-b border-slate-800 px-5 py-4">

          <p className="text-sm font-semibold text-white">
            Privileged Account Inventory
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {filteredAccounts.length} account
            {filteredAccounts.length === 1 ? "" : "s"} displayed
          </p>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1050px]">

            <thead>
              <tr className="border-b border-slate-800 text-left">

                <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-slate-500">
                  Identity
                </th>

                <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-slate-500">
                  Role
                </th>

                <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-slate-500">
                  Risk
                </th>

                <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-slate-500">
                  MFA
                </th>

                <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-slate-500">
                  Last Access
                </th>

              </tr>
            </thead>

            <tbody>

              {filteredAccounts.map((account) => (

                <tr
                  key={account.id}
                  className="border-b border-slate-800/70 last:border-0 hover:bg-slate-900/40"
                >

                  {/* Identity */}

                  <td className="px-5 py-5">

                    <div className="flex items-start gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
                        <LockKeyhole
                          size={17}
                          className="text-red-400"
                        />
                      </div>

                      <div>

                        <p className="text-sm font-semibold text-white">
                          {account.displayName}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {account.username}
                        </p>

                        <p className="mt-1 text-xs text-slate-600">
                          {account.department}
                        </p>

                      </div>

                    </div>

                  </td>


                  {/* Role */}

                  <td className="px-5 py-5">

                    <span className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs text-slate-300">
                      {account.role}
                    </span>

                  </td>


                  {/* Risk */}

                  <td className="px-5 py-5">

                    <div className="space-y-2">

                      <RiskBadge
                        risk={account.riskLevel}
                      />

                      <div className="flex items-center gap-2">

                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-800">

                          <div
                            className={`h-full rounded-full ${
                              account.riskScore >= 90
                                ? "bg-red-400"
                                : account.riskScore >= 70
                                  ? "bg-amber-400"
                                  : "bg-emerald-400"
                            }`}
                            style={{
                              width: `${Math.min(
                                account.riskScore,
                                100
                              )}%`,
                            }}
                          />

                        </div>

                        <span className="text-xs text-slate-400">
                          {account.riskScore}
                        </span>

                      </div>

                    </div>

                  </td>


                  {/* MFA */}

                  <td className="px-5 py-5">

                    {account.mfaEnabled ? (
                      <span className="flex items-center gap-2 text-xs font-medium text-emerald-400">

                        <ShieldCheck size={15} />

                        Enabled

                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-xs font-medium text-red-400">

                        <ShieldAlert size={15} />

                        Disabled

                      </span>
                    )}

                  </td>


                  {/* Status */}

                  <td className="px-5 py-5">

                    {account.status.toLowerCase() ===
                    "inactive" ? (
                      <span className="flex items-center gap-2 text-xs font-medium text-red-400">

                        <UserX size={15} />

                        Inactive

                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-xs font-medium text-emerald-400">

                        <ShieldCheck size={15} />

                        Active

                      </span>
                    )}

                  </td>


                  {/* Last Access */}

                  <td className="px-5 py-5 text-xs text-slate-400">
                    {account.lastAccess}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {filteredAccounts.length === 0 && (
          <div className="px-5 py-12 text-center">

            <p className="text-sm text-slate-400">
              No privileged accounts match your search.
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
  tone: "cyan" | "emerald" | "amber" | "red";
}) {
  const styles = {
    cyan: "text-cyan-400",
    emerald: "text-emerald-400",
    amber: "text-amber-400",
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
    normalized === "critical"
      ? "border-red-500/20 bg-red-500/10 text-red-400"
      : normalized === "high"
        ? "border-orange-500/20 bg-orange-500/10 text-orange-400"
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