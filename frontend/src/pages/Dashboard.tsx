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

  /* =========================================================
     DASHBOARD STATE
  ========================================================= */

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

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  /* =========================================================
     LOAD DASHBOARD DATA
  ========================================================= */

  useEffect(() => {

    async function loadDashboard() {

      try {

        /*
         * Load each service independently.
         *
         * This prevents one failed API from blocking
         * the rest of the dashboard.
         */

        const dashboardPromise =
          getDashboardData();

        const activityPromise =
          getActivities();

        const aiConfidencePromise =
          getAIConfidence();

        const riskPromise =
          getRiskIntelligence();

        const accessReviewPromise =
          getAccessReview();


        /* =====================================================
           Dashboard Data
        ===================================================== */

        try {

          const data =
            await dashboardPromise;

          setDashboardData(data);

          console.log(
            "Dashboard Data:",
            data
          );

        } catch (err) {

          console.error(
            "Dashboard Data Error:",
            err
          );

        }


        /* =====================================================
           Activity Data
        ===================================================== */

        try {

          const data =
            await activityPromise;

          setActivities(data);

          console.log(
            "Activity Data:",
            data
          );

        } catch (err) {

          console.error(
            "Activity Data Error:",
            err
          );

        }


        /* =====================================================
           AI Confidence
        ===================================================== */

        try {

          const data =
            await aiConfidencePromise;

          setAIConfidence(data);

          console.log(
            "AI Confidence:",
            data
          );

        } catch (err) {

          console.error(
            "AI Confidence Error:",
            err
          );

        }


        /* =====================================================
           Risk Intelligence
        ===================================================== */

        try {

          const data =
            await riskPromise;

          setRiskIntelligence(data);

          console.log(
            "Risk Intelligence:",
            data
          );

        } catch (err) {

          console.error(
            "Risk Intelligence Error:",
            err
          );

        }


        /* =====================================================
           Access Review
        ===================================================== */

        try {

          const data =
            await accessReviewPromise;

          setAccessReview(data);

          console.log(
            "ACCESS REVIEW API DATA:",
            data
          );

          console.log(
            "OVERDUE:",
            data.overdueReviews
          );

          console.log(
            "PENDING:",
            data.pendingReviews
          );

        } catch (err) {

          console.error(
            "Access Review Error:",
            err
          );

          setError(
            "Unable to load Access Review data."
          );

        }

      } catch (err) {

        console.error(
          "Dashboard Error:",
          err
        );

        if (err instanceof Error) {

          setError(
            err.message
          );

        } else {

          setError(
            "Unknown error occurred"
          );

        }

      } finally {

        setLoading(false);

      }
    }


    loadDashboard();

  }, []);


  /* =========================================================
     GOVERNANCE ACTIONS

     Dashboard is the Smart Component.
     It prepares governance data before passing it
     to the presentational components.
  ========================================================= */

  const governanceActions: GovernanceAction[] = [];


  if (accessReview) {

    if (
      accessReview.overdueReviews > 0
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
      accessReview.pendingReviews > 0
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


  /* =========================================================
     LOADING STATE
  ========================================================= */

  if (loading) {

    return (

      <main className="flex flex-1 items-center justify-center p-8">

        <div className="text-lg text-slate-400">

          Loading Dashboard...

        </div>

      </main>

    );

  }


  /* =========================================================
     ERROR STATE

     Only block the dashboard if the Access Review
     data itself failed completely.
  ========================================================= */

  if (
    error &&
    !accessReview
  ) {

    return (

      <main className="flex flex-1 items-center justify-center p-8">

        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-6 py-4 text-red-400">

          {error}

        </div>

      </main>

    );

  }


  /* =========================================================
     MAIN DASHBOARD
  ========================================================= */

  return (

    <main className="flex-1 space-y-8 p-8">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section>

        <WelcomeBanner />

      </section>


      {/* =====================================================
          KPI CARDS
      ===================================================== */}

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <StatCard

          title="Security Score"

          value={
            dashboardData
              ? `${dashboardData.securityScore}%`
              : "--"
          }

          change="+2.1%"

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

          change="+318"

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

          change="-6"

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

          change="+14"

          positive={true}

          icon={ClipboardCheck}

        />

      </section>


      {/* =====================================================
          MAIN DASHBOARD CONTENT
      ===================================================== */}

      <section className="grid gap-6 xl:grid-cols-3">


        {/* ===================================================
            PRIMARY COLUMN
        =================================================== */}

        <div className="min-w-0 space-y-6 xl:col-span-2">


          {/* =================================================
              SECURITY GAUGE
          ================================================= */}

          <SecurityGauge

            score={
              dashboardData?.securityScore ?? 94
            }

          />


          {/* =================================================
              IDENTITY ANALYTICS
          ================================================= */}

          <IdentityAnalytics />


          {/* =================================================
              RECENT ACTIVITY
          ================================================= */}

          <ActivityTable

            activities={
              activities
            }

          />


          {/* =================================================
              AI CONFIDENCE
          ================================================= */}

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


          {/* =================================================
              RISK INTELLIGENCE
          ================================================= */}

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


          {/* =================================================
              ACCESS REVIEW
          ================================================= */}

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


        {/* ===================================================
            SECONDARY COLUMN
        =================================================== */}

        <div className="min-w-0 space-y-6">

          <AIInsights />

          <SystemStatus />

        </div>


      </section>

    </main>

  );
}