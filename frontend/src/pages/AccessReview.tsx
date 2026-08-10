import { useEffect, useState } from "react";

import {
  ClipboardCheck,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  CalendarClock,
  ShieldCheck,
} from "lucide-react";

import GovernanceActions from "../components/GovernanceActions";

import { getAccessReview } from "../services/accessReview";

import type {
  AccessReview as AccessReviewData,
  GovernanceAction,
} from "../types/accessReview";


export default function AccessReview() {
  // =========================================================
  // STATE
  // =========================================================

  const [accessReview, setAccessReview] =
    useState<AccessReviewData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // =========================================================
  // LOAD ACCESS REVIEW DATA
  // =========================================================

  useEffect(() => {
    async function loadAccessReview() {
      try {
        setLoading(true);
        setError("");

        const data = await getAccessReview();

        console.log(
          "ACCESS REVIEW PAGE DATA:",
          data
        );

        setAccessReview(data);

      } catch (err) {
        console.error(
          "Access Review API Error:",
          err
        );

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(
            "Unable to load Access Review data."
          );
        }

      } finally {
        setLoading(false);
      }
    }

    loadAccessReview();
  }, []);


  // =========================================================
  // LOADING STATE
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-sm text-slate-400">
          Loading Access Review intelligence...
        </div>
      </div>
    );
  }


  // =========================================================
  // ERROR STATE
  // =========================================================

  if (error || !accessReview) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">

        <div className="flex items-center gap-3">

          <AlertTriangle
            size={20}
            className="text-red-400"
          />

          <div>

            <p className="font-medium text-red-400">
              Access Review unavailable
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {error || "No Access Review data available."}
            </p>

          </div>

        </div>

      </div>
    );
  }


  // =========================================================
  // GOVERNANCE ACTIONS
  // =========================================================

  const governanceActions: GovernanceAction[] = [];


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


  // =========================================================
  // MAIN PAGE
  // =========================================================

  return (
    <div className="space-y-8">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <section>

        <div className="flex items-start justify-between gap-6">

          <div>

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10">

                <ClipboardCheck
                  size={22}
                  className="text-cyan-400"
                />

              </div>

              <div>

                <h1 className="text-2xl font-bold text-white">
                  Access Review
                </h1>

                <p className="mt-1 text-sm text-slate-400">
                  Enterprise identity certification and
                  governance intelligence
                </p>

              </div>

            </div>

          </div>


          <div className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400 md:flex">

            <ShieldCheck size={16} />

            Governance Active

          </div>

        </div>

      </section>


      {/* =====================================================
          KPI CARDS
      ===================================================== */}

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">


        {/* COMPLETED */}

        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">

          <div className="flex items-center justify-between">

            <p className="text-sm text-slate-400">
              Completed Reviews
            </p>

            <CheckCircle2
              size={19}
              className="text-emerald-400"
            />

          </div>

          <p className="mt-3 text-3xl font-bold text-emerald-400">
            {accessReview.completedReviews}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            Successfully certified
          </p>

        </div>


        {/* PENDING */}

        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">

          <div className="flex items-center justify-between">

            <p className="text-sm text-slate-400">
              Pending Reviews
            </p>

            <Clock3
              size={19}
              className="text-amber-400"
            />

          </div>

          <p className="mt-3 text-3xl font-bold text-amber-400">
            {accessReview.pendingReviews}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            Awaiting certification
          </p>

        </div>


        {/* OVERDUE */}

        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">

          <div className="flex items-center justify-between">

            <p className="text-sm text-slate-400">
              Overdue Reviews
            </p>

            <AlertTriangle
              size={19}
              className="text-red-400"
            />

          </div>

          <p className="mt-3 text-3xl font-bold text-red-400">
            {accessReview.overdueReviews}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            Require immediate attention
          </p>

        </div>


        {/* COMPLETION RATE */}

        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">

          <div className="flex items-center justify-between">

            <p className="text-sm text-slate-400">
              Completion Rate
            </p>

            <CheckCircle2
              size={19}
              className="text-cyan-400"
            />

          </div>

          <p className="mt-3 text-3xl font-bold text-cyan-400">
            {accessReview.completionRate}%
          </p>

          <div className="mt-3 h-2 rounded-full bg-slate-800">

            <div
              className="h-2 rounded-full bg-cyan-400"
              style={{
                width: `${Math.min(
                  accessReview.completionRate,
                  100
                )}%`,
              }}
            />

          </div>

        </div>

      </section>


      {/* =====================================================
          REVIEW HEALTH
      ===================================================== */}

      <section>

        <div className="mb-4">

          <h2 className="text-lg font-semibold text-white">
            Review Health
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Current identity certification activity
          </p>

        </div>


        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6">


          {/* COMPLETED */}

          <div className="mb-6">

            <div className="mb-2 flex items-center justify-between">

              <div className="flex items-center gap-2">

                <CheckCircle2
                  size={17}
                  className="text-emerald-400"
                />

                <span className="text-sm text-slate-300">
                  Completed reviews
                </span>

              </div>

              <span className="text-sm font-semibold text-white">
                {accessReview.completedReviews}
              </span>

            </div>

            <div className="h-2 rounded-full bg-slate-800">

              <div
                className="h-2 rounded-full bg-emerald-400"
                style={{
                  width: `${Math.min(
                    accessReview.completionRate,
                    100
                  )}%`,
                }}
              />

            </div>

          </div>


          {/* PENDING */}

          <div className="mb-6">

            <div className="mb-2 flex items-center justify-between">

              <div className="flex items-center gap-2">

                <Clock3
                  size={17}
                  className="text-amber-400"
                />

                <span className="text-sm text-slate-300">
                  Pending reviews
                </span>

              </div>

              <span className="text-sm font-semibold text-white">
                {accessReview.pendingReviews}
              </span>

            </div>

            <div className="h-2 rounded-full bg-slate-800">

              <div
                className="h-2 rounded-full bg-amber-400"
                style={{
                  width: `${Math.min(
                    (accessReview.pendingReviews /
                      Math.max(
                        accessReview.completedReviews +
                          accessReview.pendingReviews +
                          accessReview.overdueReviews,
                        1
                      )) *
                      100,
                    100
                  )}%`,
                }}
              />

            </div>

          </div>


          {/* OVERDUE */}

          <div>

            <div className="mb-2 flex items-center justify-between">

              <div className="flex items-center gap-2">

                <AlertTriangle
                  size={17}
                  className="text-red-400"
                />

                <span className="text-sm text-slate-300">
                  Overdue reviews
                </span>

              </div>

              <span className="text-sm font-semibold text-red-400">
                {accessReview.overdueReviews}
              </span>

            </div>

            <div className="h-2 rounded-full bg-slate-800">

              <div
                className="h-2 rounded-full bg-red-400"
                style={{
                  width: `${Math.min(
                    (accessReview.overdueReviews /
                      Math.max(
                        accessReview.completedReviews +
                          accessReview.pendingReviews +
                          accessReview.overdueReviews,
                        1
                      )) *
                      100,
                    100
                  )}%`,
                }}
              />

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          NEXT CAMPAIGN
      ===================================================== */}

      <section>

        <div className="mb-4">

          <h2 className="text-lg font-semibold text-white">
            Next Campaign
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Upcoming identity certification campaign
          </p>

        </div>


        <div className="flex items-center gap-4 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10">

            <CalendarClock
              size={22}
              className="text-cyan-400"
            />

          </div>

          <div>

            <p className="text-base font-semibold text-white">
              Upcoming Access Review Campaign
            </p>

            <p className="mt-1 text-sm text-cyan-400">
              {accessReview.nextCampaign}
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          GOVERNANCE ACTIONS
      ===================================================== */}

      {governanceActions.length > 0 && (

        <section>

          <div className="mb-4">

            <h2 className="text-lg font-semibold text-white">
              Governance Actions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Items requiring governance attention
            </p>

          </div>

          <GovernanceActions
            actions={governanceActions}
          />

        </section>

      )}

    </div>
  );
}