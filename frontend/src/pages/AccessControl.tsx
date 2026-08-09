import { useEffect, useMemo, useState } from "react";

import {
  Search,
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

import {
  getAccessControls,
  getPrivilegedAccessControls,
  getHighRiskAccessControls,
  getExcessiveAccessControls,
} from "../services/accessControl";

import type { AccessControl as AccessControlRecord } from "../types/accessControl";


type AccessFilter =
  | "all"
  | "privileged"
  | "high-risk"
  | "excessive";


export default function AccessControl() {

  // =========================================================
  // STATE
  // =========================================================

  const [records, setRecords] = useState<
    AccessControlRecord[]
  >([]);

  const [search, setSearch] = useState("");

  const [activeFilter, setActiveFilter] =
    useState<AccessFilter>("all");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // =========================================================
  // LOAD DATA
  // =========================================================

  useEffect(() => {
    loadAccessControls("all");
  }, []);


  async function loadAccessControls(
    filter: AccessFilter
  ) {
    try {

      setLoading(true);
      setError("");

      let data: AccessControlRecord[];

      if (filter === "privileged") {

        data =
          await getPrivilegedAccessControls();

      } else if (filter === "high-risk") {

        data =
          await getHighRiskAccessControls();

      } else if (filter === "excessive") {

        data =
          await getExcessiveAccessControls();

      } else {

        data =
          await getAccessControls();

      }

      console.log(
        `ACCESS CONTROL [${filter}]:`,
        data
      );

      setRecords(data);
      setActiveFilter(filter);

    } catch (err) {

      console.error(
        "Access Control API Error:",
        err
      );

      if (err instanceof Error) {

        setError(err.message);

      } else {

        setError(
          "Unable to load access control data."
        );

      }

    } finally {

      setLoading(false);

    }
  }


  // =========================================================
  // KPI DATA
  // =========================================================

  const totalAccess = useMemo(
    () =>
      records.reduce(
        (total, record) =>
          total + record.access_count,
        0
      ),
    [records]
  );


  const privilegedAccess = useMemo(
    () =>
      records.filter(
        (record) => record.privileged
      ).length,
    [records]
  );


  const highRiskAccess = useMemo(
    () =>
      records.filter(
        (record) =>
          record.risk_level.toLowerCase() ===
          "high"
      ).length,
    [records]
  );


  const excessiveAccess = useMemo(
    () =>
      records.filter(
        (record) =>
          record.access_status.toLowerCase() ===
          "excessive"
      ).length,
    [records]
  );


  // =========================================================
  // SEARCH
  // =========================================================

  const filteredRecords = useMemo(() => {

    const query =
      search.toLowerCase().trim();

    if (!query) {
      return records;
    }

    return records.filter((record) =>
      [
        record.display_name,
        record.username,
        record.department,
        record.risk_level,
        record.access_status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );

  }, [records, search]);


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (
      <div className="flex min-h-[400px] items-center justify-center">

        <div className="text-sm text-slate-400">

          Loading access control intelligence...

        </div>

      </div>
    );

  }


  // =========================================================
  // ERROR
  // =========================================================

  if (error) {

    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">

        <div className="flex items-center gap-3">

          <ShieldAlert
            size={20}
            className="text-red-400"
          />

          <div>

            <p className="font-medium text-red-400">
              Access Control unavailable
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {error}
            </p>

          </div>

        </div>

      </div>
    );

  }


  // =========================================================
  // PAGE
  // =========================================================

  return (

    <div className="space-y-8">


      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <section>

        <div>

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">

              <ShieldCheck
                size={21}
                className="text-cyan-400"
              />

            </div>

            <div>

              <h1 className="text-2xl font-bold text-white">
                Access Control
              </h1>

              <p className="mt-1 text-sm text-slate-400">
                Enterprise access governance and
                privilege intelligence
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          KPI CARDS
      ===================================================== */}

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">


        {/* TOTAL */}

        <button
          type="button"
          onClick={() =>
            loadAccessControls("all")
          }
          className={`rounded-2xl border p-5 text-left transition ${
            activeFilter === "all"
              ? "border-cyan-500/30 bg-cyan-500/5"
              : "border-slate-800 bg-slate-950/50 hover:border-slate-700"
          }`}
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-400">
                Total Access Grants
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {totalAccess}
              </p>

            </div>

            <div className="rounded-xl bg-cyan-500/10 p-3">

              <KeyRound
                size={20}
                className="text-cyan-400"
              />

            </div>

          </div>

        </button>


        {/* PRIVILEGED */}

        <button
          type="button"
          onClick={() =>
            loadAccessControls("privileged")
          }
          className={`rounded-2xl border p-5 text-left transition ${
            activeFilter === "privileged"
              ? "border-amber-500/30 bg-amber-500/5"
              : "border-slate-800 bg-slate-950/50 hover:border-slate-700"
          }`}
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-400">
                Privileged Access
              </p>

              <p className="mt-2 text-3xl font-bold text-amber-400">
                {privilegedAccess}
              </p>

            </div>

            <div className="rounded-xl bg-amber-500/10 p-3">

              <ShieldCheck
                size={20}
                className="text-amber-400"
              />

            </div>

          </div>

        </button>


        {/* HIGH RISK */}

        <button
          type="button"
          onClick={() =>
            loadAccessControls("high-risk")
          }
          className={`rounded-2xl border p-5 text-left transition ${
            activeFilter === "high-risk"
              ? "border-red-500/30 bg-red-500/5"
              : "border-slate-800 bg-slate-950/50 hover:border-slate-700"
          }`}
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-400">
                High Risk Access
              </p>

              <p className="mt-2 text-3xl font-bold text-red-400">
                {highRiskAccess}
              </p>

            </div>

            <div className="rounded-xl bg-red-500/10 p-3">

              <ShieldAlert
                size={20}
                className="text-red-400"
              />

            </div>

          </div>

        </button>


        {/* EXCESSIVE */}

        <button
          type="button"
          onClick={() =>
            loadAccessControls("excessive")
          }
          className={`rounded-2xl border p-5 text-left transition ${
            activeFilter === "excessive"
              ? "border-orange-500/30 bg-orange-500/5"
              : "border-slate-800 bg-slate-950/50 hover:border-slate-700"
          }`}
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-400">
                Excessive Access
              </p>

              <p className="mt-2 text-3xl font-bold text-orange-400">
                {excessiveAccess}
              </p>

            </div>

            <div className="rounded-xl bg-orange-500/10 p-3">

              <AlertTriangle
                size={20}
                className="text-orange-400"
              />

            </div>

          </div>

        </button>

      </section>


      {/* =====================================================
          FILTER / SEARCH BAR
      ===================================================== */}

      <section className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950/40 p-4 lg:flex-row">

        <div className="relative flex-1">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search identities, departments, risk or access status..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900/60 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-500/40"
          />

        </div>


        <button
          type="button"
          onClick={() => {
            setSearch("");
            loadAccessControls("all");
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-800 px-4 py-3 text-sm text-slate-400 transition hover:border-slate-700 hover:text-white"
        >

          <RotateCcw size={16} />

          Reset

        </button>

      </section>


      {/* =====================================================
          ACTIVE FILTER
      ===================================================== */}

      {activeFilter !== "all" && (

        <div className="flex items-center gap-2 text-sm text-slate-400">

          Showing:

          <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-cyan-400">

            {activeFilter === "privileged"
              ? "Privileged Access"
              : activeFilter === "high-risk"
                ? "High Risk Access"
                : "Excessive Access"}

          </span>

        </div>

      )}


      {/* =====================================================
          RESULT SUMMARY
      ===================================================== */}

      <div className="text-sm text-slate-500">

        Showing{" "}

        <span className="text-slate-300">
          {filteredRecords.length}
        </span>

        {" "}of{" "}

        <span className="text-slate-300">
          {records.length}
        </span>

        {" "}access records

      </div>


      {/* =====================================================
          TABLE
      ===================================================== */}

      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/40">


        {/* HEADER */}

        <div className="hidden grid-cols-6 gap-4 border-b border-slate-800 bg-slate-900/50 px-5 py-4 text-xs font-medium uppercase tracking-wider text-slate-500 lg:grid">

          <span>Identity</span>

          <span>Department</span>

          <span>Access</span>

          <span>Privilege</span>

          <span>Risk</span>

          <span>Status</span>

        </div>


        {/* ROWS */}

        {filteredRecords.map((record) => (

          <div
            key={record.identity_id}
            className="grid gap-4 border-b border-slate-800/70 px-5 py-5 transition hover:bg-slate-900/40 lg:grid-cols-6 lg:items-center"
          >

            {/* Identity */}

            <div>

              <p className="font-semibold text-white">
                {record.display_name}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {record.username}
              </p>

            </div>


            {/* Department */}

            <div className="text-sm text-slate-300">
              {record.department}
            </div>


            {/* Access */}

            <div>

              <p className="text-sm font-semibold text-white">
                {record.access_count}
              </p>

              <p className="mt-1 text-xs text-slate-600">
                access grants
              </p>

            </div>


            {/* Privilege */}

            <div>

              {record.privileged ? (

                <span className="inline-flex rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400">
                  Privileged
                </span>

              ) : (

                <span className="text-sm text-slate-500">
                  Standard
                </span>

              )}

            </div>


            {/* Risk */}

            <div>

              <span
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
                  record.risk_level.toLowerCase() ===
                  "high"
                    ? "border-red-500/20 bg-red-500/10 text-red-400"
                    : record.risk_level.toLowerCase() ===
                      "medium"
                      ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
                      : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                }`}
              >

                {record.risk_level}

              </span>

            </div>


            {/* STATUS */}

            <div>

              <span
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
                  record.access_status.toLowerCase() ===
                  "excessive"
                    ? "border-red-500/20 bg-red-500/10 text-red-400"
                    : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                }`}
              >

                {record.access_status}

              </span>

            </div>

          </div>

        ))}


        {/* EMPTY */}

        {filteredRecords.length === 0 && (

          <div className="p-10 text-center">

            <p className="text-sm text-slate-500">
              No access records match your search.
            </p>

          </div>

        )}

      </section>

    </div>
  );
}