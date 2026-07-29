import { motion } from "framer-motion";
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
  { month: "Jan", identities: 8200 },
  { month: "Feb", identities: 8700 },
  { month: "Mar", identities: 9100 },
  { month: "Apr", identities: 9700 },
  { month: "May", identities: 10800 },
  { month: "Jun", identities: 12486 },
];

const stats = [
  {
    title: "Total Identities",
    value: "12,486",
    change: "+52%",
  },
  {
    title: "AI Risk Score",
    value: "94%",
    change: "Excellent",
  },
  {
    title: "Compliance",
    value: "98%",
    change: "Healthy",
  },
];

export default function IdentityAnalytics() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.6,
      }}
      className="rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">

        <div>

          <h2 className="text-2xl font-bold text-white">
            Identity Analytics
          </h2>

          <p className="text-slate-400 mt-1">
            Identity growth over the last six months
          </p>

        </div>

        <div className="rounded-xl bg-cyan-500/10 px-4 py-2 text-cyan-400 text-sm">
          Live Analytics
        </div>

      </div>

      <div className="grid xl:grid-cols-3 gap-6">

        {/* Chart */}

        <div className="xl:col-span-2 h-80">

          <ResponsiveContainer width="100%" height="100%">

            <LineChart data={data}>

              <CartesianGrid
                stroke="#1e293b"
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="month"
                stroke="#94a3b8"
              />

              <YAxis stroke="#94a3b8" />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="identities"
                stroke="#22d3ee"
                strokeWidth={4}
                dot={false}
                activeDot={{
                  r:8
                }}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

        {/* KPI Widgets */}

        <div className="space-y-4">

          {stats.map((item) => (

            <motion.div
              key={item.title}
              whileHover={{
                scale: 1.03,
              }}
              className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5"
            >

              <p className="text-slate-400 text-sm">
                {item.title}
              </p>

              <h2 className="text-3xl font-bold text-white mt-2">
                {item.value}
              </h2>

              <p className="mt-2 text-cyan-400 text-sm">
                {item.change}
              </p>

            </motion.div>

          ))}

        </div>

      </div>

    </motion.div>
  );
}