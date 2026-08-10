import { useEffect, useState } from "react";

import {
  BarChart3,
  Users,
  ShieldAlert,
  KeyRound,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

import { getAnalytics } from "../services/analytics";

import type {
  AnalyticsData,
} from "../types/analytics";

export default function Analytics() {
  // =========================================================
  // STATE
  // =========================================================

  const [data, setData] =
    useState<AnalyticsData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // =========================================================
  // LOAD ANALYTICS
  // =========================================================

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        setError("");

        const result =
          await getAnalytics();

        console.log(
          "ANALYTICS DATA:",
          result
        );

        setData(result);
      } catch (err) {
        console.error(
          "Analytics API Error:",
          err
        );

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(
            "Unable to load analytics data."
          );
        }
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-slate-400">
          Loading Analytics...
        </p>
      </div>
    );
  }


  // =========================================================
  // ERROR
  // =========================================================

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">

        <p className="font-medium text-red-400">
          Analytics data unavailable
        </p>

        <p className="mt-1 text-sm text-slate-500">
          {error || "No analytics data returned."}
        </p>

      </div>
    );
  }


  const {
    summary,
    riskDistribution,
    identityStatus,
    accessTrend,
    securityMetrics,
  } = data;


  // =========================================================
  // CALCULATIONS
  // =========================================================

  const totalAccessRequests =
    accessTrend.reduce(
      (total, item) =>
        total + item.accessRequests,
      0
    );

  const totalApproved =
    accessTrend.reduce(
      (total, item) =>
        total + item.approved,
      0
    );

  const totalDenied =
    accessTrend.reduce(
      (total, item) =>
        total + item.denied,
      0
    );

  const maxAccessRequests =
    Math.max(
      ...accessTrend.map(
        (item) => item.accessRequests
      ),
      1
    );


  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="space-y-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section>

        <div className="flex items-start gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10">

            <BarChart3
              size={22}
              className="text-cyan-400"
            />

          </div>

          <div>

            <h1 className="text-2xl font-bold text-white">
              Analytics
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Enterprise identity security analytics and insights
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          KPI CARDS
      ===================================================== */}

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        {/* Total Identities */}

        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">

          <div className="flex items-center justify-between">

            <p className="text-sm text-slate-400">
              Total Identities
            </p>

            <Users
              size={19}
              className="text-cyan-400"
            />

          </div>

          <p className="mt-3 text-3xl font-bold text-white">
            {summary.totalIdentities}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            {summary.activeIdentities} active identities
          </p>

        </div>


        {/* High Risk */}

        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">

          <div className="flex items-center justify-between">

            <p className="text-sm text-slate-400">
              High Risk
            </p>

            <ShieldAlert
              size={19}
              className="text-red-400"
            />

          </div>

          <p className="mt-3 text-3xl font-bold text-red-400">
            {summary.highRiskIdentities}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            {securityMetrics.highRiskPercentage}% of identities
          </p>

        </div>


        {/* Privileged */}

        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">

          <div className="flex items-center justify-between">

            <p className="text-sm text-slate-400">
              Privileged
            </p>

            <KeyRound
              size={19}
              className="text-amber-400"
            />

          </div>

          <p className="mt-3 text-3xl font-bold text-amber-400">
            {summary.privilegedIdentities}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            {securityMetrics.privilegedAccountPercentage}% of identities
          </p>

        </div>


        {/* Security Score */}

        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">

          <div className="flex items-center justify-between">

            <p className="text-sm text-slate-400">
              Security Score
            </p>

            <CheckCircle2
              size={19}
              className="text-emerald-400"
            />

          </div>

          <p className="mt-3 text-3xl font-bold text-emerald-400">
            {securityMetrics.securityScore}%
          </p>

          <p className="mt-2 text-xs text-slate-500">
            Current security posture
          </p>

        </div>

      </section>


      {/* =====================================================
          RISK + STATUS
      ===================================================== */}

      <section className="grid gap-6 lg:grid-cols-2">

        {/* Risk Distribution */}

        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6">

          <div className="mb-6 flex items-center justify-between">

            <div>

              <h2 className="font-semibold text-white">
                Risk Distribution
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Identity risk classification
              </p>

            </div>

            <ShieldAlert
              size={18}
              className="text-cyan-400"
            />

          </div>

          <div className="space-y-5">

            {riskDistribution.map(
              (risk) => {

                const percentage =
                  summary.totalIdentities > 0
                    ? (risk.value /
                        summary.totalIdentities) *
                      100
                    : 0;

                const riskName =
                  risk.name.toLowerCase();

                const barClass =
                  riskName === "high"
                    ? "bg-red-400"
                    : riskName === "medium"
                      ? "bg-amber-400"
                      : "bg-emerald-400";

                const valueClass =
                  riskName === "high"
                    ? "text-red-400"
                    : riskName === "medium"
                      ? "text-amber-400"
                      : "text-emerald-400";

                return (
                  <div
                    key={risk.name}
                  >

                    <div className="mb-2 flex items-center justify-between">

                      <span className="text-sm text-slate-300">
                        {risk.name}
                      </span>

                      <span
                        className={`text-sm font-semibold ${valueClass}`}
                      >
                        {risk.value}
                      </span>

                    </div>

                    <div className="h-2 rounded-full bg-slate-800">

                      <div
                        className={`h-2 rounded-full ${barClass}`}
                        style={{
                          width: `${percentage}%`,
                        }}
                      />

                    </div>

                  </div>
                );
              }
            )}

          </div>

        </div>


        {/* Identity Status */}

        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6">

          <div className="mb-6 flex items-center justify-between">

            <div>

              <h2 className="font-semibold text-white">
                Identity Status
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Active versus inactive identities
              </p>

            </div>

            <Users
              size={18}
              className="text-cyan-400"
            />

          </div>

          <div className="space-y-6">

            {identityStatus.map(
              (status) => {

                const percentage =
                  summary.totalIdentities > 0
                    ? (status.value /
                        summary.totalIdentities) *
                      100
                    : 0;

                const active =
                  status.name.toLowerCase() ===
                  "active";

                return (
                  <div
                    key={status.name}
                  >

                    <div className="mb-2 flex items-center justify-between">

                      <span className="text-sm text-slate-300">
                        {status.name}
                      </span>

                      <span
                        className={
                          active
                            ? "text-sm font-semibold text-emerald-400"
                            : "text-sm font-semibold text-slate-400"
                        }
                      >
                        {status.value}
                      </span>

                    </div>

                    <div className="h-3 rounded-full bg-slate-800">

                      <div
                        className={
                          active
                            ? "h-3 rounded-full bg-emerald-400"
                            : "h-3 rounded-full bg-slate-500"
                        }
                        style={{
                          width: `${percentage}%`,
                        }}
                      />

                    </div>

                  </div>
                );
              }
            )}

          </div>

        </div>

      </section>


      {/* =====================================================
          ACCESS TREND
      ===================================================== */}

      <section className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6">

        <div className="mb-6 flex items-center justify-between">

          <div>

            <h2 className="font-semibold text-white">
              Access Activity Trend
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Monthly access request activity
            </p>

          </div>

          <TrendingUp
            size={19}
            className="text-cyan-400"
          />

        </div>


        {/* Trend Summary */}

        <div className="mb-6 grid gap-4 md:grid-cols-3">

          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">

            <p className="text-xs text-slate-500">
              Requests
            </p>

            <p className="mt-2 text-2xl font-bold text-white">
              {totalAccessRequests}
            </p>

          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">

            <p className="text-xs text-slate-500">
              Approved
            </p>

            <p className="mt-2 text-2xl font-bold text-emerald-400">
              {totalApproved}
            </p>

          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">

            <p className="text-xs text-slate-500">
              Denied
            </p>

            <p className="mt-2 text-2xl font-bold text-red-400">
              {totalDenied}
            </p>

          </div>

        </div>


        {/* Simple visual trend */}

        <div className="space-y-4">

          {accessTrend.map(
            (item) => {

              const percentage =
                (item.accessRequests /
                  maxAccessRequests) *
                100;

              return (
                <div
                  key={item.period}
                  className="grid grid-cols-[44px_1fr_60px] items-center gap-3"
                >

                  <span className="text-xs font-medium text-slate-500">
                    {item.period}
                  </span>

                  <div className="h-3 rounded-full bg-slate-800">

                    <div
                      className="h-3 rounded-full bg-cyan-400"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />

                  </div>

                  <span className="text-right text-xs font-semibold text-slate-300">
                    {item.accessRequests}
                  </span>

                </div>
              );
            }
          )}

        </div>

      </section>


      {/* =====================================================
          SECURITY METRICS
      ===================================================== */}

      <section>

        <div className="mb-4">

          <h2 className="text-lg font-semibold text-white">
            Security Metrics
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Current governance and identity security indicators
          </p>

        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

          <Metric
            label="Security Score"
            value={`${securityMetrics.securityScore}%`}
          />

          <Metric
            label="Access Review Completion"
            value={`${securityMetrics.accessReviewCompletion}%`}
          />

          <Metric
            label="Privileged Accounts"
            value={`${securityMetrics.privilegedAccountPercentage}%`}
          />

          <Metric
            label="High Risk Identities"
            value={`${securityMetrics.highRiskPercentage}%`}
          />

        </div>

      </section>

    </div>
  );
}


// =========================================================
// METRIC COMPONENT
// =========================================================

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">

      <p className="text-sm text-slate-400">
        {label}
      </p>

      <p className="mt-3 text-2xl font-bold text-white">
        {value}
      </p>

    </div>
  );
}