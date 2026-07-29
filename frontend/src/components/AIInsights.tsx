import { motion } from "framer-motion";
import {
  Bot,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  BrainCircuit,
} from "lucide-react";

const insights = [
  {
    icon: ShieldAlert,
    title: "Dormant Privileged Account",
    description: "Admin account inactive for 91 days.",
    color: "text-red-400",
  },
  {
    icon: Sparkles,
    title: "Role Optimization",
    description: "AI recommends merging 4 duplicate roles.",
    color: "text-cyan-400",
  },
  {
    icon: BrainCircuit,
    title: "Risk Prediction",
    description: "Predicted insider risk increased by 12%.",
    color: "text-yellow-400",
  },
];

export default function AIInsights() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-6 h-full"
    >
      <div className="flex items-center gap-3 mb-6">

        <div className="rounded-2xl bg-cyan-500/10 p-3">
          <Bot
            size={28}
            className="text-cyan-400"
          />
        </div>

        <div>

          <h2 className="text-xl font-bold text-white">
            IdentityForge AI
          </h2>

          <p className="text-sm text-green-400">
            ● Online
          </p>

        </div>

      </div>

      <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5 mb-6">

        <p className="text-sm text-slate-400">
          AI Confidence
        </p>

        <h2 className="text-4xl font-bold text-cyan-400 mt-2">
          97%
        </h2>

        <div className="mt-4 h-2 rounded-full bg-slate-800 overflow-hidden">

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "97%" }}
            transition={{ duration: 1.5 }}
            className="h-full bg-cyan-400"
          />

        </div>

      </div>

      <div className="space-y-4">

        {insights.map(({ icon: Icon, title, description, color }) => (
          <motion.div
            whileHover={{
              scale:1.02,
              y:-3
            }}
            key={title}
            className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
          >
            <div className="flex gap-3">

              <Icon
                className={color}
                size={22}
              />

              <div>

                <h3 className="font-semibold text-white">
                  {title}
                </h3>

                <p className="text-sm text-slate-400 mt-1">
                  {description}
                </p>

              </div>

            </div>

          </motion.div>
        ))}

      </div>

      <motion.button
        whileHover={{
          scale: 1.03,
        }}
        whileTap={{
          scale: 0.97,
        }}
        className="mt-8 w-full rounded-2xl bg-cyan-500 py-4 text-white font-semibold flex items-center justify-center gap-2 hover:bg-cyan-400 transition"
      >
        Ask IdentityForge AI

        <ArrowRight size={18} />

      </motion.button>

    </motion.div>
  );
}