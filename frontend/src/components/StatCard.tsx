import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon: LucideIcon;
};

export default function StatCard({
  title,
  value,
  change,
  positive,
  icon: Icon,
}: StatCardProps) {
  return (
    <div className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/10">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-slate-400 text-sm">
            {title}
          </p>

          <h2 className="mt-3 text-3xl font-bold text-white">
            {value}
          </h2>
        </div>

        <div className="rounded-xl bg-cyan-500/10 p-3">
          <Icon className="text-cyan-400" size={24} />
        </div>

      </div>

      <div className="mt-5 flex items-center gap-2">

        {positive ? (
          <ArrowUpRight className="text-green-400" size={18} />
        ) : (
          <ArrowDownRight className="text-red-400" size={18} />
        )}

        <span
          className={`text-sm font-medium ${
            positive ? "text-green-400" : "text-red-400"
          }`}
        >
          {change}
        </span>

        <span className="text-slate-500 text-sm">
          vs last week
        </span>

      </div>

    </div>
  );
}