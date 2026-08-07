import {
  AlertTriangle,
  Clock3,
} from "lucide-react";

type GovernanceAction = {
  type: "overdue" | "pending";
  count: number;
  title: string;
  description: string;
};

type GovernanceActionsProps = {
  actions: GovernanceAction[];
};

export default function GovernanceActions({
  actions,
}: GovernanceActionsProps) {
  if (actions.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">

      <div className="mb-3">
        <p className="text-xs uppercase tracking-wide text-slate-400">
          Governance Actions
        </p>

        <p className="mt-1 text-sm text-slate-500">
          Items requiring governance attention
        </p>
      </div>

      <div className="space-y-3">

        {actions.map((action) => {
          const isOverdue = action.type === "overdue";

          return (
            <div
              key={action.type}
              className={`flex items-center gap-4 rounded-2xl border p-4 ${
                isOverdue
                  ? "border-red-500/20 bg-red-500/5"
                  : "border-amber-500/20 bg-amber-500/5"
              }`}
            >

              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  isOverdue
                    ? "bg-red-500/10"
                    : "bg-amber-500/10"
                }`}
              >
                {isOverdue ? (
                  <AlertTriangle
                    size={19}
                    className="text-red-400"
                  />
                ) : (
                  <Clock3
                    size={19}
                    className="text-amber-400"
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">

                <div className="flex items-center justify-between gap-4">

                  <p className="text-sm font-semibold text-white">
                    {action.title}
                  </p>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      isOverdue
                        ? "bg-red-500/10 text-red-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    {action.count}
                  </span>

                </div>

                <p className="mt-1 text-sm text-slate-400">
                  {action.description}
                </p>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}