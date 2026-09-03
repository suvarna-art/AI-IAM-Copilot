import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
} from "lucide-react";

import GovernanceActions from "./GovernanceActions";

import type {
  GovernanceAction,
} from "../types/accessReview";


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
  const totalReviews =
    completedReviews +
    pendingReviews +
    overdueReviews;

  const pendingRate =
    totalReviews > 0
      ? Math.round(
          (pendingReviews /
            totalReviews) *
            100
        )
      : 0;

  const overdueRate =
    totalReviews > 0
      ? Math.round(
          (overdueReviews /
            totalReviews) *
            100
        )
      : 0;


  return (
    <section className="if-surface-elevated relative overflow-hidden p-6 sm:p-8">

      {/* GOVERNANCE EDGE */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-300/28 to-violet-300/18" />


      {/* AMBIENT GOVERNANCE */}
      <div className="pointer-events-none absolute right-[-90px] top-[-90px] h-60 w-60 rounded-full bg-[rgba(72,215,198,0.03)] blur-[90px]" />


      <div className="relative z-10">

        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

          <div className="flex items-start gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-teal-300/12 bg-teal-300/[0.04] text-teal-200">

              <ClipboardCheck
                size={18}
              />

            </div>


            <div>

              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--if-teal-soft)]">
                Governance Campaigns
              </p>

              <h2 className="if-heading mt-1 text-lg font-bold sm:text-xl">
                Access Review
              </h2>

              <p className="mt-2 text-sm leading-6 text-[var(--if-text-muted)]">
                Certification progress, overdue exposure and upcoming governance activity.
              </p>

            </div>

          </div>


          <span className="if-badge">
            Identity Governance
          </span>

        </div>


        {/* SUMMARY SIGNALS */}
        <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

          <ReviewMetric
            label="Completed"
            value={completedReviews}
            icon={
              <CheckCircle2
                size={16}
              />
            }
            tone="allow"
          />

          <ReviewMetric
            label="Pending"
            value={pendingReviews}
            icon={
              <Clock3
                size={16}
              />
            }
            tone="step-up"
          />

          <ReviewMetric
            label="Overdue"
            value={overdueReviews}
            icon={
              <AlertTriangle
                size={16}
              />
            }
            tone="deny"
          />

          <ReviewMetric
            label="Completion Rate"
            value={`${completionRate}%`}
            icon={
              <ClipboardCheck
                size={16}
              />
            }
            tone="identity"
          />

        </div>


        {/* GOVERNANCE HEALTH */}
        <div className="mt-7 rounded-2xl border border-[var(--if-border-soft)] bg-black/10 p-5">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--if-text-faint)]">
                Certification Health
              </p>

              <p className="mt-1 text-sm font-semibold text-[var(--if-text-primary)]">
                Current review campaign state
              </p>

            </div>


            <div className="flex items-center gap-2">

              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />

              <span className="text-[10px] font-medium text-emerald-200/80">
                Campaign Active
              </span>

            </div>

          </div>


          <div className="mt-6 space-y-5">

            <ReviewProgress
              label="Completed reviews"
              value={completedReviews}
              percent={completionRate}
              tone="allow"
            />

            <ReviewProgress
              label="Pending reviews"
              value={pendingReviews}
              percent={pendingRate}
              tone="step-up"
            />

            <ReviewProgress
              label="Overdue reviews"
              value={overdueReviews}
              percent={overdueRate}
              tone="deny"
            />

          </div>

        </div>


        {/* NEXT CAMPAIGN */}
        <div className="mt-6">

          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--if-text-faint)]">
            Next Campaign
          </p>


          <div className="mt-3 flex items-center gap-4 rounded-2xl border border-violet-300/12 bg-violet-300/[0.025] p-5">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-300/12 bg-violet-300/[0.04] text-violet-200">

              <CalendarClock
                size={19}
              />

            </div>


            <div className="min-w-0">

              <p className="text-sm font-semibold text-[var(--if-text-primary)]">
                Upcoming Access Review Campaign
              </p>

              <p className="mt-1 text-sm text-[var(--if-text-muted)]">
                {nextCampaign}
              </p>

            </div>

          </div>

        </div>


        {/* GOVERNANCE ACTIONS */}
        <div className="mt-6">

          <div className="mb-3">

            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--if-text-faint)]">
              Governance Actions
            </p>

            <p className="mt-1 text-sm font-semibold text-[var(--if-text-primary)]">
              Items requiring certification attention
            </p>

          </div>


          <GovernanceActions
            actions={
              governanceActions
            }
          />

        </div>

      </div>

    </section>
  );
}


function ReviewMetric({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value:
    | number
    | string;
  icon:
    React.ReactNode;
  tone:
    | "allow"
    | "step-up"
    | "deny"
    | "identity";
}) {
  const classes =
    tone === "allow"
      ? "border-emerald-300/12 bg-emerald-300/[0.03] text-[var(--if-allow)]"
      : tone === "step-up"
      ? "border-amber-300/12 bg-amber-300/[0.03] text-[var(--if-step-up)]"
      : tone === "deny"
      ? "border-rose-300/12 bg-rose-300/[0.03] text-[var(--if-deny)]"
      : "border-teal-300/12 bg-teal-300/[0.03] text-teal-200";


  return (
    <div className="rounded-2xl border border-[var(--if-border-soft)] bg-black/10 p-4">

      <div className="flex items-start justify-between gap-3">

        <div>

          <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[var(--if-text-faint)]">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-[-0.035em] text-[var(--if-text-primary)]">
            {value}
          </p>

        </div>


        <div
          className={[
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border",
            classes,
          ].join(
            " "
          )}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}


function ReviewProgress({
  label,
  value,
  percent,
  tone,
}: {
  label: string;
  value: number;
  percent: number;
  tone:
    | "allow"
    | "step-up"
    | "deny";
}) {
  const normalizedPercent =
    Math.min(
      Math.max(
        percent,
        0
      ),
      100
    );


  const barClass =
    tone === "allow"
      ? "bg-[var(--if-allow)]"
      : tone === "step-up"
      ? "bg-[var(--if-step-up)]"
      : "bg-[var(--if-deny)]";


  const valueClass =
    tone === "allow"
      ? "text-[var(--if-allow)]"
      : tone === "step-up"
      ? "text-[var(--if-step-up)]"
      : "text-[var(--if-deny)]";


  return (
    <div>

      <div className="mb-2 flex items-center justify-between gap-3">

        <span className="text-xs font-medium text-[var(--if-text-secondary)]">
          {label}
        </span>

        <span
          className={[
            "text-xs font-semibold",
            valueClass,
          ].join(
            " "
          )}
        >
          {value}
        </span>

      </div>


      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.04]">

        <div
          className={[
            "h-full rounded-full transition-all duration-700",
            barClass,
          ].join(
            " "
          )}
          style={{
            width:
              `${normalizedPercent}%`,
          }}
        />

      </div>

    </div>
  );
}