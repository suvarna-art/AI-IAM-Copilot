import { motion } from "framer-motion";

type SecurityGaugeProps = {
  score: number;
};

export default function SecurityGauge({
  score,
}: SecurityGaugeProps) {
  const radius = 80;
  const stroke = 12;

  const normalizedRadius = radius - stroke / 2;

  const circumference =
    normalizedRadius * 2 * Math.PI;

  const strokeDashoffset =
    circumference -
    (score / 100) * circumference;

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.85,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={{
        duration: 0.7,
      }}
      className="
        rounded-3xl
        border
        border-slate-800
        bg-slate-900/80
        backdrop-blur-xl
        p-8
      "
    >
      <h2 className="text-xl font-bold text-white">
        Enterprise Security Score
      </h2>

      <p className="mt-1 text-slate-400">
        Overall IAM Security Health
      </p>

      <div className="mt-8 flex justify-center">

        <svg
          height={180}
          width={180}
        >
          <circle
            stroke="#1e293b"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx="90"
            cy="90"
          />

          <motion.circle
            stroke="#22d3ee"
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            animate={{
              strokeDashoffset,
            }}
            transition={{
              duration: 1.5,
            }}
            r={normalizedRadius}
            cx="90"
            cy="90"
            transform="rotate(-90 90 90)"
          />

          <text
            x="90"
            y="92"
            textAnchor="middle"
            className="fill-white text-3xl font-bold"
          >
            {score}%
          </text>
        </svg>

      </div>

      <div className="mt-4 text-center">

        <h3 className="text-green-400 text-xl font-semibold">
          Enterprise Secure
        </h3>

        <p className="mt-2 text-slate-400">
          AI risk analysis indicates a strong
          identity security posture.
        </p>

      </div>
    </motion.div>
  );
}