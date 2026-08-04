import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import type { Activity } from "../types/dashboard";

type ActivityTableProps = {
  activities: Activity[];
};

const statusStyles = {
  Pending: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  Completed: "bg-green-500/15 text-green-400 border-green-500/30",
  Success: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
};

export default function ActivityTable({
  activities,
}: ActivityTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">
            Recent Security Activity
          </h2>

          <p className="text-slate-400 text-sm mt-1">
            Live IAM Events
          </p>
        </div>

        <span className="rounded-full bg-cyan-500/10 px-4 py-2 text-sm text-cyan-400 border border-cyan-500/20">
          Live
        </span>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = ShieldCheck;

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: index * 0.12,
              }}
              whileHover={{
                scale: 1.02,
              }}
              className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 p-5 hover:border-cyan-500/40 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-cyan-500/10 p-3">
                  <Icon
                    size={22}
                    className="text-cyan-400"
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-white">
                    {activity.action}
                  </h3>

                  <p className="text-sm text-slate-400">
                    {activity.user}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${
                    statusStyles[
                      activity.status as keyof typeof statusStyles
                    ]
                  }`}
                >
                  {activity.status}
                </span>

                <p className="mt-2 text-xs text-slate-500">
                  {activity.time}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}