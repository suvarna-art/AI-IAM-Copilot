import { motion } from "framer-motion";

export default function StatusBadge() {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2">

      <motion.div
        animate={{
          scale: [1, 1.4, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.2,
        }}
        className="h-3 w-3 rounded-full bg-green-400"
      />

      <span className="text-green-400 font-medium">
        System Healthy
      </span>

    </div>
  );
}