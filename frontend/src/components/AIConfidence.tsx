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
      className="rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-6"
    >
      <div className="flex items-center justify-between">

        <div>

          <div className="flex items-center gap-2">

            <BrainCircuit
              className="text-cyan-400"
              size={24}
            />

            <h2 className="text-xl font-bold text-white">
              AI Confidence
            </h2>

          </div>

          <p className="mt-2 text-slate-400">
            {prediction}
          </p>

        </div>

        <div className="text-right">

          <h1 className="text-5xl font-bold text-cyan-400">
            {score}%
          </h1>

          <div className="mt-2 flex items-center justify-end gap-2 text-green-400">

            <TrendingUp size={18} />

            <span>{trend}</span>

          </div>

        </div>

      </div>
    </motion.div>
  );
}