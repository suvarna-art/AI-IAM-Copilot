import { useEffect, useState } from "react";

import { getIdentities } from "../services/identity";
import type { Identity } from "../types/identity";

export default function Identities() {
  // =========================================================
  // IDENTITY DATA
  // =========================================================

  const [identities, setIdentities] = useState<Identity[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // =========================================================
  // SEARCH
  // =========================================================

  const [search, setSearch] = useState("");

  // =========================================================
  // LOAD IDENTITIES FROM BACKEND
  // =========================================================

  useEffect(() => {
    async function loadIdentities() {
      try {
        setLoading(true);
        setError("");

        const data = await getIdentities();

        console.log(
          "IDENTITIES FROM BACKEND:",
          data
        );

        setIdentities(data);
      } catch (err) {
        console.error(
          "Identity API Error:",
          err
        );

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(
            "Unable to load identities."
          );
        }
      } finally {
        setLoading(false);
      }
    }

    loadIdentities();
  }, []);

  // =========================================================
  // KPI / IDENTITY INTELLIGENCE
  // =========================================================

  const totalIdentities = identities.length;

  const activeIdentities = identities.filter(
    (identity) =>
      identity.status.toLowerCase() === "active"
  ).length;

  const privilegedIdentities = identities.filter(
    (identity) =>
      identity.privileged
  ).length;

  const highRiskIdentities = identities.filter(
    (identity) =>
      identity.risk_level.toLowerCase() === "high"
  ).length;

  // =========================================================
  // SEARCH / FILTERED IDENTITIES
  // =========================================================

  const filteredIdentities = identities.filter(
    (identity) => {
      const query = search
        .toLowerCase()
        .trim();

      // If search box is empty,
      // show all identities.
      if (!query) {
        return true;
      }

      return (
        identity.display_name
          .toLowerCase()
          .includes(query) ||

        identity.username
          .toLowerCase()
          .includes(query) ||

        identity.email
          .toLowerCase()
          .includes(query) ||

        identity.department
          .toLowerCase()
          .includes(query)
      );
    }
  );

  // =========================================================
  // LOADING STATE
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-slate-400">
          Loading identities...
        </p>
      </div>
    );
  }

  // =========================================================
  // ERROR STATE
  // =========================================================

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
        <p className="text-sm text-red-400">
          {error}
        </p>
      </div>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <section className="space-y-6">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div>
        <h1 className="text-2xl font-bold text-white">
          Identities
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Enterprise identity inventory and security intelligence
        </p>
      </div>


      {/* =====================================================
          KPI CARDS
      ===================================================== */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        {/* Total Identities */}

        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">

          <p className="text-sm text-slate-400">
            Total Identities
          </p>

          <p className="mt-2 text-3xl font-bold text-white">
            {totalIdentities}
          </p>

        </div>


        {/* Active Identities */}

        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">

          <p className="text-sm text-slate-400">
            Active Identities
          </p>

          <p className="mt-2 text-3xl font-bold text-emerald-400">
            {activeIdentities}
          </p>

        </div>


        {/* Privileged Identities */}

        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">

          <p className="text-sm text-slate-400">
            Privileged Identities
          </p>

          <p className="mt-2 text-3xl font-bold text-amber-400">
            {privilegedIdentities}
          </p>

        </div>


        {/* High Risk Identities */}

        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">

          <p className="text-sm text-slate-400">
            High Risk Identities
          </p>

          <p className="mt-2 text-3xl font-bold text-red-400">
            {highRiskIdentities}
          </p>

        </div>

      </div>


      {/* =====================================================
          SEARCH
      ===================================================== */}

      <div>

        <input
          type="text"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search by name, username, email or department..."
          className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-500/40"
        />

      </div>


      {/* =====================================================
          SEARCH RESULT SUMMARY
      ===================================================== */}

      <div className="text-sm text-slate-500">

        Showing{" "}
        <span className="text-slate-300">
          {filteredIdentities.length}
        </span>{" "}
        of{" "}
        <span className="text-slate-300">
          {identities.length}
        </span>{" "}
        identities

      </div>


      {/* =====================================================
    ENTERPRISE IDENTITY TABLE
===================================================== */}

<div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/50">

  {/* Table Header */}

  <div className="hidden grid-cols-6 gap-4 border-b border-slate-800 bg-slate-950/80 px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 lg:grid">

    <span>Identity</span>

    <span>Department</span>

    <span>Status</span>

    <span>Privileged</span>

    <span>Risk</span>

    <span>Access Count</span>

  </div>


  {/* Identity Rows */}

  <div className="divide-y divide-slate-800">

    {filteredIdentities.map(
      (identity) => {

        const excessiveAccess =
          identity.access_count > 15;

        return (
          <div
            key={identity.id}
            className="grid gap-4 px-5 py-5 transition hover:bg-slate-900/40 lg:grid-cols-6 lg:items-center"
          >

            {/* Identity */}

            <div>

              <p className="font-semibold text-white">
                {identity.display_name}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {identity.username}
              </p>

              <p className="mt-1 text-xs text-slate-600">
                {identity.email}
              </p>

            </div>


            {/* Department */}

            <div className="text-sm text-slate-300">
              {identity.department}
            </div>


            {/* Status */}

            <div>

              <span
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
                  identity.status.toLowerCase() === "active"
                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                    : "border-slate-700 bg-slate-800/50 text-slate-400"
                }`}
              >
                {identity.status}
              </span>

            </div>


            {/* Privileged */}

            <div>

              {identity.privileged ? (

                <span className="inline-flex rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400">
                  Privileged
                </span>

              ) : (

                <span className="text-sm text-slate-500">
                  No
                </span>

              )}

            </div>


            {/* Risk */}

            <div>

              <span
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
                  identity.risk_level.toLowerCase() === "high"
                    ? "border-red-500/20 bg-red-500/10 text-red-400"
                    : identity.risk_level.toLowerCase() === "medium"
                      ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
                      : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                }`}
              >
                {identity.risk_level}
              </span>

            </div>


            {/* Access Count */}

            <div>

              <div className="flex items-center gap-2">

                <span
                  className={`text-sm font-semibold ${
                    excessiveAccess
                      ? "text-red-400"
                      : "text-slate-300"
                  }`}
                >
                  {identity.access_count}
                </span>

                {excessiveAccess && (

                  <span className="text-xs text-red-400">
                    Excessive
                  </span>

                )}

              </div>

            </div>

          </div>
        );
      }
    )}

  </div>

</div>


      {/* =====================================================
          EMPTY SEARCH RESULT
      ===================================================== */}

      {filteredIdentities.length === 0 && (

        <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-8 text-center">

          <p className="text-sm text-slate-500">
            No identities match your search.
          </p>

        </div>

      )}

    </section>
  );
}