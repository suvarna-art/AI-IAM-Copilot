import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Shield,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import {
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../auth/AuthContext";


export default function Login() {
  const navigate =
    useNavigate();


  const {
    login,
    enterAdminSession,
    enterDemoMode,
    pendingDecision,
  } = useAuth();


  const [
    username,
    setUsername,
  ] = useState(
    "iamadmin"
  );


  const [
    password,
    setPassword,
  ] = useState("");


  const [
    showPassword,
    setShowPassword,
  ] = useState(false);


  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null
    );


  async function handleSubmit(
    event: FormEvent
  ) {
    event.preventDefault();

    setError(null);


    if (
      !username.trim() ||
      !password
    ) {
      setError(
        "Enter your administrator credentials."
      );

      return;
    }


    setLoading(true);


    try {
      await login(
        username.trim(),
        password
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to authenticate."
      );
    } finally {
      setLoading(false);
    }
  }


  function continueAdmin() {
    enterAdminSession();

    navigate("/");
  }


  function exploreDemo() {
    enterDemoMode();

    navigate("/");
  }


  if (pendingDecision) {
    return (
      <div className="min-h-screen bg-[#050b16] px-4 py-8 text-white sm:px-6">

        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl items-center justify-center">

          <div className="w-full rounded-3xl border border-cyan-500/20 bg-slate-950/80 p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl sm:p-8">

            <div className="flex items-center gap-3">

              <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-400">
                <ShieldCheck size={28} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
                  Explainable Authorization
                </p>

                <h1 className="mt-1 text-2xl font-bold">
                  Access Decision
                </h1>
              </div>

            </div>


            <div className="mt-7 grid gap-3 sm:grid-cols-2">

              <DecisionMetric
                label="Decision"
                value={
                  pendingDecision.decision
                }
              />

              <DecisionMetric
                label="Access Scope"
                value={
                  pendingDecision.access_scope
                }
              />

              <DecisionMetric
                label="Enterprise Role"
                value={
                  pendingDecision.role
                }
              />

              <DecisionMetric
                label="Department"
                value={
                  pendingDecision.department
                }
              />

              <DecisionMetric
                label="Session Risk"
                value={
                  `${pendingDecision.risk_level} · ${pendingDecision.risk_score}/100`
                }
              />

              <DecisionMetric
                label="Privileged Identity"
                value={
                  pendingDecision.privileged
                    ? "Yes"
                    : "No"
                }
              />

            </div>


            <div className="mt-6 space-y-3">

              {pendingDecision.checks.map(
                (
                  check,
                  index
                ) => (
                  <div
                    key={`${check.name}-${index}`}
                    className="flex gap-3 rounded-xl border border-slate-800 bg-slate-900/70 p-4"
                  >

                    <CheckCircle2
                      size={18}
                      className={
                        check.status ===
                        "PASS"
                          ? "mt-0.5 shrink-0 text-emerald-400"
                          : check.status ===
                            "WARN"
                          ? "mt-0.5 shrink-0 text-amber-400"
                          : "mt-0.5 shrink-0 text-red-400"
                      }
                    />

                    <div>

                      <p className="text-sm font-semibold text-slate-100">
                        {check.name}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-400">
                        {check.explanation}
                      </p>

                    </div>

                  </div>
                )
              )}

            </div>


            <div className="mt-6 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">

              <p className="text-xs uppercase tracking-wide text-cyan-400">
                Decision rationale
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                {pendingDecision.reason}
              </p>

            </div>


            <button
              type="button"
              onClick={
                continueAdmin
              }
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-400"
            >
              Enter IdentityForge AI

              <ArrowRight
                size={17}
              />
            </button>

          </div>

        </div>

      </div>
    );
  }


  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050b16] text-white">

      {/* Background */}
      <div className="pointer-events-none absolute inset-0">

        <div className="absolute left-[-10%] top-[-20%] h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />

        <div className="absolute bottom-[-20%] right-[-10%] h-[550px] w-[550px] rounded-full bg-blue-600/10 blur-[130px]" />

      </div>


      <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-5 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">

        {/* LEFT SIDE */}
        <section>

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
              <Shield size={32} />
            </div>

            <div>

              <h1 className="text-xl font-bold">
                IdentityForge AI
              </h1>

              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Enterprise Identity Security
              </p>

            </div>

          </div>


          <div className="mt-10 max-w-xl">

            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-3 py-1.5 text-xs font-medium text-cyan-400">

              <Sparkles size={14} />

              Explainable Identity Access

            </div>


            <h2 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl">

              Secure access begins
              with an identity decision.

            </h2>


            <p className="mt-5 max-w-lg text-sm leading-7 text-slate-400 sm:text-base">

              IdentityForge evaluates authentication,
              enterprise role, segregation of duties,
              contextual risk and authorization scope
              before privileged administrative access is granted.

            </p>

          </div>

        </section>


        {/* LOGIN CARD */}
        <section className="w-full">

          <div className="mx-auto max-w-md rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
                Administrative Access
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Sign in securely
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Authentication does not automatically grant application access.
                IdentityForge evaluates enterprise authorization policy before
                issuing an administrative session.
              </p>

            </div>


            <form
              onSubmit={
                handleSubmit
              }
              className="mt-7 space-y-4"
            >

              <label className="block">

                <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500">
                  Administrator identity
                </span>

                <input
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(event) =>
                    setUsername(
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-cyan-500/60"
                  placeholder="iamadmin"
                />

              </label>


              <label className="block">

                <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500">
                  Password
                </span>


                <div className="relative">

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) =>
                      setPassword(
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 pr-12 text-sm outline-none transition placeholder:text-slate-600 focus:border-cyan-500/60"
                    placeholder="Enter administrator password"
                  />


                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (value) =>
                          !value
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-200"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword
                      ? (
                        <EyeOff
                          size={18}
                        />
                      )
                      : (
                        <Eye
                          size={18}
                        />
                      )}
                  </button>

                </div>

              </label>


              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}


              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading
                  ? "Evaluating access..."
                  : (
                    <>
                      <LockKeyhole
                        size={17}
                      />

                      Authenticate & Evaluate
                    </>
                  )}

              </button>

            </form>


            <div className="my-6 flex items-center gap-3">

              <div className="h-px flex-1 bg-slate-800" />

              <span className="text-[11px] uppercase tracking-widest text-slate-600">
                Recruiter Demo
              </span>

              <div className="h-px flex-1 bg-slate-800" />

            </div>


            <button
              type="button"
              onClick={
                exploreDemo
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-5 py-3.5 text-sm font-semibold text-slate-200 transition hover:border-cyan-500/30 hover:bg-slate-800"
            >
              Explore Read-Only Demo
            </button>


            <p className="mt-3 text-center text-xs leading-5 text-slate-600">
              Demo access uses synthetic enterprise IAM data
              and cannot perform governance modifications.
            </p>


            {/* Federation roadmap */}
            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/40 p-4">

              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                Federation-ready architecture
              </p>

              <div className="mt-3 flex flex-wrap gap-2">

                {[
                  "Microsoft Entra ID",
                  "Okta",
                  "Ping Identity",
                  "FIDO2 / Passkeys",
                ].map(
                  (item) => (
                    <span
                      key={item}
                      className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-[11px] text-slate-500"
                    >
                      {item} · Planned
                    </span>
                  )
                )}

              </div>

            </div>

          </div>

        </section>

      </div>


      {/* ACCESS ASSISTANT PLACEHOLDER */}
      <button
        type="button"
        title="IdentityForge Access Assistant — coming next"
        className="fixed bottom-5 right-5 flex h-13 items-center gap-2 rounded-full border border-cyan-500/20 bg-slate-950 px-4 py-3 text-sm font-medium text-cyan-400 shadow-xl shadow-black/30 transition hover:border-cyan-500/40"
      >
        <Bot size={19} />

        <span className="hidden sm:inline">
          Access Assistant
        </span>
      </button>

    </div>
  );
}


function DecisionMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">

      <p className="text-[11px] uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold text-slate-100">
        {value.replaceAll(
          "_",
          " "
        )}
      </p>

    </div>
  );
}