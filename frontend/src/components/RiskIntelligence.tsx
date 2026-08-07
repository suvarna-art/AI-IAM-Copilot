import { CheckCircle2, AlertTriangle, ShieldAlert } from "lucide-react";
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
 return (
  <div className="rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-6">

    {/* Header */}
    <div className="flex items-center mb-5 gap-2">

  <ShieldAlert
    size={20}
    className="text-cyan-400"
/>

  <h2 className="text-xl font-bold text-white">
    Risk Intelligence
  </h2>
</div>
   {/* Overall Risk */}
  <div className="mb-5">

    <p className="text-xs uppercase tracking-wide text-slate-400">
    Overall Risk
    </p>

    <div className="mt-2 inline-flex items-center rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5">

    <span className="mr-2 h-2.5 w-2.5 rounded-full bg-red-500" />

    <span className="text-base font-semibold text-red-400">
      {overallRisk}
    </span>

  </div>

</div>

    <div className="grid grid-cols-2 gap-4 mb-6">

  <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">

    <p className="text-xs uppercase tracking-wide text-slate-400">
      Risk Score
    </p>

    <h3 className="mt-2 text-3xl font-bold text-white">
      {riskScore}%
    </h3>

    <div className="mt-3 h-2 w-full rounded-full bg-slate-800">

      <div
        className="h-2 rounded-full bg-red-500"
        style={{ width: `${riskScore}%` }}
      />

    </div>

  </div>

  <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">

    <p className="text-xs uppercase tracking-wide text-slate-400">
      AI Confidence
    </p>

    <h3 className="mt-2 text-3xl font-bold text-cyan-400">
      {confidence}%
    </h3>

    <div className="mt-3 h-2 w-full rounded-full bg-slate-800">

      <div
        className="h-2 rounded-full bg-cyan-400"
        style={{ width: `${confidence}%` }}
      />

    </div>

  </div>

    </div>

    <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-5">

  <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">
    Top Finding
  </p>

    <div className="flex items-center gap-2 text-lg font-semibold text-white">

  <AlertTriangle
    size={20}
    className="text-red-400"
  />

  <span>{topFinding}</span>

</div>

    </div>

    <div className="space-y-3">

  <p className="text-xs uppercase tracking-wide text-slate-400">
    Recommendations
  </p>

  {recommendations.map((item) => (

    <div
      key={item}
      className="flex items-center rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 hover:border-cyan-400/40
hover:bg-slate-900
hover:translate-x-1
transition-all
duration-300 transition-all"
    >

    <CheckCircle2
        size={18}
        className="mr-3 text-cyan-400 flex-shrink-0"
    />

      <span className="text-white">
        {item}
      </span>

    </div>

    ))}

    </div>

  </div>
);
}