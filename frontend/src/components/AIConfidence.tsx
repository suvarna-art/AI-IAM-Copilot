import {
  motion,
} from "framer-motion";

import {
  BrainCircuit,
  TrendingUp,
} from "lucide-react";


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
  const normalizedScore =
    Math.min(
      Math.max(
        score,
        0
      ),
      100
    );


  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 16,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      }}
      className="if-surface-elevated relative overflow-hidden p-5 sm:p-6"
    >

      {/* INTELLIGENCE EDGE */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/30 to-teal-300/18" />


      {/* AMBIENT GLOW */}
      <div className="pointer-events-none absolute right-[-60px] top-[-70px] h-44 w-44 rounded-full bg-[rgba(143,131,255,0.045)] blur-[70px]" />


      <div className="relative z-10">

        <div className="flex items-start justify-between gap-4">

          {/* LEFT */}
          <div className="min-w-0">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-300/[0.05] text-violet-200">

                <BrainCircuit
                  size={18}
                />

              </div>


              <div>

                <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--if-violet-soft)]">
                  Model Confidence
                </p>

                <h2 className="if-heading mt-1 text-lg font-bold">
                  AI Confidence
                </h2>

              </div>

            </div>


            <p className="mt-4 text-sm leading-6 text-[var(--if-text-muted)]">
              {prediction}
            </p>

          </div>


          {/* SCORE */}
          <div className="shrink-0 text-right">

            <p className="text-3xl font-bold tracking-[-0.04em] text-[var(--if-text-primary)] sm:text-4xl">
              {score}%
            </p>


            <div className="mt-2 flex items-center justify-end gap-1.5 text-emerald-200/80">

              <TrendingUp
                size={14}
              />

              <span className="text-xs font-medium">
                {trend}
              </span>

            </div>

          </div>

        </div>


        {/* CONFIDENCE BAR */}
        <div className="mt-6">

          <div className="mb-2 flex items-center justify-between">

            <span className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[var(--if-text-faint)]">
              Confidence Range
            </span>

            <span className="text-[10px] text-[var(--if-text-muted)]">
              0–100
            </span>

          </div>


          <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.04]">

            <motion.div
              initial={{
                width: 0,
              }}
              animate={{
                width:
                  `${normalizedScore}%`,
              }}
              transition={{
                duration: 1,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
              className="h-full rounded-full bg-gradient-to-r from-violet-300/75 to-teal-300/70"
            />

          </div>

        </div>


        {/* CONTEXT */}
        <div className="mt-5 rounded-xl border border-[var(--if-border-soft)] bg-black/10 p-4">

          <div className="flex items-center justify-between gap-3">

            <div>

              <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[var(--if-text-faint)]">
                Assessment State
              </p>

              <p className="mt-1 text-sm font-semibold text-[var(--if-text-primary)]">
                {score >= 85
                  ? "High Confidence"
                  : score >= 65
                  ? "Moderate Confidence"
                  : "Low Confidence"}
              </p>

            </div>


            <span className="if-badge if-badge-intelligence">
              AI Signal
            </span>

          </div>

        </div>

      </div>

    </motion.section>
  );
}