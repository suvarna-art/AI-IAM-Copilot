import { motion } from "framer-motion";

export default function WelcomeBanner() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -25,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="rounded-3xl bg-gradient-to-r from-cyan-600 via-blue-700 to-indigo-700 p-8"
    >
      <h1 className="text-4xl font-bold text-white">
        Welcome back 👋
      </h1>

      <p className="mt-3 text-cyan-100 text-lg">
        IdentityForge AI is continuously monitoring your enterprise identities,
        detecting access risks, and providing intelligent recommendations.
      </p>

      <div className="mt-6 flex flex-wrap gap-6">

        <div>
          <p className="text-cyan-200 text-sm">
            Identities Protected
          </p>

          <h2 className="text-3xl font-bold text-white">
            12,486
          </h2>
        </div>

        <div>
          <p className="text-cyan-200 text-sm">
            AI Confidence
          </p>

          <h2 className="text-3xl font-bold text-white">
            97%
          </h2>
        </div>

        <div>
          <p className="text-cyan-200 text-sm">
            Active Threats
          </p>

          <h2 className="text-3xl font-bold text-white">
            0 Critical
          </h2>
        </div>

      </div>
    </motion.div>
  );
}