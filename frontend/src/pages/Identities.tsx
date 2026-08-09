import { useEffect, useState } from "react";

import { getIdentities } from "../services/identity";
import type { Identity } from "../types/identity";

export default function Identities() {
  const [identities, setIdentities] = useState<Identity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [selectedIdentity, setSelectedIdentity] =
    useState<Identity | null>(null);

  useEffect(() => {
    async function loadIdentities() {
      try {
        setLoading(true);
        setError("");

        const data = await getIdentities();

        console.log("IDENTITIES FROM BACKEND:", data);

        setIdentities(data);
      } catch (err) {
        console.error("Identity API Error:", err);

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unable to load identities.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadIdentities();
  }, []);

  const totalIdentities = identities.length;

  const activeIdentities = identities.filter(
    (identity) =>
      identity.status.toLowerCase() === "active"
  ).length;

  const privilegedIdentities = identities.filter(
    (identity) => identity.privileged
  ).length;

  const highRiskIdentities = identities.filter(
    (identity) =>
      identity.risk_level.toLowerCase() === "high"
  ).length;

  const filteredIdentities = identities.filter(
    (identity) => {
      const query = search.toLowerCase().trim();

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
  // SECURITY INTELLIGENCE
  // =========================================================

  const getSecuritySignals = (identity: Identity) => {
    const signals: string[] = [];

    if (identity.risk_level.toLowerCase() === "high") {
      signals.push("High-risk identity");
    }

    if (identity.privileged) {
      signals.push("Privileged access enabled");
    }

    if (identity.access_count > 15) {
      signals.push("Excessive access detected");
    }

    if (identity.status.toLowerCase() === "inactive") {
      signals.push("Identity is inactive");
    }

    return signals;
  };

  const getSecurityAssessment = (identity: Identity) => {
    const highRisk =
      identity.risk_level.toLowerCase() === "high";

    const privileged = identity.privileged;

    const excessive =
      identity.access_count > 15;

    const inactive =
      identity.status.toLowerCase() === "inactive";

    if (highRisk && privileged && excessive) {
      return {
        label: "Critical",
        description:
          "This identity has multiple elevated security indicators and requires immediate review.",
        className:
          "border-red-500/30 bg-red-500/10 text-red-400",
      };
    }

    if (highRisk || (privileged && excessive)) {
      return {
        label: "High Attention",
        description:
          "This identity contains security indicators that should be reviewed.",
        className:
          "border-orange-500/30 bg-orange-500/10 text-orange-400",
      };
    }

    if (inactive) {
      return {
        label: "Review Required",
        description:
          "This identity is inactive and should be reviewed for unnecessary access.",
        className:
          "border-amber-500/30 bg-amber-500/10 text-amber-400",
      };
    }

    return {
      label: "Normal",
      description:
        "No elevated security indicators were detected from the available identity data.",
      className:
        "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    };
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-slate-400">
          Loading identities...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
        <p className="text-sm text-red-400">
          {error}
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-6">

      {/* =====================================================
          HEADER
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

        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
          <p className="text-sm text-slate-400">
            Total Identities
          </p>

          <p className="mt-2 text-3xl font-bold text-white">
            {totalIdentities}
          </p>
        </div>


        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
          <p className="text-sm text-slate-400">
            Active Identities
          </p>

          <p className="mt-2 text-3xl font-bold text-emerald-400">
            {activeIdentities}
          </p>
        </div>


        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
          <p className="text-sm text-slate-400">
            Privileged Identities
          </p>

          <p className="mt-2 text-3xl font-bold text-amber-400">
            {privilegedIdentities}
          </p>
        </div>


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
          IDENTITY TABLE
      ===================================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/50">

        <div className="hidden grid-cols-6 gap-4 border-b border-slate-800 bg-slate-950/80 px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 lg:grid">
          <span>Identity</span>
          <span>Department</span>
          <span>Status</span>
          <span>Privileged</span>
          <span>Risk</span>
          <span>Access Count</span>
        </div>


        <div className="divide-y divide-slate-800">

          {filteredIdentities.map((identity) => {

            const excessiveAccess =
              identity.access_count > 15;

            return (
              <div
                key={identity.id}
                onClick={() =>
                  setSelectedIdentity(identity)
                }
                className="grid cursor-pointer gap-4 px-5 py-5 transition hover:bg-slate-900/50 lg:grid-cols-6 lg:items-center"
              >

                {/* Identity */}

                <div>
                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-xs font-semibold text-cyan-400">
                      {identity.display_name
                        .split(" ")
                        .map((name) => name[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {identity.display_name}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        @{identity.username}
                      </p>
                    </div>

                  </div>
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


                {/* Access */}

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
                      <span className="rounded-md bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-400">
                        Excessive
                      </span>
                    )}

                  </div>

                  <div className="mt-2 h-1.5 w-full max-w-[90px] overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`h-full rounded-full ${
                        excessiveAccess
                          ? "bg-red-400"
                          : "bg-cyan-400"
                      }`}
                      style={{
                        width: `${Math.min(
                          (identity.access_count / 25) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

              </div>
            );
          })}

        </div>
      </div>


      {/* =====================================================
          EMPTY SEARCH
      ===================================================== */}

      {filteredIdentities.length === 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-8 text-center">
          <p className="text-sm text-slate-500">
            No identities match your search.
          </p>
        </div>
      )}


      {/* =====================================================
          IDENTITY INTELLIGENCE PANEL
      ===================================================== */}

      {selectedIdentity && (() => {

        const signals =
          getSecuritySignals(selectedIdentity);

        const assessment =
          getSecurityAssessment(selectedIdentity);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">

            <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl">

              {/* =================================================
                  HEADER
              ================================================= */}

              <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">

                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-cyan-400">
                    Identity Intelligence
                  </p>

                  <h2 className="mt-1 text-xl font-semibold text-white">
                    {selectedIdentity.display_name}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    @{selectedIdentity.username}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedIdentity(null)
                  }
                  className="rounded-lg border border-slate-800 px-3 py-2 text-sm text-slate-400 transition hover:bg-slate-900 hover:text-white"
                >
                  Close
                </button>

              </div>


              {/* =================================================
                  SECURITY ASSESSMENT
              ================================================= */}

              <div className="p-6">

                <div
                  className={`rounded-xl border p-5 ${assessment.className}`}
                >

                  <div className="flex items-start justify-between gap-4">

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider opacity-70">
                        Security Assessment
                      </p>

                      <p className="mt-1 text-xl font-semibold">
                        {assessment.label}
                      </p>

                      <p className="mt-2 text-sm opacity-80">
                        {assessment.description}
                      </p>
                    </div>

                  </div>

                </div>


                {/* =================================================
                    SECURITY SIGNALS
                ================================================= */}

                <div className="mt-6">

                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    Security Signals
                  </p>

                  {signals.length === 0 ? (

                    <div className="mt-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                      <p className="text-sm text-emerald-400">
                        No elevated security signals detected.
                      </p>
                    </div>

                  ) : (

                    <div className="mt-3 space-y-2">

                      {signals.map((signal) => (

                        <div
                          key={signal}
                          className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3"
                        >

                          <div className="h-2 w-2 rounded-full bg-red-400" />

                          <p className="text-sm text-slate-300">
                            {signal}
                          </p>

                        </div>

                      ))}

                    </div>

                  )}

                </div>


                {/* =================================================
                    IDENTITY INFORMATION
                ================================================= */}

                <div className="mt-6">

                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    Identity Information
                  </p>

                  <div className="mt-3 grid gap-4 sm:grid-cols-2">

                    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                      <p className="text-xs text-slate-500">
                        Identity ID
                      </p>

                      <p className="mt-1 text-sm font-medium text-white">
                        {selectedIdentity.id}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                      <p className="text-xs text-slate-500">
                        Department
                      </p>

                      <p className="mt-1 text-sm font-medium text-white">
                        {selectedIdentity.department}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                      <p className="text-xs text-slate-500">
                        Email
                      </p>

                      <p className="mt-1 break-all text-sm font-medium text-white">
                        {selectedIdentity.email}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                      <p className="text-xs text-slate-500">
                        Access Count
                      </p>

                      <p className="mt-1 text-xl font-semibold text-white">
                        {selectedIdentity.access_count}
                      </p>
                    </div>

                  </div>

                </div>


                {/* =================================================
                    SECURITY PROFILE
                ================================================= */}

                <div className="mt-6">

                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    Security Profile
                  </p>

                  <div className="mt-3 grid gap-3 sm:grid-cols-3">

                    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                      <p className="text-xs text-slate-500">
                        Status
                      </p>

                      <p className="mt-1 text-sm font-semibold text-white">
                        {selectedIdentity.status}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                      <p className="text-xs text-slate-500">
                        Privileged
                      </p>

                      <p
                        className={`mt-1 text-sm font-semibold ${
                          selectedIdentity.privileged
                            ? "text-amber-400"
                            : "text-slate-300"
                        }`}
                      >
                        {selectedIdentity.privileged
                          ? "Yes"
                          : "No"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                      <p className="text-xs text-slate-500">
                        Risk Level
                      </p>

                      <p
                        className={`mt-1 text-sm font-semibold ${
                          selectedIdentity.risk_level.toLowerCase() === "high"
                            ? "text-red-400"
                            : selectedIdentity.risk_level.toLowerCase() === "medium"
                              ? "text-amber-400"
                              : "text-emerald-400"
                        }`}
                      >
                        {selectedIdentity.risk_level}
                      </p>
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>
        );
      })()}

    </section>
  );
}