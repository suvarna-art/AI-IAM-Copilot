import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import AIInsights from "../components/AIInsights";
import ActivityTable from "../components/ActivityTable";

import {
  ShieldCheck,
  Users,
  AlertTriangle,
  ClipboardCheck,
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />

      <div className="flex-1 flex flex-col">

        <Header />

        <main className="flex-1 p-8">

          <h1 className="text-4xl font-bold text-white">
            Welcome back 👋
          </h1>

          <p className="mt-2 text-slate-400">
            Monitor identities, detect risks, and automate access governance with AI.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

            <StatCard
              title="Security Score"
              value="94%"
              change="+2.1%"
              positive={true}
              icon={ShieldCheck}
            />

            <StatCard
              title="Active Identities"
              value="12,486"
              change="+318"
              positive={true}
              icon={Users}
            />

            <StatCard
              title="High Risk Accounts"
              value="17"
              change="-6"
              positive={false}
              icon={AlertTriangle}
            />

            <StatCard
              title="Pending Reviews"
              value="83"
              change="+14"
              positive={true}
              icon={ClipboardCheck}
            />

          </div>

          <div className="mt-8 grid grid-cols-1 xl:grid-cols-3 gap-6">

            <div className="xl:col-span-2">
              <ActivityTable />
            </div>

              <AIInsights />

          </div>

        </main>

      </div>
    </div>
  );
}