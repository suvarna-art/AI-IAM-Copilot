import {
  motion,
} from "framer-motion";

import {
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";

import type {
  LucideIcon,
} from "lucide-react";

import useCountUp from "../hooks/useCountUp";


type StatCardProps = {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon: LucideIcon;
};


export default function StatCard({
  title,
  value,
  change,
  positive,
  icon: Icon,
}: StatCardProps) {
  const numericValue =
    Number(
      value.replace(
        /[^0-9]/g,
        ""
      )
    );

  const animatedValue =
    useCountUp(
      Number.isNaN(
        numericValue
      )
        ? 0
        : numericValue
    );


  const displayValue =
    Number.isNaN(
      numericValue
    )
      ? value
      : value.includes(
          "%"
        )
      ? `${animatedValue}%`
      : animatedValue.toLocaleString();


  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 16,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.38,
        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      }}
      whileHover={{
        y: -2,
      }}
      className="if-surface if-surface-interactive relative overflow-hidden p-5 sm:p-6"
    >

      {/* SUBTLE SIGNAL EDGE */}
      <div
        className={[
          "pointer-events-none absolute inset-x-0 top-0 h-px",
          positive
            ? "bg-gradient-to-r from-transparent via-teal-300/28 to-transparent"
            : "bg-gradient-to-r from-transparent via-rose-300/28 to-transparent",
        ].join(
          " "
        )}
      />


      {/* AMBIENT CONTEXT */}
      <div
        className={[
          "pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full blur-3xl",
          positive
            ? "bg-[rgba(72,215,198,0.035)]"
            : "bg-[rgba(239,114,130,0.035)]",
        ].join(
          " "
        )}
      />


      <div className="relative">

        <div className="flex items-start justify-between gap-4">

          <div className="min-w-0">

            <p className="text-lg font-black text-red-500">
               {title}
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-[-0.035em] text-[var(--if-text-primary)] sm:text-[2rem]">
              {displayValue}
            </h2>

          </div>


          <motion.div
            whileHover={{
              rotate: 4,
            }}
            transition={{
              duration: 0.2,
            }}
            className={[
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
              positive
                ? "border-teal-300/12 bg-teal-300/[0.045] text-teal-200"
                : "border-rose-300/12 bg-rose-300/[0.045] text-[var(--if-deny)]",
            ].join(
              " "
            )}
          >
            <Icon
              size={19}
            />
          </motion.div>

        </div>


        <div className="mt-5 flex items-center justify-between gap-3 border-t border-[var(--if-border-soft)] pt-4">

          {change ===
          "Live" ? (

            <div className="flex items-center gap-2">

              <span className="relative flex h-2.5 w-2.5 items-center justify-center">

                <span className="absolute h-full w-full rounded-full bg-emerald-300/20" />

                <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-300" />

              </span>


              <span className="text-xs font-medium text-emerald-200/80">
                Live signal
              </span>

            </div>

          ) : (

            <div className="flex items-center gap-2">

              {positive ? (
                <ArrowUpRight
                  size={15}
                  className="text-[var(--if-allow)]"
                />
              ) : (
                <ArrowDownRight
                  size={15}
                  className="text-[var(--if-deny)]"
                />
              )}


              <span
                className={[
                  "text-xs font-semibold",
                  positive
                    ? "text-[var(--if-allow)]"
                    : "text-[var(--if-deny)]",
                ].join(
                  " "
                )}
              >
                {change}
              </span>

            </div>
          )}


          <span className="text-[10px] uppercase tracking-[0.1em] text-[var(--if-text-faint)]">
            Identity signal
          </span>

        </div>

      </div>

    </motion.article>
  );
}