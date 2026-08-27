import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Eye,
  ShieldAlert,
  ShieldCheck,
  UserCog,
  Users,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import {
  getPermissionDriftFindings,
  getPermissionDriftSummary,
} from "../services/permissionDrift";

import type {
  PermissionDriftFinding,
  PermissionDriftSummary,
} from "../types/permissionDrift";


export default function PermissionDrift() {
  const [summary, setSummary] =
    useState<PermissionDriftSummary | null>(null);

  const [findings, setFindings] =
    useState<PermissionDriftFinding[]>([]);

  const [selectedFinding, setSelectedFinding] =
    useState<PermissionDriftFinding | null>(null);

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [accountTypeFilter, setAccountTypeFilter] =
    useState("ALL");

  const [riskFilter, setRiskFilter] =
    useState("ALL");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);


  useEffect(() => {
    async function loadPermissionDrift() {
      try {
        const [
          summaryResult,
          findingsResult,
        ] = await Promise.all([
          getPermissionDriftSummary(),
          getPermissionDriftFindings(),
        ]);

        setSummary(summaryResult);
        setFindings(findingsResult);
      } catch {
        setError(
          "Permission drift data is currently unavailable."
        );
      } finally {
        setLoading(false);
      }
    }

    loadPermissionDrift();
  }, []);


  const accountTypes = useMemo(() => {
    return Array.from(
      new Set(
        findings.map(
          (finding) =>
            finding.account_type
        )
      )
    );
  }, [findings]);


  const filteredFindings = useMemo(() => {
    return findings.filter(
      (finding) => {
        const statusMatch =
          statusFilter === "ALL" ||
          finding.final_status === statusFilter;

        const accountTypeMatch =
          accountTypeFilter === "ALL" ||
          finding.account_type ===
            accountTypeFilter;

        const riskMatch =
          riskFilter === "ALL" ||
          finding.raw_classification ===
            riskFilter;

        return (
          statusMatch &&
          accountTypeMatch &&
          riskMatch
        );
      }
    );
  }, [
    findings,
    statusFilter,
    accountTypeFilter,
    riskFilter,
  ]);


  function getStatusClasses(
    status: string
  ) {
    switch (status) {
      case "DRIFT_CANDIDATE":
        return "border-red-500/20 bg-red-500/10 text-red-400";

      case "EXEMPT":
        return "border-cyan-500/20 bg-cyan-500/10 text-cyan-400";

      case "ACTIVE":
        return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";

      case "MONITORED":
        return "border-amber-500/20 bg-amber-500/10 text-amber-400";

      case "EXEMPTION_EXPIRED":
        return "border-orange-500/20 bg-orange-500/10 text-orange-400";

      default:
        return "border-slate-700 bg-slate-800 text-slate-300";
    }
  }


  function getRiskClasses(
    risk: string
  ) {
    switch (risk) {
      case "HIGH":
        return "text-red-400";

      case "MEDIUM":
        return "text-amber-400";

      default:
        return "text-emerald-400";
    }
  }


  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-28 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/70" />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({
            length: 4,
          }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/70"
            />
          ))}
        </div>

        <div className="h-96 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/70" />
      </div>
    );
  }


  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
        <div className="flex items-center gap-3">
          <AlertTriangle className="text-red-400" />

          <div>
            <h2 className="font-semibold text-white">
              Permission Drift unavailable
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="space-y-6">

      {/* INTRODUCTION */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-cyan-500/10 p-2 text-cyan-400">
                <ShieldAlert size={22} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-white">
                  14-Day Permission Drift
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Compare assigned permissions against observed activity without modifying access.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Analysis Window
            </p>

            <p className="mt-1 font-semibold text-white">
              {summary?.analysis_window_days ?? 14} days
            </p>
          </div>
        </div>
      </section>


      {/* SUMMARY CARDS */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <SummaryCard
          title="Total Permissions"
          value={summary?.total_permissions ?? 0}
          icon={Users}
        />

        <SummaryCard
          title="Drift Candidates"
          value={summary?.drift_candidates ?? 0}
          icon={ShieldAlert}
        />

        <SummaryCard
          title="Exempt Findings"
          value={summary?.exempt ?? 0}
          icon={ShieldCheck}
        />

        <SummaryCard
          title="High-Risk Findings"
          value={summary?.high_risk_findings ?? 0}
          icon={AlertTriangle}
        />

      </section>


      {/* SECONDARY METRICS */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <MetricCard
          label="Dormant"
          value={summary?.dormant_permissions ?? 0}
          icon={Clock3}
        />

        <MetricCard
          label="Privileged"
          value={summary?.privileged_permissions ?? 0}
          icon={UserCog}
        />

        <MetricCard
          label="Service Accounts"
          value={summary?.service_account_permissions ?? 0}
          icon={Users}
        />

        <MetricCard
          label="Monitored"
          value={summary?.monitored ?? 0}
          icon={CheckCircle2}
        />

      </section>


      {/* FILTERS */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="flex flex-col gap-3 md:flex-row">

          <FilterSelect
            label="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              "ALL",
              "DRIFT_CANDIDATE",
              "EXEMPT",
              "ACTIVE",
              "MONITORED",
              "EXEMPTION_EXPIRED",
            ]}
          />

          <FilterSelect
            label="Account Type"
            value={accountTypeFilter}
            onChange={setAccountTypeFilter}
            options={[
              "ALL",
              ...accountTypes,
            ]}
          />

          <FilterSelect
            label="Risk"
            value={riskFilter}
            onChange={setRiskFilter}
            options={[
              "ALL",
              "HIGH",
              "MEDIUM",
              "LOW",
            ]}
          />

        </div>
      </section>


      {/* FINDINGS TABLE */}
      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">

        <div className="border-b border-slate-800 px-5 py-4">
          <h3 className="font-semibold text-white">
            Permission Drift Findings
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            Showing {filteredFindings.length} of {findings.length} findings
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full">

            <thead className="bg-slate-950/60">
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-5 py-4">
                  Identity
                </th>

                <th className="px-5 py-4">
                  Permission
                </th>

                <th className="px-5 py-4">
                  Type
                </th>

                <th className="px-5 py-4">
                  Activity
                </th>

                <th className="px-5 py-4">
                  Usage
                </th>

                <th className="px-5 py-4">
                  Drift Score
                </th>

                <th className="px-5 py-4">
                  Status
                </th>

                <th className="px-5 py-4">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredFindings.map(
                (finding) => (
                  <tr
                    key={`${finding.user_id}-${finding.permission}`}
                    className="border-t border-slate-800/80 transition hover:bg-slate-800/30"
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-white">
                        {finding.user_name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {finding.user_id}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm text-slate-200">
                        {finding.permission}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {finding.resource}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-300">
                      {finding.account_type}

                      {finding.privileged && (
                        <span className="ml-2 rounded-md bg-red-500/10 px-2 py-1 text-[10px] font-semibold text-red-400">
                          PRIVILEGED
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-300">
                      {finding.activity_state}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-300">
                      {finding.usage_count_14d}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold ${getRiskClasses(
                            finding.raw_classification
                          )}`}
                        >
                          {finding.drift_score}
                        </span>

                        <span className="text-xs text-slate-500">
                          {finding.raw_classification}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-lg border px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                          finding.final_status
                        )}`}
                      >
                        {finding.final_status.replaceAll(
                          "_",
                          " "
                        )}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedFinding(
                            finding
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-cyan-500/30 hover:text-cyan-400"
                      >
                        <Eye size={15} />
                        View
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

      </section>


      {/* FINDING DETAIL */}
      {selectedFinding && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={() =>
            setSelectedFinding(null)
          }
        >
          <div
            className="max-h-[90vh] w-full overflow-y-auto rounded-t-2xl border border-slate-700 bg-[#0f172a] p-5 shadow-2xl sm:max-w-2xl sm:rounded-2xl sm:p-6"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-cyan-400">
                  Permission Drift Evidence
                </p>

                <h3 className="mt-2 text-xl font-bold text-white">
                  {selectedFinding.user_name}
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  {selectedFinding.permission}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedFinding(null)
                }
                className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-400 transition hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">

              <DetailItem
                label="Account Type"
                value={
                  selectedFinding.account_type
                }
              />

              <DetailItem
                label="Department"
                value={
                  selectedFinding.department
                }
              />

              <DetailItem
                label="Privileged"
                value={
                  selectedFinding.privileged
                    ? "Yes"
                    : "No"
                }
              />

              <DetailItem
                label="Activity State"
                value={
                  selectedFinding.activity_state
                }
              />

              <DetailItem
                label="14-Day Usage"
                value={String(
                  selectedFinding.usage_count_14d
                )}
              />

              <DetailItem
                label="Active Days"
                value={String(
                  selectedFinding.active_days_14d
                )}
              />

              <DetailItem
                label="Drift Score"
                value={`${selectedFinding.drift_score}/100`}
              />

              <DetailItem
                label="Final Status"
                value={
                  selectedFinding.final_status
                }
              />

            </div>

            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Evidence
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                This permission was observed
                {" "}
                {selectedFinding.usage_count_14d}
                {" "}
                time(s) during the
                {" "}
                {selectedFinding.analysis_window_days}-day
                analysis window.
              </p>

              {selectedFinding.exemption_applied && (
                <div className="mt-4 rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-4">
                  <p className="text-sm font-semibold text-cyan-400">
                    Active Exemption
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {selectedFinding.exemption_reason}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">

              <button
                type="button"
                disabled
                title="Admin exemption creation will be added next"
                className="rounded-xl border border-slate-700 px-4 py-3 text-sm font-medium text-slate-500"
              >
                Create Exemption
              </button>

              <button
                type="button"
                disabled
                title="Phase 2 rightsizing workflow"
                className="rounded-xl border border-slate-700 px-4 py-3 text-sm font-medium text-slate-500"
              >
                Send to Rightsizing
              </button>

              <button
                type="button"
                disabled
                title="Copilot integration will be added next"
                className="rounded-xl bg-cyan-500/20 px-4 py-3 text-sm font-semibold text-cyan-400"
              >
                Ask Copilot
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}


function SummaryCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number;
  icon: typeof Users;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <div className="flex items-center justify-between">

        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            {title}
          </p>

          <p className="mt-3 text-3xl font-bold text-white">
            {value}
          </p>
        </div>

        <div className="rounded-xl bg-cyan-500/10 p-3 text-cyan-400">
          <Icon size={22} />
        </div>

      </div>
    </div>
  );
}


function MetricCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof Users;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/40 p-4">

      <div className="rounded-lg bg-slate-800 p-2 text-slate-400">
        <Icon size={18} />
      </div>

      <div>
        <p className="text-xs text-slate-500">
          {label}
        </p>

        <p className="mt-1 text-lg font-bold text-white">
          {value}
        </p>
      </div>

    </div>
  );
}


function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="flex-1">
      <span className="mb-2 block text-xs uppercase tracking-wide text-slate-500">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 outline-none transition focus:border-cyan-500/50"
      >
        {options.map(
          (option) => (
            <option
              key={option}
              value={option}
            >
              {option.replaceAll(
                "_",
                " "
              )}
            </option>
          )
        )}
      </select>
    </label>
  );
}


function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-sm font-medium text-white">
        {value}
      </p>
    </div>
  );
}