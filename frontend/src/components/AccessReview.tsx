import { ClipboardCheck } from "lucide-react";
type AccessReviewProps = {
  completedReviews: number;
  pendingReviews: number;
  overdueReviews: number;
  completionRate: number;
  nextCampaign: string;
};

export default function AccessReview({
  completedReviews,
//   pendingReviews,
//   overdueReviews,
//   completionRate,
//   nextCampaign,
}: AccessReviewProps) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-6">

      <div className="flex items-center justify-between mb-6">

    <div>

        <div className="flex items-center gap-2">

      <ClipboardCheck
        size={20}
        className="text-cyan-400"
      />

      <h2 className="text-xl font-bold text-white">
        Access Review
      </h2>

        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">

  <p className="text-xs uppercase tracking-wide text-slate-400">
    Completed
  </p>

  <h3 className="mt-2 text-3xl font-bold text-green-400">
    {completedReviews}
  </h3>

  <div className="mt-3 h-2 rounded-full bg-slate-800">

    <div
      className="h-2 rounded-full bg-green-400"
      style={{ width: "100%" }}
    />

  </div>

</div>
        <p className="mt-1 text-sm text-slate-400">
            Identity Governance Summary
        </p>

    </div>

  <span className="rounded-full bg-cyan-500/10 px-4 py-2 text-sm text-cyan-400 border border-cyan-500/20">
    Governance
  </span>

        </div>

    </div>
  );
}