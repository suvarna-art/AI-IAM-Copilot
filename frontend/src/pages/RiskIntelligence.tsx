import { useEffect, useState } from "react";

import {
  ShieldAlert,
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
} from "lucide-react";

import {
  getRiskIntelligence,
} from "../services/riskIntelligence";

import type {
  RiskIntelligenceData,
} from "../services/riskIntelligence";


export default function RiskIntelligence() {
  // =========================================================
  // STATE
  // =========================================================

  const [riskData, setRiskData] =
    useState<RiskIntelligenceData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // =========================================================
  // LOAD RISK INTELLIGENCE
  // =========================================================

  useEffect(() => {
    async function loadRiskIntelligence() {
      try {
        setLoading(true);
        setError("");

        const data = await getRiskIntelligence();

        console.log(
          "RISK INTELLIGENCE PAGE DATA:",
          data
        );

        setRiskData(data);

      } catch (err) {
        console.error(
          "Risk Intelligence API Error:",
          err
        );

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(
            "Unable to load Risk Intelligence data."
          );
        }

      } finally {
        setLoading(false);
      }
    }

    loadRiskIntelligence();
  }, []);


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-slate-400">
          Loading Risk Intelligence...
        </p>
      </div>
    );
  }


  // =========================================================
  // ERROR
  // =========================================================

  if (error || !riskData) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">

        <div className="flex items-center gap-3">

          <AlertTriangle
            size={20}
            className="text-red-400"
          />

          <div>

            <p className="font-medium text-red-400">
              Risk Intelligence unavailable
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {error || "No risk intelligence data available."}
            </p>

          </div>

        </div>

      </div>
    );
  }


  // =========================================================
  // RISK LEVEL STYLING
  // =========================================================

  const riskLevel =
    riskData.overallRisk.toLowerCase();

  const riskColor =
    riskLevel === "high"
      ? "text-red-400"
      : riskLevel === "medium"
        ? "text-amber-400"
        : "text-emerald-400";


  const riskBackground =
    riskLevel === "high"
      ? "border-red-500/20 bg-red-500/5"
      : riskLevel === "medium"
        ? "border-amber-500/20 bg-amber-500/5"
        : "border-emerald-500/20 bg-emerald-500/5";


  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="space-y-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section>

        <div className="flex items-start justify-between gap-6">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10">

              <ShieldAlert
                size={22}
                className="text-red-400"
              />

            </div>

            <div>

              <h1 className="text-2xl font-bold text-white">
                Risk Intelligence
              </h1>

              <p className="mt-1 text-sm text-slate-400">
                Enterprise identity risk intelligence and analysis
              </p>

            </div>

          </div>


          <div
            className={`hidden items-center gap-2 rounded-full border px-4 py-2 text-sm md:flex ${riskBackground} ${riskColor}`}
          >

            <AlertTriangle size={16} />

            {riskData.overallRisk} Risk

          </div>

        </div>

      </section>


      {/* =====================================================
          KPI CARDS
      ===================================================== */}

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

        {/* Overall Risk */}

        <div
          className={`rounded-2xl border p-5 ${riskBackground}`}
        >

          <div className="flex items-center justify-between">

            <p className="text-sm text-slate-400">
              Overall Risk
            </p>

            <ShieldAlert
              size={19}
              className={riskColor}
            />

          </div>

          <p
            className={`mt-3 text-3xl font-bold ${riskColor}`}
          >
            {riskData.overallRisk}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            Current enterprise risk posture
          </p>

        </div>


        {/* Risk Score */}

        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">

          <div className="flex items-center justify-between">

            <p className="text-sm text-slate-400">
              Risk Score
            </p>

            <AlertTriangle
              size={19}
              className="text-red-400"
            />

          </div>

          <p className="mt-3 text-3xl font-bold text-red-400">
            {riskData.riskScore}
          </p>

          <div className="mt-3 h-2 rounded-full bg-slate-800">

            <div
              className="h-2 rounded-full bg-red-400"
              style={{
                width: `${Math.min(
                  riskData.riskScore,
                  100
                )}%`,
              }}
            />

          </div>

          <p className="mt-2 text-xs text-slate-500">
            Risk severity score
          </p>

        </div>


        {/* Confidence */}

        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">

          <div className="flex items-center justify-between">

            <p className="text-sm text-slate-400">
              AI Confidence
            </p>

            <BrainCircuit
              size={19}
              className="text-cyan-400"
            />

          </div>

          <p className="mt-3 text-3xl font-bold text-cyan-400">
            {riskData.confidence}%
          </p>

          <div className="mt-3 h-2 rounded-full bg-slate-800">

            <div
              className="h-2 rounded-full bg-cyan-400"
              style={{
                width: `${Math.min(
                  riskData.confidence,
                  100
                )}%`,
              }}
            />

          </div>

          <p className="mt-2 text-xs text-slate-500">
            Model confidence in assessment
          </p>

        </div>

      </section>


      {/* =====================================================
          TOP FINDING
      ===================================================== */}

      <section>

        <div className="mb-4">

          <h2 className="text-lg font-semibold text-white">
            Top Finding
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Highest-priority identity security observation
          </p>

        </div>


        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">

          <div className="flex items-start gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10">

              <AlertTriangle
                size={21}
                className="text-red-400"
              />

            </div>

            <div>

              <p className="text-sm font-semibold uppercase tracking-wide text-red-400">
                Security Finding
              </p>

              <p className="mt-2 text-base font-medium text-white">
                {riskData.topFinding}
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          RECOMMENDATIONS
      ===================================================== */}

      <section>

        <div className="mb-4">

          <h2 className="text-lg font-semibold text-white">
            Recommended Actions
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Recommended actions based on the current risk assessment
          </p>

        </div>


        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

          {riskData.recommendations.map(
            (recommendation, index) => (

              <div
                key={`${recommendation}-${index}`}
                className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5"
              >

                <div className="flex items-start gap-3">

                  <CheckCircle2
                    size={19}
                    className="mt-0.5 shrink-0 text-cyan-400"
                  />

                  <div>

                    <p className="text-sm font-medium text-white">
                      {recommendation}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Recommended governance action
                    </p>

                  </div>

                </div>

              </div>

            )
          )}

        </div>

      </section>

    </div>
  );
}