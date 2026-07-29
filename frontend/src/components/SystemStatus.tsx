import { motion } from "framer-motion";
import {
  Wifi,
  ShieldCheck,
  BrainCircuit,
  Clock3,
} from "lucide-react";

const systems = [
  "Azure AD",
  "SailPoint",
  "Okta",
  "ServiceNow",
];

export default function SystemStatus() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 25,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-6"
    >
      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-xl font-bold text-white">
            Platform Status
          </h2>

          <p className="text-slate-400">
            Enterprise Infrastructure
          </p>

        </div>

        <div className="flex items-center gap-2 text-green-400">

          <motion.div
            animate={{
              scale: [1, 1.3, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
            }}
            className="w-3 h-3 rounded-full bg-green-400"
          />

          LIVE

        </div>

      </div>

      <div className="mt-6 space-y-4">

        {systems.map((system) => (

          <div
            key={system}
            className="flex items-center justify-between"
          >

            <div className="flex items-center gap-3">

              <ShieldCheck
                size={18}
                className="text-cyan-400"
              />

              <span className="text-white">
                {system}
              </span>

            </div>

            <span className="text-green-400 text-sm">
              Connected
            </span>

          </div>

        ))}

      </div>

      <div className="mt-6 border-t border-slate-800 pt-5">

        <div className="flex justify-between">

          <div className="flex gap-2 items-center">

            <BrainCircuit
              size={18}
              className="text-cyan-400"
            />

            <span className="text-slate-300">
              AI Engine
            </span>

          </div>

          <span className="text-green-400">
            Online
          </span>

        </div>

        <div className="flex justify-between mt-4">

          <div className="flex gap-2 items-center">

            <Clock3
              size={18}
              className="text-cyan-400"
            />

            <span className="text-slate-300">
              Last Sync
            </span>

          </div>

          <span className="text-slate-400">
            Just now
          </span>

        </div>

      </div>
    </motion.div>
  );
}