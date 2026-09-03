import {
  AlertTriangle,
  ArrowUpRight,
  BrainCircuit,
  ClipboardCheck,
  ShieldCheck,
  Users,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import { useAuth } from "../auth/AuthContext";

import StatCard from "../components/StatCard";
import ActivityTable from "../components/ActivityTable";
import AIInsights from "../components/AIInsights";
import IdentityAnalytics from "../components/IdentityAnalytics";
import SystemStatus from "../components/SystemStatus";
import SecurityGauge from "../components/SecurityGauge";
import AIConfidence from "../components/AIConfidence";
import RiskIntelligence from "../components/RiskIntelligence";
import AccessReview from "../components/AccessReview";

import {
  getDashboardData,
} from "../services/dashboard";

import {
  getActivities,
} from "../services/activity";

import {
  getAIConfidence,
} from "../services/aiConfidence";

import {
  getRiskIntelligence,
} from "../services/riskIntelligence";

import {
  getAccessReview,
} from "../services/accessReview";

import type {
  Activity,
  DashboardData,
} from "../types/dashboard";

import type {
  AccessReview as AccessReviewData,
  GovernanceAction,
} from "../types/accessReview";


export default function Dashboard() {
  const {
    session,
    isDemo,
  } = useAuth();

  const [
    dashboardData,
    setDashboardData,
  ] =
    useState<DashboardData | null>(
      null
    );

  const [
    activities,
    setActivities,
  ] =
    useState<Activity[]>([]);

  const [
    aiConfidence,
    setAIConfidence,
  ] =
    useState<
      Awaited<
        ReturnType<
          typeof getAIConfidence
        >
      > | null
    >(null);

  const [
    riskIntelligence,
    setRiskIntelligence,
  ] =
    useState<
      Awaited<
        ReturnType<
          typeof getRiskIntelligence
        >
      > | null
    >(null);

  const [
    accessReview,
    setAccessReview,
  ] =
    useState<AccessReviewData | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] = useState(true);


  useEffect(() => {
    async function loadDashboard() {
      const results =
        await Promise.allSettled([
          getDashboardData(),
          getActivities(),
          getAIConfidence(),
          getRiskIntelligence(),
          getAccessReview(),
        ]);


      const [
        dashboardResult,
        activityResult,
        aiConfidenceResult,
        riskResult,
        accessReviewResult,
      ] = results;


      if (
        dashboardResult.status ===
        "fulfilled"
      ) {
        setDashboardData(
          dashboardResult.value
        );
      }


      if (
        activityResult.status ===
        "fulfilled"
      ) {
        setActivities(
          activityResult.value
        );
      }


      if (
        aiConfidenceResult.status ===
        "fulfilled"
      ) {
        setAIConfidence(
          aiConfidenceResult.value
        );
      }


      if (
        riskResult.status ===
        "fulfilled"
      ) {
        setRiskIntelligence(
          riskResult.value
        );
      }


      if (
        accessReviewResult.status ===
        "fulfilled"
      ) {
        setAccessReview(
          accessReviewResult.value
        );
      }


      setLoading(
        false
      );
    }


    loadDashboard();
  }, []);


  const governanceActions:
    GovernanceAction[] = [];


  if (accessReview) {
    if (
      accessReview.overdueReviews >
      0
    ) {
      governanceActions.push({
        type: "overdue",

        count:
          accessReview.overdueReviews,

        title:
          "Overdue Reviews",

        description:
          `${accessReview.overdueReviews} reviews require immediate attention`,
      });
    }


    if (
      accessReview.pendingReviews >
      0
    ) {
      governanceActions.push({
        type: "pending",

        count:
          accessReview.pendingReviews,

        title:
          "Pending Reviews",

        description:
          `${accessReview.pendingReviews} reviews awaiting certification`,
      });
    }
  }


  if (loading) {
    return (
      <div className="space-y-6">

        <div className="if-surface-elevated h-44 animate-pulse" />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({
            length: 4,
          }).map(
            (_, index) => (
              <div
                key={index}
                className="if-surface h-28 animate-pulse"
              />
            )
          )}
        </div>

        <div className="grid gap-6 xl:grid-cols-3">

          <div className="if-surface h-96 animate-pulse xl:col-span-2" />

          <div className="if-surface h-96 animate-pulse" />

        </div>

      </div>
    );
  }


  return (
    <div className="space-y-8">

      {/* =========================================================
          IDENTITY CONTROL PLANE
      ========================================================= */}
      <section className="identity-fabric if-surface-elevated relative overflow-hidden p-6 sm:p-8">

        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-300/35 to-violet-300/25" />

        <div className="pointer-events-none absolute right-[-80px] top-[-100px] h-72 w-72 rounded-full bg-[rgba(143,131,255,0.045)] blur-[90px]" />

        <div className="pointer-events-none absolute bottom-[-120px] left-[25%] h-72 w-72 rounded-full bg-[rgba(72,215,198,0.035)] blur-[90px]" />


        <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">

          <div className="max-w-3xl">

            <div className="flex flex-wrap items-center gap-2">

              <span className="if-badge if-badge-intelligence">
                <BrainCircuit
                  size={13}
                />

                Identity Control Plane
              </span>


              <span
                className={[
                  "if-badge",
                  isDemo
                    ? "border-violet-300/15 bg-violet-300/[0.04] text-violet-200"
                    : "border-emerald-300/15 bg-emerald-300/[0.04] text-emerald-200",
                ].join(
                  " "
                )}
              >
                {isDemo
                  ? "Read Only"
                  : "Governance Active"}
              </span>

            </div>


            <h2 className="if-heading mt-5 text-3xl font-bold tracking-[-0.03em] sm:text-4xl">

              Enterprise identity posture,
              <span className="if-brand-gradient ml-2">
                resolved in context.
              </span>

            </h2>


            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--if-text-secondary)] sm:text-base">

              Monitor identity risk, privileged exposure,
              governance activity and access posture from one
              decision-oriented control plane.

            </p>


            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--if-text-faint)]">

              <span>
                Identity
              </span>

              <span className="text-teal-300/40">
                /
              </span>

              <span>
                Access
              </span>

              <span className="text-violet-300/40">
                /
              </span>

              <span>
                Risk
              </span>

              <span className="text-teal-300/40">
                /
              </span>

              <span>
                Governance
              </span>

            </div>

          </div>


          {/* SESSION CONTEXT */}
          <div className="w-full max-w-sm rounded-2xl border border-[var(--if-border-soft)] bg-black/10 p-4">

            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--if-text-faint)]">
              Active Identity Context
            </p>


            <div className="mt-4 flex items-center gap-3">

              <div
                className={[
                  "flex h-10 w-10 items-center justify-center rounded-xl border",
                  isDemo
                    ? "border-violet-300/15 bg-violet-300/[0.05] text-violet-200"
                    : "border-teal-300/15 bg-teal-300/[0.05] text-teal-200",
                ].join(
                  " "
                )}
              >
                <ShieldCheck
                  size={19}
                />
              </div>


              <div className="min-w-0">

                <p className="truncate text-sm font-semibold text-[var(--if-text-primary)]">
                  {session.displayName ||
                    "Identity Security Administrator"}
                </p>

                <p className="mt-1 truncate text-xs text-[var(--if-text-muted)]">

                  {(
                    session.role ||
                    "IAM_ADMIN"
                  ).replaceAll(
                    "_",
                    " "
                  )}

                </p>

              </div>

            </div>


            <div className="mt-4 flex items-center justify-between border-t border-[var(--if-border-soft)] pt-3">

              <span className="text-[10px] uppercase tracking-[0.12em] text-[var(--if-text-faint)]">
                Access Scope
              </span>

              <span
                className={[
                  "text-xs font-semibold",
                  isDemo
                    ? "text-violet-200"
                    : "text-emerald-200",
                ].join(
                  " "
                )}
              >

                {(
                  session.accessScope ||
                  "ADMINISTRATIVE"
                ).replaceAll(
                  "_",
                  " "
                )}

              </span>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          PRIMARY IDENTITY SIGNALS
      ========================================================= */}
      <section>

        <SectionHeading
          eyebrow="Live Identity Signals"
          title="Enterprise posture"
          description="Current identity, governance and security conditions."
        />


        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">

          <StatCard
            title="Security Score"
            value={
              dashboardData
                ? `${dashboardData.securityScore}%`
                : "--"
            }
            change="Live"
            positive={true}
            icon={ShieldCheck}
          />

          <StatCard
            title="Active Identities"
            value={
              dashboardData
                ? dashboardData.activeIdentities.toLocaleString()
                : "--"
            }
            change="Live"
            positive={true}
            icon={Users}
          />

          <StatCard
            title="High Risk Accounts"
            value={
              dashboardData
                ? dashboardData.highRiskAccounts.toString()
                : "--"
            }
            change="Live"
            positive={false}
            icon={AlertTriangle}
          />

          <StatCard
            title="Pending Reviews"
            value={
              dashboardData
                ? dashboardData.pendingReviews.toString()
                : "--"
            }
            change="Live"
            positive={true}
            icon={ClipboardCheck}
          />

        </div>

      </section>


      {/* =========================================================
          SECURITY + INTELLIGENCE WORKSPACE
      ========================================================= */}
      <section>

        <SectionHeading
          eyebrow="Decision Intelligence"
          title="Security and governance workspace"
          description="Correlate posture, activity, risk and governance evidence."
        />


        <div className="mt-4 grid items-start gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">

          {/* PRIMARY COLUMN */}
          <div className="min-w-0 space-y-6">

            {dashboardData ? (
              <SecurityGauge
                score={
                  dashboardData.securityScore
                }
              />
            ) : (
              <UnavailablePanel
                message="Security score is currently unavailable."
              />
            )}


            <IdentityAnalytics />


            <ActivityTable
              activities={
                activities
              }
            />


            {riskIntelligence && (
              <RiskIntelligence
                overallRisk={
                  riskIntelligence.overallRisk
                }
                riskScore={
                  riskIntelligence.riskScore
                }
                confidence={
                  riskIntelligence.confidence
                }
                topFinding={
                  riskIntelligence.topFinding
                }
                recommendations={
                  riskIntelligence.recommendations
                }
              />
            )}


            {accessReview && (
              <AccessReview
                completedReviews={
                  accessReview.completedReviews
                }
                pendingReviews={
                  accessReview.pendingReviews
                }
                overdueReviews={
                  accessReview.overdueReviews
                }
                completionRate={
                  accessReview.completionRate
                }
                nextCampaign={
                  accessReview.nextCampaign
                }
                governanceActions={
                  governanceActions
                }
              />
            )}

          </div>


          {/* INTELLIGENCE RAIL */}
          <aside className="min-w-0 space-y-6 self-start xl:sticky xl:top-28">

            <div className="rounded-2xl border border-[var(--if-border-soft)] bg-black/10 p-4">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--if-text-faint)]">
                    Intelligence Rail
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[var(--if-text-primary)]">
                    Contextual Signals
                  </p>

                </div>


                <ArrowUpRight
                  size={17}
                  className="text-violet-300/60"
                />

              </div>

            </div>


            <AIInsights />


            {aiConfidence && (
              <AIConfidence
                score={
                  aiConfidence.score
                }
                prediction={
                  aiConfidence.prediction
                }
                trend={
                  aiConfidence.trend
                }
              />
            )}


            <SystemStatus />

          </aside>

        </div>

      </section>

    </div>
  );
}


function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

      <div>

        <p className="text-[9px] font-semibold uppercase tracking-[0.17em] text-[var(--if-teal-soft)]">
          {eyebrow}
        </p>

        <h3 className="if-heading mt-1 text-lg font-bold sm:text-xl">
          {title}
        </h3>

      </div>


      <p className="max-w-xl text-xs leading-5 text-[var(--if-text-muted)] sm:text-right">
        {description}
      </p>

    </div>
  );
}


function UnavailablePanel({
  message,
}: {
  message: string;
}) {
  return (
    <div className="if-surface p-6">

      <p className="text-sm text-[var(--if-text-muted)]">
        {message}
      </p>

    </div>
  );
}