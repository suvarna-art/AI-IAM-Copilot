import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import StatCard from "../components/StatCard";
import ActivityTable from "../components/ActivityTable";
import AIInsights from "../components/AIInsights";
import IdentityAnalytics from "../components/IdentityAnalytics";
import SystemStatus from "../components/SystemStatus";
import WelcomeBanner from "../components/WelcomeBanner";
import SecurityGauge from "../components/SecurityGauge";

import {
  ShieldCheck,
  Users,
  AlertTriangle,
  ClipboardCheck,
} from "lucide-react";

import { useEffect, useState } from "react";
import { getDashboardData } from "../services/dashboard";
import type { DashboardData } from "../types/dashboard";

export default function Dashboard() {
  const [dashboardData, setDashboardData] =
  useState<DashboardData | null>(null);

const [loading, setLoading] = useState(true);

const [error, setError] = useState("");
useEffect(() => {
  async function loadDashboard() {
    try {
      const data = await getDashboardData();

      setDashboardData(data);
    } catch (err) {
      setError("Unable to load dashboard.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  loadDashboard();
}, []);
if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      Loading Dashboard...
    </div>
  );
}

if (error) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-red-500">
      {error}
    </div>
  );
}

    return (
    <div className="relative flex min-h-screen overflow-hidden bg-slate-950">
      {/* Decorative Background */}

<div className="absolute inset-0 overflow-hidden pointer-events-none">

  <div
    className="
      absolute
      -left-40
      -top-40
      h-96
      w-96
      rounded-full
      bg-cyan-500/10
      blur-[140px]
    "
  />

  <div
    className="
      absolute
      right-0
      top-40
      h-80
      w-80
      rounded-full
      bg-blue-600/10
      blur-[120px]
    "
  />

  <div
    className="
      absolute
      bottom-0
      left-1/2
      h-72
      w-72
      rounded-full
      bg-indigo-500/10
      blur-[120px]
    "
  />

</div>

      <Sidebar />

      <div className="flex flex-1 flex-col">

        <Header />

        <main className="flex-1 p-8 space-y-8">

          {/* Hero */}

            <section>

              <WelcomeBanner />

            </section>

          {/* KPI Cards */}

          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

            <StatCard
              title="Security Score"
              value={dashboardData
                    ? `${dashboardData.securityScore}%`
                    : "--"
                    }
              change="+2.1%"
              positive={true}
              icon={ShieldCheck}
            />

            <StatCard
              title="Active Identities"
              value={dashboardData
                      ? dashboardData.activeIdentities.toLocaleString()
                      : "--"
                    }
              change="+318"
              positive={true}
              icon={Users}
            />

            <StatCard
              title="High Risk Accounts"
              value={dashboardData
                      ? dashboardData.highRiskAccounts.toString()
                      : "--"
                    }
              change="-6"
              positive={false}
              icon={AlertTriangle}
            />

            <StatCard
              title="Pending Reviews"
              value={dashboardData
                      ? dashboardData.pendingReviews.toString()
                      : "--"
                    }
              change="+14"
              positive={true}
              icon={ClipboardCheck}
            />

          </section>

          {/* Analytics + AI */}

          <section className="grid gap-6 xl:grid-cols-3">

            <div className="xl:col-span-2 space-y-6">

    <SecurityGauge score={94} />

    <IdentityAnalytics />

    <ActivityTable />

</div>
            <div>

              <div className="space-y-6">

              <AIInsights />

              <SystemStatus />

            </div>

            </div>

          </section>

          {/* Activity */}

          <section>

            <ActivityTable />

          </section>

        </main>

      </div>

    </div>
  );
}