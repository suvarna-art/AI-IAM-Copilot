import {
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";


type RiskIntelligenceProps = {
  overallRisk: string;
  riskScore: number;
  confidence: number;
  topFinding: string;
  recommendations: string[];
};


export default function RiskIntelligence({
  overallRisk,
  riskScore,
  confidence,
  topFinding,
  recommendations,
}: RiskIntelligenceProps) {
  const normalizedRisk =
    Math.min(
      Math.max(
        riskScore,
        0
      ),
      100
    );

  const normalizedConfidence =
    Math.min(
      Math.max(
        confidence,
        0
      ),
      100
    );


  const riskTone =
    normalizedRisk >= 70
      ? "high"
      : normalizedRisk >= 40
      ? "medium"
      : "low";


  const riskLabelClass =
    riskTone === "high"
      ? "text-[var(--if-deny)]"
      : riskTone === "medium"
      ? "text-[var(--if-step-up)]"
      : "text-[var(--if-allow)]";


  const riskBorderClass =
    riskTone === "high"
      ? "border-[rgba(239,114,130,0.18)] bg-[rgba(239,114,130,0.045)]"
      : riskTone === "medium"
      ? "border-[rgba(230,179,92,0.18)] bg-[rgba(230,179,92,0.045)]"
      : "border-[rgba(85,214,162,0.18)] bg-[rgba(85,214,162,0.045)]";


  const riskDotClass =
    riskTone === "high"
      ? "bg-[var(--if-deny)]"
      : riskTone === "medium"
      ? "bg-[var(--if-step-up)]"
      : "bg-[var(--if-allow)]";


  const riskBarClass =
    riskTone === "high"
      ? "bg-[var(--if-deny)]"
      : riskTone === "medium"
      ? "bg-[var(--if-step-up)]"
      : "bg-[var(--if-allow)]";


  return (
    <section className="if-surface-elevated relative overflow-hidden p-6 sm:p-8">

      {/* RISK EDGE */}
      <div
        className={[
          "pointer-events-none absolute inset-x-0 top-0 h-px",
          riskTone === "high"
            ? "bg-gradient-to-r from-transparent via-rose-300/30 to-transparent"
            : riskTone === "medium"
            ? "bg-gradient-to-r from-transparent via-amber-300/30 to-transparent"
            : "bg-gradient-to-r from-transparent via-emerald-300/25 to-transparent",
        ].join(" ")}
      />


      {/* AMBIENT SIGNAL */}
      <div
        className={[
          "pointer-events-none absolute right-[-90px] top-[-90px] h-64 w-64 rounded-full blur-[90px]",
          riskTone === "high"
            ? "bg-[rgba(239,114,130,0.035)]"
            : riskTone === "medium"
            ? "bg-[rgba(230,179,92,0.035)]"
            : "bg-[rgba(85,214,162,0.03)]",
        ].join(" ")}
      />


      <div className="relative z-10">

        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

          <div className="flex items-start gap-3">

            <div
              className={[
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
                riskBorderClass,
                riskLabelClass,
              ].join(" ")}
            >
              <ShieldAlert
                size={18}
              />
            </div>


            <div>

              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--if-text-faint)]">
                Identity Risk Intelligence
              </p>

              <h2 className="if-heading mt-1 text-lg font-bold sm:text-xl">
                Risk Intelligence
              </h2>

              <p className="mt-2 text-sm leading-6 text-[var(--if-text-muted)]">
                Correlated identity risk, model confidence and recommended governance actions.
              </p>

            </div>

          </div>


          <div
            className={[
              "inline-flex items-center gap-2 self-start rounded-xl border px-3 py-2",
              riskBorderClass,
            ].join(" ")}
          >

            <span
              className={[
                "h-2 w-2 rounded-full",
                riskDotClass,
              ].join(" ")}
            />

            <span
              className={[
                "text-xs font-semibold uppercase tracking-[0.08em]",
                riskLabelClass,
              ].join(" ")}
            >
              {overallRisk}
            </span>

          </div>

        </div>


        {/* PRIMARY METRICS */}
        <div className="mt-7 grid gap-4 md:grid-cols-2">

          <div className="rounded-2xl border border-[var(--if-border-soft)] bg-black/10 p-5">

            <div className="flex items-center justify-between gap-4">

              <div>

                <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--if-text-faint)]">
                  Risk Score
                </p>

                <p
                  className={[
                    "mt-2 text-3xl font-bold tracking-[-0.04em]",
                    riskLabelClass,
                  ].join(" ")}
                >
                  {riskScore}%
                </p>

              </div>


              <div
                className={[
                  "flex h-10 w-10 items-center justify-center rounded-xl border",
                  riskBorderClass,
                  riskLabelClass,
                ].join(" ")}
              >
                <AlertTriangle
                  size={17}
                />
              </div>

            </div>


            <div className="mt-5">

              <div className="mb-2 flex items-center justify-between">

                <span className="text-[9px] uppercase tracking-[0.12em] text-[var(--if-text-faint)]">
                  Exposure Range
                </span>

                <span className="text-[10px] text-[var(--if-text-muted)]">
                  0–100
                </span>

              </div>


              <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.04]">

                <div
                  className={[
                    "h-full rounded-full transition-all duration-700",
                    riskBarClass,
                  ].join(" ")}
                  style={{
                    width:
                      `${normalizedRisk}%`,
                  }}
                />

              </div>

            </div>

          </div>


          <div className="rounded-2xl border border-[var(--if-border-soft)] bg-black/10 p-5">

            <div className="flex items-center justify-between gap-4">

              <div>

                <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--if-text-faint)]">
                  AI Confidence
                </p>

                <p className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[var(--if-violet-soft)]">
                  {confidence}%
                </p>

              </div>


              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-300/12 bg-violet-300/[0.035] text-violet-200">

                <BrainCircuit
                  size={17}
                />

              </div>

            </div>


            <div className="mt-5">

              <div className="mb-2 flex items-center justify-between">

                <span className="text-[9px] uppercase tracking-[0.12em] text-[var(--if-text-faint)]">
                  Model Confidence
                </span>

                <span className="text-[10px] text-[var(--if-text-muted)]">
                  0–100
                </span>

              </div>


              <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.04]">

                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-300/75 to-teal-300/65 transition-all duration-700"
                  style={{
                    width:
                      `${normalizedConfidence}%`,
                  }}
                />

              </div>

            </div>

          </div>

        </div>


        {/* TOP FINDING */}
        <div
          className={[
            "mt-6 rounded-2xl border p-5",
            riskBorderClass,
          ].join(" ")}
        >

          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--if-text-faint)]">
            Top Finding
          </p>


          <div className="mt-3 flex items-start gap-3">

            <AlertTriangle
              size={18}
              className={[
                "mt-0.5 shrink-0",
                riskLabelClass,
              ].join(" ")}
            />


            <p className="text-sm font-semibold leading-6 text-[var(--if-text-primary)]">
              {topFinding}
            </p>

          </div>

        </div>


        {/* RECOMMENDATIONS */}
        <div className="mt-6">

          <div className="flex items-center justify-between gap-3">

            <div>

              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--if-text-faint)]">
                Recommended Actions
              </p>

              <p className="mt-1 text-sm font-semibold text-[var(--if-text-primary)]">
                Governance response
              </p>

            </div>


            <span className="if-badge if-badge-intelligence">
              {recommendations.length} actions
            </span>

          </div>


          <div className="mt-4 overflow-hidden rounded-2xl border border-[var(--if-border-soft)] bg-black/10">

            {recommendations.map(
              (
                item,
                index
              ) => (
                <div
                  key={item}
                  className={[
                    "flex items-start gap-3 px-4 py-4 transition hover:bg-white/[0.02]",
                    index !== recommendations.length - 1
                      ? "border-b border-[var(--if-border-soft)]"
                      : "",
                  ].join(" ")}
                >

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-teal-300/10 bg-teal-300/[0.03] text-teal-200">

                    <CheckCircle2
                      size={15}
                    />

                  </div>


                  <div className="min-w-0">

                    <p className="text-sm font-medium leading-6 text-[var(--if-text-primary)]">
                      {item}
                    </p>

                    <p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-[var(--if-text-faint)]">
                      Governance recommendation
                    </p>

                  </div>

                </div>
              )
            )}

          </div>

        </div>


        {/* CONTEXT FOOTER */}
        <div className="mt-5 rounded-xl border border-[var(--if-border-soft)] bg-black/10 p-4">

          <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[var(--if-text-faint)]">
            Decision Context
          </p>

          <p className="mt-2 text-xs leading-5 text-[var(--if-text-muted)]">
            Risk signals inform governance review and authorization decisions but do not independently grant or revoke access.
          </p>

        </div>

      </div>

    </section>
  );
}