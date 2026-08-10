import { useEffect, useState } from "react";

import {
  Activity as ActivityIcon,
  CheckCircle2,
  Clock3,
  ShieldAlert,
} from "lucide-react";

import { getActivities } from "../services/activity";
import type { Activity } from "../services/activity";

export default function Activity() {
  // =========================================================
  // STATE
  // =========================================================

  const [activities, setActivities] = useState<Activity[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // =========================================================
  // LOAD ACTIVITY DATA
  // =========================================================

  useEffect(() => {
    async function loadActivities() {
      try {
        setLoading(true);
        setError("");

        const data = await getActivities();

        console.log(
          "ACTIVITY PAGE DATA:",
          data
        );

        setActivities(data);
      } catch (err) {
        console.error(
          "Activity API Error:",
          err
        );

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(
            "Unable to load activity data."
          );
        }
      } finally {
        setLoading(false);
      }
    }

    loadActivities();
  }, []);


  // =========================================================
  // ACTIVITY SUMMARY
  // =========================================================

  const totalActivities = activities.length;

  const completedActivities = activities.filter(
    (activity) =>
      activity.status.toLowerCase() === "completed" ||
      activity.status.toLowerCase() === "success"
  ).length;

  const pendingActivities = activities.filter(
    (activity) =>
      activity.status.toLowerCase() === "pending"
  ).length;


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-slate-400">
          Loading Activity...
        </p>
      </div>
    );
  }


  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">

        <div className="flex items-center gap-3">

          <ShieldAlert
            size={20}
            className="text-red-400"
          />

          <div>

            <p className="font-medium text-red-400">
              Activity data unavailable
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {error}
            </p>

          </div>

        </div>

      </div>
    );
  }


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

            <ActivityIcon
              size={22}
              className="text-cyan-400"
            />

          </div>

          <div>

            <h1 className="text-2xl font-bold text-white">
              Activity
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Enterprise identity and security activity
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          KPI CARDS
      ===================================================== */}

      <section className="grid gap-5 md:grid-cols-3">

        {/* Total */}

        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">

          <div className="flex items-center justify-between">

            <p className="text-sm text-slate-400">
              Total Activities
            </p>

            <ActivityIcon
              size={19}
              className="text-cyan-400"
            />

          </div>

          <p className="mt-3 text-3xl font-bold text-white">
            {totalActivities}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            Recent identity security events
          </p>

        </div>


        {/* Completed */}

        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">

          <div className="flex items-center justify-between">

            <p className="text-sm text-slate-400">
              Completed
            </p>

            <CheckCircle2
              size={19}
              className="text-emerald-400"
            />

          </div>

          <p className="mt-3 text-3xl font-bold text-emerald-400">
            {completedActivities}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            Successful or completed actions
          </p>

        </div>


        {/* Pending */}

        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">

          <div className="flex items-center justify-between">

            <p className="text-sm text-slate-400">
              Pending
            </p>

            <Clock3
              size={19}
              className="text-amber-400"
            />

          </div>

          <p className="mt-3 text-3xl font-bold text-amber-400">
            {pendingActivities}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            Actions awaiting completion
          </p>

        </div>

      </section>


      {/* =====================================================
          ACTIVITY TABLE
      ===================================================== */}

      <section>

        <div className="mb-4">

          <h2 className="text-lg font-semibold text-white">
            Recent Activity
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Latest identity and access events from the platform
          </p>

        </div>


        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/40">

          {/* Table Header */}

          <div className="hidden grid-cols-5 gap-4 border-b border-slate-800 bg-slate-950/70 px-5 py-4 text-xs font-medium uppercase tracking-wide text-slate-500 md:grid">

            <span>User</span>

            <span>Action</span>

            <span>Status</span>

            <span>Time</span>

            <span>Event ID</span>

          </div>


          {/* Activity Rows */}

          <div className="divide-y divide-slate-800">

            {activities.map((activity) => {

              const status =
                activity.status.toLowerCase();

              const isPending =
                status === "pending";

              const isSuccessful =
                status === "completed" ||
                status === "success";

              return (
                <div
                  key={activity.id}
                  className="grid gap-4 px-5 py-5 transition hover:bg-slate-900/40 md:grid-cols-5 md:items-center"
                >

                  {/* User */}

                  <div>

                    <p className="font-medium text-white">
                      {activity.user}
                    </p>

                    <p className="mt-1 text-xs text-slate-500 md:hidden">
                      User
                    </p>

                  </div>


                  {/* Action */}

                  <div>

                    <p className="text-sm text-slate-300">
                      {activity.action}
                    </p>

                    <p className="mt-1 text-xs text-slate-600 md:hidden">
                      Action
                    </p>

                  </div>


                  {/* Status */}

                  <div>

                    <span
                      className={[
                        "inline-flex rounded-full border px-3 py-1",
                        "text-xs font-medium",
                        isPending
                          ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
                          : isSuccessful
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                            : "border-slate-700 bg-slate-800/50 text-slate-400",
                      ].join(" ")}
                    >
                      {activity.status}
                    </span>

                  </div>


                  {/* Time */}

                  <div>

                    <p className="text-sm text-slate-400">
                      {activity.time}
                    </p>

                  </div>


                  {/* Event ID */}

                  <div>

                    <span className="font-mono text-xs text-slate-500">
                      #{activity.id}
                    </span>

                  </div>

                </div>
              );
            })}

          </div>


          {/* Empty State */}

          {activities.length === 0 && (

            <div className="p-10 text-center">

              <ActivityIcon
                size={24}
                className="mx-auto text-slate-600"
              />

              <p className="mt-3 text-sm text-slate-500">
                No activity events available.
              </p>

            </div>

          )}

        </div>

      </section>

    </div>
  );
}