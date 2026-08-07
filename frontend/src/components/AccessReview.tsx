import {
  ClipboardCheck,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  CalendarClock,
} from "lucide-react";

import GovernanceActions from "./GovernanceActions";

import type { GovernanceAction } from "../types/accessReview";

type AccessReviewProps = {
  completedReviews: number;
  pendingReviews: number;
  overdueReviews: number;
  completionRate: number;
  nextCampaign: string;
  governanceActions: GovernanceAction[];
};

export default function AccessReview({
  completedReviews,
  pendingReviews,
  overdueReviews,
  completionRate,
  nextCampaign,
  governanceActions,
}: AccessReviewProps) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">

        <div>
          <div className="flex items-center gap-2">

            <ClipboardCheck
              size={21}
              className="text-cyan-400"
            />

            <h2 className="text-xl font-bold text-white">
              Access Review
            </h2>

          </div>

          <p className="mt-1 text-sm text-slate-400">
            Identity Governance Summary
          </p>
        </div>

        <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-400">
          Governance
        </span>

      </div>

      {/* KPI Cards */}
      <div className="mb-7 grid grid-cols-2 gap-4 xl:grid-cols-4">

        {/* Completed */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">

          <div className="flex items-center justify-between">

            <p className="text-xs uppercase tracking-wide text-slate-400">
              Completed
            </p>

            <CheckCircle2
              size={18}
              className="text-emerald-400"
            />

          </div>

          <h3 className="mt-3 text-3xl font-bold text-emerald-400">
            {completedReviews}
          </h3>

          <div className="mt-3 h-2 rounded-full bg-slate-800">

            <div
              className="h-2 rounded-full bg-emerald-400"
              style={{
                width: `${Math.min(completionRate, 100)}%`,
              }}
            />

          </div>

        </div>

        {/* Pending */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">

          <div className="flex items-center justify-between">

            <p className="text-xs uppercase tracking-wide text-slate-400">
              Pending
            </p>

            <Clock3
              size={18}
              className="text-amber-400"
            />

          </div>

          <h3 className="mt-3 text-3xl font-bold text-amber-400">
            {pendingReviews}
          </h3>

          <div className="mt-3 h-2 rounded-full bg-slate-800">

            <div
              className="h-2 rounded-full bg-amber-400"
              style={{ width: "35%" }}
            />

          </div>

        </div>

        {/* Overdue */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">

          <div className="flex items-center justify-between">

            <p className="text-xs uppercase tracking-wide text-slate-400">
              Overdue
            </p>

            <AlertTriangle
              size={18}
              className="text-red-400"
            />

          </div>

          <h3 className="mt-3 text-3xl font-bold text-red-400">
            {overdueReviews}
          </h3>

          <div className="mt-3 h-2 rounded-full bg-slate-800">

            <div
              className="h-2 rounded-full bg-red-400"
              style={{ width: "20%" }}
            />

          </div>

        </div>

        {/* Completion Rate */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">

          <div className="flex items-center justify-between">

            <p className="text-xs uppercase tracking-wide text-slate-400">
              Completion Rate
            </p>

            <CheckCircle2
              size={18}
              className="text-cyan-400"
            />

          </div>

          <h3 className="mt-3 text-3xl font-bold text-cyan-400">
            {completionRate}%
          </h3>

          <div className="mt-3 h-2 rounded-full bg-slate-800">

            <div
              className="h-2 rounded-full bg-cyan-400"
              style={{
                width: `${Math.min(completionRate, 100)}%`,
              }}
            />

          </div>

        </div>

      </div>

      {/* Review Health */}
      <div className="mb-6">

        <div className="mb-3 flex items-center justify-between">

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Review Health
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Current identity certification activity
            </p>
          </div>

          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
            Active
          </span>

        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">

          {/* Completed */}
          <div className="mb-5">

            <div className="mb-2 flex items-center justify-between">

              <div className="flex items-center gap-2">

                <CheckCircle2
                  size={16}
                  className="text-emerald-400"
                />

                <span className="text-sm text-slate-300">
                  Completed reviews
                </span>

              </div>

              <span className="text-sm font-semibold text-white">
                {completedReviews}
              </span>

            </div>

            <div className="h-2 rounded-full bg-slate-800">

              <div
                className="h-2 rounded-full bg-emerald-400"
                style={{
                  width: `${Math.min(completionRate, 100)}%`,
                }}
              />

            </div>

          </div>

          {/* Pending */}
          <div className="mb-5">

            <div className="mb-2 flex items-center justify-between">

              <div className="flex items-center gap-2">

                <Clock3
                  size={16}
                  className="text-amber-400"
                />

                <span className="text-sm text-slate-300">
                  Pending reviews
                </span>

              </div>

              <span className="text-sm font-semibold text-white">
                {pendingReviews}
              </span>

            </div>

            <div className="h-2 rounded-full bg-slate-800">

              <div
                className="h-2 rounded-full bg-amber-400"
                style={{ width: "35%" }}
              />

            </div>

          </div>

          {/* Overdue */}
          <div>

            <div className="mb-2 flex items-center justify-between">

              <div className="flex items-center gap-2">

                <AlertTriangle
                  size={16}
                  className="text-red-400"
                />

                <span className="text-sm text-slate-300">
                  Overdue reviews
                </span>

              </div>

              <span className="text-sm font-semibold text-red-400">
                {overdueReviews}
              </span>

            </div>

            <div className="h-2 rounded-full bg-slate-800">

              <div
                className="h-2 rounded-full bg-red-400"
                style={{ width: "20%" }}
              />

            </div>

          </div>

        </div>

      </div>

      {/* Next Campaign */}
      <div className="mb-6">

        <p className="mb-3 text-xs uppercase tracking-wide text-slate-400">
          Next Campaign
        </p>

        <div className="flex items-center gap-4 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10">

            <CalendarClock
              size={21}
              className="text-cyan-400"
            />

          </div>

          <div className="min-w-0">

            <p className="text-sm font-semibold text-white">
              Upcoming Access Review Campaign
            </p>

            <p className="mt-1 text-sm text-slate-400">
              {nextCampaign}
            </p>

          </div>

        </div>

      </div>

      {/* Governance Actions */}
      <GovernanceActions
        actions={governanceActions}
      />

    </div>
  );
}