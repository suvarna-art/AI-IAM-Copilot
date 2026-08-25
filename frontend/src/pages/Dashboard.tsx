import { useEffect, useState } from "react";

import StatCard from "../components/StatCard";
import ActivityTable from "../components/ActivityTable";
import AIInsights from "../components/AIInsights";
import IdentityAnalytics from "../components/IdentityAnalytics";
import SystemStatus from "../components/SystemStatus";
import WelcomeBanner from "../components/WelcomeBanner";
import SecurityGauge from "../components/SecurityGauge";
import AIConfidence from "../components/AIConfidence";
import RiskIntelligence from "../components/RiskIntelligence";
import AccessReview from "../components/AccessReview";

import {
  ShieldCheck,
  Users,
  AlertTriangle,
  ClipboardCheck,
} from "lucide-react";

import { getDashboardData } from "../services/dashboard";
import { getActivities } from "../services/activity";
import { getAIConfidence } from "../services/aiConfidence";
import { getRiskIntelligence } from "../services/riskIntelligence";
import { getAccessReview } from "../services/accessReview";

import type {
  Activity,
  DashboardData,
} from "../types/dashboard";

import type {
  AccessReview as AccessReviewData,
  GovernanceAction,
} from "../types/accessReview";

export default function Dashboard() {
  const [dashboardData, setDashboardData] =
    useState<DashboardData | null>(null);

  const [activities, setActivities] =
    useState<Activity[]>([]);

  const [aiConfidence, setAIConfidence] =
    useState<Awaited<ReturnType<typeof getAIConfidence>> | null>(null);

  const [riskIntelligence, setRiskIntelligence] =
    useState<Awaited<ReturnType<typeof getRiskIntelligence>> | null>(null);

  const [accessReview, setAccessReview] =
    useState<AccessReviewData | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      const results = await Promise.allSettled([
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

      if (dashboardResult.status === "fulfilled") {
        setDashboardData(dashboardResult.value);
      }

      if (activityResult.status === "fulfilled") {
        setActivities(activityResult.value);
      }

      if (aiConfidenceResult.status === "fulfilled") {
        setAIConfidence(aiConfidenceResult.value);
      }

      if (riskResult.status === "fulfilled") {
        setRiskIntelligence(riskResult.value);
      }

      if (accessReviewResult.status === "fulfilled") {
        setAccessReview(accessReviewResult.value);
      }

      setLoading(false);
    }

    loadDashboard();
  }, []);

  const governanceActions: GovernanceAction[] = [];

  if (accessReview) {
    if (accessReview.overdueReviews > 0) {
      governanceActions.push({
        type: "overdue",
        count: accessReview.overdueReviews,
        title: "Overdue Reviews",
        description:
          `${accessReview.overdueReviews} reviews require immediate attention`,
      });
    }

    if (accessReview.pendingReviews > 0) {
      governanceActions.push({
        type: "pending",
        count: accessReview.pendingReviews,
        title: "Pending Reviews",
        description:
          `${accessReview.pendingReviews} reviews awaiting certification`,
      });
    }
  }

  if (loading) {
    return (
      <main className="flex flex-1 items-center justify-center p-8">
        <div className="text-lg text-slate-400">
          Loading Dashboard...
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 space-y-8 p-8">
      <section>
        <WelcomeBanner />
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
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
      </section>

      <section className="grid items-start gap-6 xl:grid-cols-3">
        <div className="min-w-0 space-y-6 xl:col-span-2">
          {dashboardData ? (
            <SecurityGauge
              score={dashboardData.securityScore}
            />
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
              <p className="text-sm text-slate-400">
                Security score is currently unavailable.
              </p>
            </div>
          )}

          <IdentityAnalytics />

          <ActivityTable
            activities={activities}
          />

          {aiConfidence && (
            <AIConfidence
              score={aiConfidence.score}
              prediction={aiConfidence.prediction}
              trend={aiConfidence.trend}
            />
          )}

          {riskIntelligence && (
            <RiskIntelligence
              overallRisk={riskIntelligence.overallRisk}
              riskScore={riskIntelligence.riskScore}
              confidence={riskIntelligence.confidence}
              topFinding={riskIntelligence.topFinding}
              recommendations={riskIntelligence.recommendations}
            />
          )}

          {accessReview && (
            <AccessReview
              completedReviews={accessReview.completedReviews}
              pendingReviews={accessReview.pendingReviews}
              overdueReviews={accessReview.overdueReviews}
              completionRate={accessReview.completionRate}
              nextCampaign={accessReview.nextCampaign}
              governanceActions={governanceActions}
            />
          )}
        </div>

        <div className="min-w-0 space-y-6 self-start">
          <AIInsights />
          <SystemStatus />
        </div>
      </section>
    </main>
  );
}