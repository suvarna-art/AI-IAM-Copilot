import {
  motion,
} from "framer-motion";

import {
  useNavigate,
} from "react-router-dom";

import {
  ArrowRight,
  Bot,
  BrainCircuit,
  ShieldAlert,
  Sparkles,
} from "lucide-react";


const insights = [
  {
    icon: ShieldAlert,
    title:
      "Dormant Privileged Account",
    description:
      "Admin account inactive for 91 days.",
    tone:
      "critical",
  },
  {
    icon: Sparkles,
    title:
      "Role Optimization",
    description:
      "AI recommends merging 4 duplicate roles.",
    tone:
      "intelligence",
  },
  {
    icon: BrainCircuit,
    title:
      "Risk Prediction",
    description:
      "Predicted insider risk increased by 12%.",
    tone:
      "warning",
  },
] as const;


export default function AIInsights() {
  const navigate =
    useNavigate();


  return (
    <motion.section
      initial={{
        opacity: 0,
        x: 18,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      transition={{
        duration: 0.42,
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
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/35 to-teal-300/20" />


      {/* AMBIENT INTELLIGENCE */}
      <div className="pointer-events-none absolute right-[-70px] top-[-80px] h-48 w-48 rounded-full bg-[rgba(143,131,255,0.05)] blur-[75px]" />


      <div className="relative z-10">

        {/* HEADER */}
        <div className="flex items-start justify-between gap-4">

          <div className="flex min-w-0 items-center gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-300/[0.05] text-violet-200">

              <Bot
                size={20}
              />

            </div>


            <div className="min-w-0">

              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--if-violet-soft)]">
                Decision Intelligence
              </p>

              <h2 className="if-heading mt-1 truncate text-lg font-bold">
                IdentityForge AI
              </h2>

            </div>

          </div>


          <div className="flex items-center gap-2 rounded-lg border border-emerald-300/10 bg-emerald-300/[0.035] px-2.5 py-1.5">

            <span className="relative flex h-2 w-2 items-center justify-center">

              <span className="absolute h-full w-full rounded-full bg-emerald-300/20" />

              <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-300" />

            </span>

            <span className="text-[10px] font-medium text-emerald-200/80">
              Active
            </span>

          </div>

        </div>


        {/* CONFIDENCE */}
        <div className="mt-6 rounded-2xl border border-[var(--if-border-soft)] bg-black/10 p-4">

          <div className="flex items-end justify-between gap-4">

            <div>

              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--if-text-faint)]">
                AI Confidence
              </p>

              <p className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[var(--if-text-primary)]">
                97%
              </p>

            </div>


            <span className="if-badge if-badge-intelligence">
              High confidence
            </span>

          </div>


          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.04]">

            <motion.div
              initial={{
                width: 0,
              }}
              animate={{
                width: "97%",
              }}
              transition={{
                duration: 1.1,
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


          <p className="mt-3 text-xs leading-5 text-[var(--if-text-muted)]">
            Confidence reflects the current model assessment for surfaced identity signals.
          </p>

        </div>


        {/* SIGNAL FEED */}
        <div className="mt-6">

          <div className="mb-3 flex items-center justify-between">

            <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--if-text-faint)]">
              Priority Signals
            </p>

            <BrainCircuit
              size={15}
              className="text-violet-300/60"
            />

          </div>


          <div className="space-y-2">

            {insights.map(
              ({
                icon: Icon,
                title,
                description,
                tone,
              }) => {

                const toneClasses =
                  tone ===
                  "critical"
                    ? "border-[rgba(239,114,130,0.12)] bg-[rgba(239,114,130,0.025)]"
                    : tone ===
                      "warning"
                    ? "border-[rgba(230,179,92,0.12)] bg-[rgba(230,179,92,0.025)]"
                    : "border-violet-300/10 bg-violet-300/[0.025]";


                const iconClasses =
                  tone ===
                  "critical"
                    ? "text-[var(--if-deny)]"
                    : tone ===
                      "warning"
                    ? "text-[var(--if-step-up)]"
                    : "text-[var(--if-violet-soft)]";


                return (
                  <motion.div
                    key={
                      title
                    }
                    whileHover={{
                      x: 2,
                    }}
                    transition={{
                      duration: 0.18,
                    }}
                    className={`rounded-xl border p-4 transition ${toneClasses}`}
                  >

                    <div className="flex gap-3">

                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.035] bg-black/10">

                        <Icon
                          size={16}
                          className={
                            iconClasses
                          }
                        />

                      </div>


                      <div className="min-w-0">

                        <h3 className="text-sm font-semibold text-[var(--if-text-primary)]">
                          {title}
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-[var(--if-text-muted)]">
                          {description}
                        </p>

                      </div>

                    </div>

                  </motion.div>
                );
              }
            )}

          </div>

        </div>


        {/* CTA */}
        <motion.button
          type="button"
          whileTap={{
            scale: 0.99,
          }}
          onClick={() =>
            navigate(
              "/copilot"
            )
          }
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-violet-300/15 bg-violet-300/[0.05] px-4 py-3 text-sm font-semibold text-violet-100 transition hover:border-violet-300/25 hover:bg-violet-300/[0.08]"
        >

          Ask IdentityForge AI

          <ArrowRight
            size={16}
          />

        </motion.button>

      </div>

    </motion.section>
  );
}