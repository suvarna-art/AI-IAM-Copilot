import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import useCountUp from "../hooks/useCountUp";

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
  const numericValue = Number(value.replace(/[^0-9]/g, ""));

  const animatedValue = useCountUp(
    isNaN(numericValue) ? 0 : numericValue
  );

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 40,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
      }}
      whileHover={{
        y: -8,
        scale: 1.03,
      }}
      className="
        relative
        overflow-hidden
        rounded-3xl
        border
        border-slate-800
        bg-slate-900/80
        backdrop-blur-xl
        p-6
        transition-all
        duration-500
        hover:border-cyan-400/50
        hover:shadow-[0_0_40px_rgba(34,211,238,0.18)]
      "
    >
      {/* Background Glow */}
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-br
          from-cyan-500/5
          via-transparent
          to-blue-500/5
          pointer-events-none
        "
      />

      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-slate-400">
            {title}
          </p>

          <h2 className="mt-3 text-4xl font-bold text-white">
            {isNaN(numericValue)
              ? value
              : value.includes("%")
              ? `${animatedValue}%`
              : animatedValue.toLocaleString()}
          </h2>
        </div>

        <motion.div
          whileHover={{
            rotate: 12,
            scale: 1.15,
          }}
          whileTap={{
            scale:0.98
          }}
          transition={{
            duration: 0.25,
          }}
          className="
            rounded-2xl
            border
            border-cyan-500/20
            bg-cyan-500/10
            p-4
          "
        >
          <Icon
            size={28}
            className="text-cyan-400"
          />
        </motion.div>
      </div>

      <div className="relative mt-6 flex items-center gap-2">
        {positive ? (
          <ArrowUpRight
            size={18}
            className="text-green-400"
          />
        ) : (
          <ArrowDownRight
            size={18}
            className="text-red-400"
          />
        )}

        <span
          className={`font-semibold ${
            positive
              ? "text-green-400"
              : "text-red-400"
          }`}
        >
          {change}
        </span>

        <span className="text-slate-500">
          vs last week
        </span>
      </div>
    </motion.div>
  );
}