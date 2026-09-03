import {
  motion,
} from "framer-motion";

import {
  Activity,
  ShieldCheck,
} from "lucide-react";

import type {
  Activity as ActivityType,
} from "../types/dashboard";


type ActivityTableProps = {
  activities: ActivityType[];
};


const statusStyles = {
  Pending:
    "border-[rgba(230,179,92,0.14)] bg-[rgba(230,179,92,0.045)] text-[var(--if-step-up)]",

  Completed:
    "border-[rgba(85,214,162,0.14)] bg-[rgba(85,214,162,0.045)] text-[var(--if-allow)]",

  Success:
    "border-[rgba(72,215,198,0.14)] bg-[rgba(72,215,198,0.045)] text-[var(--if-teal-soft)]",
};


export default function ActivityTable({
  activities,
}: ActivityTableProps) {
  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 18,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.45,
        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      }}
      className="if-surface-elevated relative overflow-hidden p-6 sm:p-8"
    >

      {/* EVENT STREAM EDGE */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-300/28 to-violet-300/16" />


      {/* AMBIENT DEPTH */}
      <div className="pointer-events-none absolute right-[-80px] top-[-70px] h-52 w-52 rounded-full bg-[rgba(72,215,198,0.025)] blur-[80px]" />


      <div className="relative z-10">

        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

          <div className="flex items-start gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-teal-300/12 bg-teal-300/[0.04] text-teal-200">

              <Activity
                size={18}
              />

            </div>


            <div>

              <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--if-teal-soft)]">
                Identity Event Stream
              </p>

              <h2 className="if-heading mt-1 text-lg font-bold sm:text-xl">
                Recent Security Activity
              </h2>

              <p className="mt-2 text-sm text-[var(--if-text-muted)]">
                Recent IAM events and governance operations.
              </p>

            </div>

          </div>


          <div className="flex items-center gap-2 rounded-xl border border-emerald-300/10 bg-emerald-300/[0.035] px-3 py-2">

            <span className="relative flex h-2 w-2 items-center justify-center">

              <span className="absolute h-full w-full rounded-full bg-emerald-300/20" />

              <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-300" />

            </span>

            <span className="text-[10px] font-medium text-emerald-200/80">
              Live Events
            </span>

          </div>

        </div>


        {/* EVENT LIST */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--if-border-soft)] bg-black/10">

          {activities.length === 0 ? (

            <div className="px-5 py-10 text-center">

              <p className="text-sm font-medium text-[var(--if-text-primary)]">
                No recent identity events
              </p>

              <p className="mt-2 text-xs text-[var(--if-text-muted)]">
                Security activity will appear here as events are received.
              </p>

            </div>

          ) : (

            activities.map(
              (
                activity,
                index
              ) => {

                const Icon =
                  ShieldCheck;


                const statusClass =
                  statusStyles[
                    activity.status as keyof typeof statusStyles
                  ] ||
                  "border-[var(--if-border-soft)] bg-white/[0.025] text-[var(--if-text-secondary)]";


                return (
                  <motion.div
                    key={
                      activity.id
                    }
                    initial={{
                      opacity: 0,
                      x: -10,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      delay:
                        index *
                        0.06,
                    }}
                    whileHover={{
                      x: 2,
                    }}
                    className={[
                      "group flex flex-col gap-4 px-5 py-4 transition hover:bg-white/[0.02] sm:flex-row sm:items-center sm:justify-between",
                      index !==
                      activities.length -
                        1
                        ? "border-b border-[var(--if-border-soft)]"
                        : "",
                    ].join(
                      " "
                    )}
                  >

                    {/* EVENT IDENTITY */}
                    <div className="flex min-w-0 items-center gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-teal-300/10 bg-teal-300/[0.03] text-teal-200">

                        <Icon
                          size={16}
                        />

                      </div>


                      <div className="min-w-0">

                        <h3 className="truncate text-sm font-semibold text-[var(--if-text-primary)]">
                          {activity.action}
                        </h3>

                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[var(--if-text-muted)]">

                          <span className="truncate">
                            {activity.user}
                          </span>

                          <span className="text-[var(--if-text-faint)]">
                            ·
                          </span>

                          <span>
                            IAM event
                          </span>

                        </div>

                      </div>

                    </div>


                    {/* EVENT STATE */}
                    <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end">

                      <span
                        className={`inline-flex rounded-lg border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${statusClass}`}
                      >
                        {activity.status}
                      </span>


                      <span className="min-w-[64px] text-right text-[10px] text-[var(--if-text-faint)]">
                        {activity.time}
                      </span>

                    </div>

                  </motion.div>
                );
              }
            )

          )}

        </div>


        {/* FOOTER CONTEXT */}
        <div className="mt-4 flex items-center justify-between gap-4">

          <p className="text-[10px] uppercase tracking-[0.12em] text-[var(--if-text-faint)]">
            Identity governance activity
          </p>

          <p className="text-[10px] text-[var(--if-text-muted)]">
            {activities.length} events loaded
          </p>

        </div>

      </div>

    </motion.section>
  );
}