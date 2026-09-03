import {
  motion,
} from "framer-motion";

import {
  Activity,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";


const data = [
  {
    month: "Jan",
    identities: 8200,
  },
  {
    month: "Feb",
    identities: 8700,
  },
  {
    month: "Mar",
    identities: 9100,
  },
  {
    month: "Apr",
    identities: 9700,
  },
  {
    month: "May",
    identities: 10800,
  },
  {
    month: "Jun",
    identities: 12486,
  },
];


const stats = [
  {
    title:
      "Total Identities",
    value:
      "12,486",
    change:
      "+52%",
    description:
      "Six-month population growth",
    icon:
      Users,
    tone:
      "identity",
  },
  {
    title:
      "AI Risk Score",
    value:
      "94%",
    change:
      "Excellent",
    description:
      "Current identity risk assessment",
    icon:
      Sparkles,
    tone:
      "intelligence",
  },
  {
    title:
      "Compliance",
    value:
      "98%",
    change:
      "Healthy",
    description:
      "Governance controls within target",
    icon:
      ShieldCheck,
    tone:
      "allow",
  },
] as const;


export default function IdentityAnalytics() {
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

      {/* TOP SIGNAL EDGE */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-300/30 to-violet-300/20" />


      {/* AMBIENT IDENTITY FABRIC */}
      <div className="pointer-events-none absolute right-[-90px] top-[-90px] h-64 w-64 rounded-full bg-[rgba(72,215,198,0.035)] blur-[90px]" />

      <div className="pointer-events-none absolute bottom-[-100px] left-[15%] h-56 w-56 rounded-full bg-[rgba(143,131,255,0.025)] blur-[90px]" />


      <div className="relative z-10">

        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

          <div>

            <div className="flex items-center gap-2">

              <Activity
                size={15}
                className="text-teal-200"
              />

              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--if-teal-soft)]">
                Identity Population Intelligence
              </p>

            </div>


            <h2 className="if-heading mt-2 text-xl font-bold sm:text-2xl">
              Identity Analytics
            </h2>


            <p className="mt-2 text-sm leading-6 text-[var(--if-text-muted)]">
              Identity population growth and governance health over the last six months.
            </p>

          </div>


          <div className="flex items-center gap-2 rounded-xl border border-teal-300/12 bg-teal-300/[0.035] px-3 py-2">

            <span className="relative flex h-2 w-2 items-center justify-center">

              <span className="absolute h-full w-full rounded-full bg-teal-300/20" />

              <span className="relative h-1.5 w-1.5 rounded-full bg-teal-300" />

            </span>

            <span className="text-[10px] font-medium text-teal-100/80">
              Live Analytics
            </span>

          </div>

        </div>


        <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(230px,1fr)]">

          {/* CHART */}
          <div className="min-w-0 rounded-2xl border border-[var(--if-border-soft)] bg-black/10 p-4 sm:p-5">

            <div className="mb-4 flex items-center justify-between gap-3">

              <div>

                <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--if-text-faint)]">
                  Identity Growth
                </p>

                <p className="mt-1 text-sm font-semibold text-[var(--if-text-primary)]">
                  Six-month population trend
                </p>

              </div>


              <span className="if-badge">
                +52% Growth
              </span>

            </div>


            <div className="h-80">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <LineChart
                  data={data}
                  margin={{
                    top: 10,
                    right: 10,
                    bottom: 0,
                    left: -10,
                  }}
                >

                  <CartesianGrid
                    stroke="rgba(255,255,255,0.045)"
                    strokeDasharray="3 5"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill:
                        "var(--if-text-muted)",
                      fontSize:
                        11,
                    }}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    width={58}
                    tick={{
                      fill:
                        "var(--if-text-muted)",
                      fontSize:
                        11,
                    }}
                  />

                  <Tooltip
                    contentStyle={{
                      background:
                        "rgba(8,12,19,0.96)",
                      border:
                        "1px solid rgba(255,255,255,0.08)",
                      borderRadius:
                        "12px",
                      boxShadow:
                        "0 14px 40px rgba(0,0,0,0.28)",
                      color:
                        "#f3f6fb",
                    }}
                    labelStyle={{
                      color:
                        "#a9b4c3",
                      marginBottom:
                        "6px",
                    }}
                    cursor={{
                      stroke:
                        "rgba(143,131,255,0.16)",
                      strokeWidth:
                        1,
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="identities"
                    stroke="var(--if-teal)"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{
                      r: 5,
                      fill:
                        "var(--if-teal-soft)",
                      stroke:
                        "rgba(72,215,198,0.25)",
                      strokeWidth:
                        6,
                    }}
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>

          </div>


          {/* KPI CONTEXT */}
          <div className="space-y-3">

            {stats.map(
              ({
                title,
                value,
                change,
                description,
                icon: Icon,
                tone,
              }) => {

                const toneClasses =
                  tone ===
                  "identity"
                    ? "border-teal-300/12 bg-teal-300/[0.025] text-teal-200"
                    : tone ===
                      "intelligence"
                    ? "border-violet-300/12 bg-violet-300/[0.025] text-violet-200"
                    : "border-emerald-300/12 bg-emerald-300/[0.025] text-emerald-200";


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
                    className="rounded-2xl border border-[var(--if-border-soft)] bg-black/10 p-4"
                  >

                    <div className="flex items-start justify-between gap-3">

                      <div className="min-w-0">

                        <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[var(--if-text-faint)]">
                          {title}
                        </p>

                        <p className="mt-2 text-2xl font-bold tracking-[-0.035em] text-[var(--if-text-primary)]">
                          {value}
                        </p>

                      </div>


                      <div
                        className={[
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border",
                          toneClasses,
                        ].join(
                          " "
                        )}
                      >
                        <Icon
                          size={16}
                        />
                      </div>

                    </div>


                    <div className="mt-4 border-t border-[var(--if-border-soft)] pt-3">

                      <p
                        className={[
                          "text-xs font-semibold",
                          tone ===
                          "identity"
                            ? "text-teal-200"
                            : tone ===
                              "intelligence"
                            ? "text-violet-200"
                            : "text-emerald-200",
                        ].join(
                          " "
                        )}
                      >
                        {change}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[var(--if-text-muted)]">
                        {description}
                      </p>

                    </div>

                  </motion.div>
                );
              }
            )}

          </div>

        </div>

      </div>

    </motion.section>
  );
}