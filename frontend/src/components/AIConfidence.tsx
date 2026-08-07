import { motion } from "framer-motion";
import { BrainCircuit, TrendingUp } from "lucide-react";

type AIConfidenceProps = {
  score: number;
  prediction: string;
  trend: string;
};

export default function AIConfidence({
  score,
  prediction,
  trend,
}: AIConfidenceProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between gap-6">

        {/* Left: AI information */}
        <div>
          <div className="flex items-center gap-2">
            <BrainCircuit
              size={24}
              className="text-cyan-400"
            />

            <h2 className="text-xl font-bold text-white">
              AI Confidence
            </h2>
          </div>

          <p className="mt-2 text-sm text-slate-400">
            {prediction}
          </p>
        </div>

        {/* Right: Confidence score */}
        <div className="shrink-0 text-right">
          <h1 className="text-5xl font-bold text-cyan-400">
            {score}%
          </h1>

          <div className="mt-2 flex items-center justify-end gap-2 text-green-400">
            <TrendingUp size={18} />

            <span className="text-sm">
              {trend}
            </span>
          </div>
        </div>

      </div>

      {/* Confidence progress bar */}
      <div className="mt-5 h-2 w-full rounded-full bg-slate-800">
        <div
          className="h-2 rounded-full bg-cyan-400 transition-all duration-500"
          style={{
            width: `${Math.min(Math.max(score, 0), 100)}%`,
          }}
        />
      </div>
    </motion.div>
  );
}