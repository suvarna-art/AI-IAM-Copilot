import { Sparkles, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function AIInsights() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 h-full">

      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="text-cyan-400" />
        <h2 className="text-xl font-semibold text-white">
          AI Security Insights
        </h2>
      </div>

      <div className="space-y-5">

        <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4">
          <div className="flex items-center gap-3">
            <ShieldAlert className="text-red-400" />
            <div>
              <p className="text-white font-medium">
                High Risk Accounts
              </p>
              <p className="text-slate-400 text-sm">
                3 privileged users have unusual login activity.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-green-400" />
            <div>
              <p className="text-white font-medium">
                AI Recommendation
              </p>

              <p className="text-slate-400 text-sm">
                Review dormant administrator accounts older than 90 days.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}