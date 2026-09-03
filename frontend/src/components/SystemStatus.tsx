import {
  motion,
} from "framer-motion";

import {
  BrainCircuit,
  Clock3,
  PlugZap,
  ShieldCheck,
} from "lucide-react";


const systems = [
  "Azure AD",
  "SailPoint",
  "Okta",
  "ServiceNow",
];


export default function SystemStatus() {
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

      {/* CONNECTIVITY EDGE */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-300/28 to-violet-300/18" />


      {/* AMBIENT CONNECTIVITY */}
      <div className="pointer-events-none absolute right-[-70px] top-[-80px] h-48 w-48 rounded-full bg-[rgba(72,215,198,0.035)] blur-[75px]" />


      <div className="relative z-10">

        {/* HEADER */}
        <div className="flex items-start justify-between gap-4">

          <div className="flex min-w-0 items-center gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-teal-300/15 bg-teal-300/[0.045] text-teal-200">

              <PlugZap
                size={18}
              />

            </div>


            <div className="min-w-0">

              <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--if-teal-soft)]">
                Integration Health
              </p>

              <h2 className="if-heading mt-1 truncate text-lg font-bold">
                Platform Status
              </h2>

            </div>

          </div>


          <div className="flex items-center gap-2 rounded-lg border border-emerald-300/10 bg-emerald-300/[0.035] px-2.5 py-1.5">

            <span className="relative flex h-2 w-2 items-center justify-center">

              <span className="absolute h-full w-full rounded-full bg-emerald-300/20" />

              <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-300" />

            </span>

            <span className="text-[10px] font-medium text-emerald-200/80">
              Operational
            </span>

          </div>

        </div>


        {/* SYSTEM CONNECTIONS */}
        <div className="mt-6">

          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--if-text-faint)]">
            Connected Identity Systems
          </p>


          <div className="mt-3 space-y-2">

            {systems.map(
              (system) => (
                <div
                  key={system}
                  className="flex items-center justify-between rounded-xl border border-[var(--if-border-soft)] bg-black/10 px-3 py-3"
                >

                  <div className="flex min-w-0 items-center gap-3">

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-teal-300/10 bg-teal-300/[0.03] text-teal-200">

                      <ShieldCheck
                        size={15}
                      />

                    </div>


                    <span className="truncate text-sm font-medium text-[var(--if-text-primary)]">
                      {system}
                    </span>

                  </div>


                  <div className="flex items-center gap-2">

                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />

                    <span className="text-[10px] font-medium text-emerald-200/75">
                      Connected
                    </span>

                  </div>

                </div>
              )
            )}

          </div>

        </div>


        {/* RUNTIME STATUS */}
        <div className="mt-6 border-t border-[var(--if-border-soft)] pt-5">

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">

            <StatusRow
              icon={
                <BrainCircuit
                  size={15}
                />
              }
              label="AI Engine"
              value="Online"
              tone="intelligence"
            />

            <StatusRow
              icon={
                <Clock3
                  size={15}
                />
              }
              label="Last Sync"
              value="Just now"
              tone="neutral"
            />

          </div>

        </div>


        {/* TRUST NOTE */}
        <div className="mt-5 rounded-xl border border-[var(--if-border-soft)] bg-black/10 p-4">

          <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[var(--if-text-faint)]">
            Fabric State
          </p>

          <p className="mt-2 text-xs leading-5 text-[var(--if-text-muted)]">
            Core identity services are reporting within the expected operating range.
          </p>

        </div>

      </div>

    </motion.section>
  );
}


function StatusRow({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone:
    | "intelligence"
    | "neutral";
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[var(--if-border-soft)] bg-black/10 px-3 py-3">

      <div className="flex items-center gap-2">

        <span
          className={[
            "flex h-7 w-7 items-center justify-center rounded-lg",
            tone ===
            "intelligence"
              ? "bg-violet-300/[0.04] text-violet-200"
              : "bg-white/[0.025] text-[var(--if-text-muted)]",
          ].join(
            " "
          )}
        >
          {icon}
        </span>


        <span className="text-xs font-medium text-[var(--if-text-secondary)]">
          {label}
        </span>

      </div>


      <span
        className={[
          "text-xs font-semibold",
          tone ===
          "intelligence"
            ? "text-violet-200"
            : "text-[var(--if-text-muted)]",
        ].join(
          " "
        )}
      >
        {value}
      </span>

    </div>
  );
}