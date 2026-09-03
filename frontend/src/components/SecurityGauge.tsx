import {
  motion,
} from "framer-motion";

import {
  ShieldCheck,
} from "lucide-react";


type SecurityGaugeProps = {
  score: number;
};


export default function SecurityGauge({
  score,
}: SecurityGaugeProps) {
  const radius = 82;
  const stroke = 10;

  const normalizedRadius =
    radius - stroke / 2;

  const circumference =
    normalizedRadius *
    2 *
    Math.PI;

  const strokeDashoffset =
    circumference -
    (score / 100) *
      circumference;


  const posture =
    score >= 85
      ? {
          label:
            "Trusted Posture",

          summary:
            "Identity controls are operating within the expected enterprise trust range.",

          tone:
            "allow",
        }
      : score >= 70
      ? {
          label:
            "Attention Required",

          summary:
            "Identity controls remain functional, but selected governance signals require review.",

          tone:
            "step-up",
        }
      : {
          label:
            "Elevated Exposure",

          summary:
            "Identity posture indicates material governance or access risk requiring investigation.",

          tone:
            "deny",
        };


  const ringColor =
    posture.tone ===
    "allow"
      ? "var(--if-allow)"
      : posture.tone ===
        "step-up"
      ? "var(--if-step-up)"
      : "var(--if-deny)";


  const postureTextClass =
    posture.tone ===
    "allow"
      ? "text-[var(--if-allow)]"
      : posture.tone ===
        "step-up"
      ? "text-[var(--if-step-up)]"
      : "text-[var(--if-deny)]";


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

      {/* SIGNAL EDGE */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-300/28 to-violet-300/18" />


      {/* AMBIENT FABRIC */}
      <div className="pointer-events-none absolute right-[-80px] top-[-80px] h-56 w-56 rounded-full bg-[rgba(72,215,198,0.035)] blur-[80px]" />

      <div className="pointer-events-none absolute bottom-[-100px] left-[20%] h-56 w-56 rounded-full bg-[rgba(143,131,255,0.025)] blur-[90px]" />


      <div className="relative z-10">

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

          <div>

            <p className="if-eyebrow">
              Identity Security Posture
            </p>

            <h2 className="if-heading mt-2 text-xl font-bold sm:text-2xl">
              Enterprise Security Score
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--if-text-muted)]">
              Composite IAM posture derived from identity,
              access, governance and risk signals.
            </p>

          </div>


          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-teal-300/15 bg-teal-300/[0.045] text-teal-200">

            <ShieldCheck
              size={20}
            />

          </div>

        </div>


        <div className="mt-8 grid items-center gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">

          {/* GAUGE */}
          <div className="flex justify-center">

            <div className="relative">

              <svg
                height={200}
                width={200}
                viewBox="0 0 200 200"
              >

                <circle
                  stroke="rgba(255,255,255,0.045)"
                  fill="transparent"
                  strokeWidth={stroke}
                  r={normalizedRadius}
                  cx="100"
                  cy="100"
                />


                <circle
                  stroke="rgba(72,215,198,0.05)"
                  fill="transparent"
                  strokeWidth="1"
                  r="68"
                  cx="100"
                  cy="100"
                />


                <motion.circle
                  stroke={ringColor}
                  fill="transparent"
                  strokeWidth={stroke}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference}
                  animate={{
                    strokeDashoffset,
                  }}
                  transition={{
                    duration: 1.25,
                    ease: [
                      0.22,
                      1,
                      0.36,
                      1,
                    ],
                  }}
                  r={normalizedRadius}
                  cx="100"
                  cy="100"
                  transform="rotate(-90 100 100)"
                />

              </svg>


              <div className="absolute inset-0 flex flex-col items-center justify-center">

                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--if-text-faint)]">
                  Trust Score
                </span>

                <span className="mt-1 text-4xl font-bold tracking-[-0.04em] text-[var(--if-text-primary)]">
                  {score}
                </span>

                <span className="mt-1 text-xs text-[var(--if-text-muted)]">
                  out of 100
                </span>

              </div>

            </div>

          </div>


          {/* POSTURE CONTEXT */}
          <div className="min-w-0">

            <div className="flex items-center gap-2">

              <span
                className={[
                  "h-2 w-2 rounded-full",
                  posture.tone ===
                  "allow"
                    ? "bg-[var(--if-allow)]"
                    : posture.tone ===
                      "step-up"
                    ? "bg-[var(--if-step-up)]"
                    : "bg-[var(--if-deny)]",
                ].join(
                  " "
                )}
              />

              <p
                className={[
                  "text-sm font-semibold",
                  postureTextClass,
                ].join(
                  " "
                )}
              >
                {posture.label}
              </p>

            </div>


            <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--if-text-secondary)]">
              {posture.summary}
            </p>


            <div className="mt-6 grid gap-3 sm:grid-cols-3">

              <PostureSignal
                label="Identity"
                value="Healthy"
              />

              <PostureSignal
                label="Governance"
                value="Active"
              />

              <PostureSignal
                label="Risk"
                value={
                  score >= 85
                    ? "Controlled"
                    : score >= 70
                    ? "Watch"
                    : "Elevated"
                }
              />

            </div>


            <div className="mt-6 rounded-xl border border-[var(--if-border-soft)] bg-black/10 p-4">

              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--if-text-faint)]">
                Decision Context
              </p>

              <p className="mt-2 text-sm leading-6 text-[var(--if-text-muted)]">
                The score is presented as a governance signal,
                not as a standalone authorization decision.
              </p>

            </div>

          </div>

        </div>

      </div>

    </motion.section>
  );
}


function PostureSignal({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--if-border-soft)] bg-black/10 p-4">

      <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--if-text-faint)]">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold text-[var(--if-text-primary)]">
        {value}
      </p>

    </div>
  );
}