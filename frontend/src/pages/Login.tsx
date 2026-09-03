import {
  AlertTriangle,
  ArrowRight,
  Bot,
  CheckCircle2,
  Eye,
  EyeOff,
  Fingerprint,
  LockKeyhole,
  RotateCcw,
  Shield,
  ShieldCheck,
  ShieldX,
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
    clearPendingDecision,
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


  function returnToSignIn() {
    clearPendingDecision();
    setPassword("");
    setError(null);
  }


  if (
    pendingDecision?.decision ===
    "DENY"
  ) {
    return (
      <DecisionEnvironment
        state="deny"
      >
        <div className="if-enter mx-auto w-full max-w-4xl">
          <div className="if-surface-elevated if-state-deny relative overflow-hidden p-6 sm:p-8 lg:p-10">
            <DecisionAmbient tone="deny" />

            <div className="relative z-10">
              <DecisionHeader
                icon={<ShieldX size={29} />}
                tone="deny"
                eyebrow="Adaptive Access Control"
                title="Application Access Denied"
                description="Your credentials were verified, but the current session context exceeds the permitted risk threshold for privileged administrative access."
              />

              <DecisionStatusStrip
                decision="DENY"
                risk={`${pendingDecision.risk_level} · ${pendingDecision.risk_score}/100`}
              />

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <DecisionMetric
                  label="Enterprise Role"
                  value={pendingDecision.role}
                />

                <DecisionMetric
                  label="Access Scope"
                  value={pendingDecision.access_scope}
                />
              </div>

              <div className="mt-6 rounded-2xl border border-[rgba(239,114,130,0.2)] bg-[rgba(239,114,130,0.055)] p-5">
                <div className="flex gap-3">
                  <AlertTriangle
                    size={20}
                    className="mt-0.5 shrink-0 text-[var(--if-deny)]"
                  />

                  <div>
                    <p className="font-semibold text-[var(--if-deny)]">
                      Administrative session blocked
                    </p>

                    <p className="mt-2 text-sm leading-6 text-[var(--if-text-secondary)]">
                      IdentityForge did not issue an administrative JWT.
                      Authentication success does not override a high-risk
                      authorization decision.
                    </p>
                  </div>
                </div>
              </div>

              <DecisionChecks
                checks={pendingDecision.checks}
              />

              <div className="mt-6 rounded-xl border border-[rgba(239,114,130,0.16)] bg-[rgba(239,114,130,0.035)] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--if-deny)]">
                  Decision rationale
                </p>

                <p className="mt-2 text-sm leading-6 text-[var(--if-text-secondary)]">
                  {pendingDecision.reason}
                </p>
              </div>

              <ReturnButton
                onClick={returnToSignIn}
                tone="deny"
              />
            </div>
          </div>
        </div>
      </DecisionEnvironment>
    );
  }


  if (
    pendingDecision?.decision ===
    "STEP_UP"
  ) {
    return (
      <DecisionEnvironment
        state="step-up"
      >
        <div className="if-enter mx-auto w-full max-w-4xl">
          <div className="if-surface-elevated if-state-step-up relative overflow-hidden p-6 sm:p-8 lg:p-10">
            <DecisionAmbient tone="step-up" />

            <div className="relative z-10">
              <DecisionHeader
                icon={<Fingerprint size={29} />}
                tone="step-up"
                eyebrow="Adaptive Access Control"
                title="Additional Verification Required"
                description="Your credentials were successfully verified, but elevated session risk requires additional verification before privileged administrative access can be issued."
              />

              <DecisionStatusStrip
                decision="STEP UP"
                risk={`${pendingDecision.risk_level} · ${pendingDecision.risk_score}/100`}
              />

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <DecisionMetric
                  label="Enterprise Role"
                  value={pendingDecision.role}
                />

                <DecisionMetric
                  label="Access Scope"
                  value={pendingDecision.access_scope}
                />
              </div>

              <div className="mt-6 rounded-2xl border border-[rgba(230,179,92,0.2)] bg-[rgba(230,179,92,0.055)] p-5">
                <div className="flex gap-3">
                  <AlertTriangle
                    size={20}
                    className="mt-0.5 shrink-0 text-[var(--if-step-up)]"
                  />

                  <div>
                    <p className="font-semibold text-[var(--if-step-up)]">
                      Administrative session withheld
                    </p>

                    <p className="mt-2 text-sm leading-6 text-[var(--if-text-secondary)]">
                      Authentication succeeded, but IdentityForge has not
                      issued an administrative JWT. Authorization remains
                      pending until the additional verification requirement
                      is satisfied.
                    </p>
                  </div>
                </div>
              </div>

              <DecisionChecks
                checks={pendingDecision.checks}
              />

              <div className="mt-6 rounded-2xl border border-[var(--if-border-soft)] bg-black/10 p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--if-text-faint)]">
                  Step-Up Verification Roadmap
                </p>

                <p className="mt-2 text-sm leading-6 text-[var(--if-text-muted)]">
                  External verification providers are not connected in this
                  prototype.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    "Microsoft Authenticator",
                    "Okta Verify",
                    "FIDO2 / Passkey",
                  ].map(
                    (provider) => (
                      <span
                        key={provider}
                        className="rounded-lg border border-[var(--if-border)] bg-[rgba(5,8,13,0.55)] px-3 py-2 text-xs text-[var(--if-text-muted)]"
                      >
                        {provider} · Planned
                      </span>
                    )
                  )}
                </div>
              </div>

              <ReturnButton
                onClick={returnToSignIn}
                tone="step-up"
              />
            </div>
          </div>
        </div>
      </DecisionEnvironment>
    );
  }


  if (
    pendingDecision?.decision ===
      "ALLOW" ||
    pendingDecision?.decision ===
      "READ_ONLY"
  ) {
    return (
      <DecisionEnvironment
        state="allow"
      >
        <div className="if-enter mx-auto w-full max-w-4xl">
          <div className="if-surface-elevated if-state-allow relative overflow-hidden p-6 sm:p-8 lg:p-10">
            <DecisionAmbient tone="allow" />

            <div className="relative z-10">
              <DecisionHeader
                icon={<ShieldCheck size={29} />}
                tone="allow"
                eyebrow="Explainable Authorization"
                title="Access Decision"
                description="Identity, role, policy and session context have been evaluated before administrative access is issued."
              />

              <DecisionStatusStrip
                decision={pendingDecision.decision}
                risk={`${pendingDecision.risk_level} · ${pendingDecision.risk_score}/100`}
              />

              <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <DecisionMetric
                  label="Access Scope"
                  value={pendingDecision.access_scope}
                />

                <DecisionMetric
                  label="Enterprise Role"
                  value={pendingDecision.role}
                />

                <DecisionMetric
                  label="Department"
                  value={pendingDecision.department}
                />

                <DecisionMetric
                  label="Privileged Identity"
                  value={pendingDecision.privileged ? "Yes" : "No"}
                />
              </div>

              <DecisionChecks
                checks={pendingDecision.checks}
              />

              <div className="mt-6 rounded-xl border border-[rgba(85,214,162,0.16)] bg-[rgba(85,214,162,0.035)] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--if-allow)]">
                  Decision rationale
                </p>

                <p className="mt-2 text-sm leading-6 text-[var(--if-text-secondary)]">
                  {pendingDecision.reason}
                </p>
              </div>

              <button
                type="button"
                onClick={continueAdmin}
                className="if-button-primary mt-6 w-full px-5 py-3.5 text-sm font-bold"
              >
                Enter IdentityForge AI
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </div>
      </DecisionEnvironment>
    );
  }


  return (
    <div className="identityforge-background relative min-h-screen text-[var(--if-text-primary)]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[8%] top-[13%] h-[340px] w-[340px] rounded-full bg-[rgba(72,215,198,0.035)] blur-[110px]" />
        <div className="absolute right-[8%] top-[16%] h-[380px] w-[380px] rounded-full bg-[rgba(143,131,255,0.035)] blur-[120px]" />
        <div className="absolute bottom-[5%] left-[42%] h-[260px] w-[260px] rounded-full bg-[rgba(72,215,198,0.018)] blur-[100px]" />

        <div className="absolute left-[12%] top-[23%] hidden h-[340px] w-[460px] opacity-60 lg:block">
          <FabricLine
            left="8%"
            top="12%"
            width="68%"
            rotate="12deg"
          />

          <FabricLine
            left="19%"
            top="37%"
            width="54%"
            rotate="-14deg"
          />

          <FabricLine
            left="31%"
            top="61%"
            width="58%"
            rotate="9deg"
          />

          <FabricNode
            left="7%"
            top="10%"
            tone="teal"
          />

          <FabricNode
            left="47%"
            top="26%"
            tone="violet"
          />

          <FabricNode
            left="28%"
            top="56%"
            tone="teal"
          />

          <FabricNode
            left="76%"
            top="68%"
            tone="violet"
          />

          <FabricNode
            left="90%"
            top="31%"
            tone="teal"
          />
        </div>
      </div>


      <div className="relative z-10 mx-auto grid min-h-screen max-w-[1500px] items-center gap-12 px-5 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 xl:gap-20">
        <section className="if-enter">
          <div className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-teal-300/15 bg-[rgba(72,215,198,0.06)] text-teal-200">
              <div className="absolute inset-[7px] rounded-xl border border-violet-300/10" />
              <Shield size={25} />
            </div>

            <div>
              <h1 className="if-brand-gradient text-xl font-bold tracking-tight">
                IdentityForge AI
              </h1>

              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--if-text-faint)]">
                Enterprise Identity Security
              </p>
            </div>
          </div>


          <div className="mt-12 max-w-2xl">
            <div className="if-badge if-badge-intelligence">
              <Sparkles size={13} />
              Explainable Identity Access
            </div>

            <h2 className="if-heading mt-6 text-4xl font-bold leading-[1.08] sm:text-5xl xl:text-[3.55rem]">
              Access is not a login.
              <span className="if-brand-gradient block">
                It is a decision.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-sm leading-7 text-[var(--if-text-secondary)] sm:text-base">
              IdentityForge evaluates identity, enterprise role, segregation
              of duties and contextual risk before privileged administrative
              access is issued.
            </p>
          </div>


          <div className="mt-10 hidden max-w-2xl lg:block">
            <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.13em] text-[var(--if-text-faint)]">
              <span>Identity</span>
              <span className="h-px w-8 bg-gradient-to-r from-teal-300/35 to-transparent" />
              <span>Context</span>
              <span className="h-px w-8 bg-gradient-to-r from-violet-300/30 to-transparent" />
              <span>Policy</span>
              <span className="h-px w-8 bg-gradient-to-r from-teal-300/35 to-transparent" />
              <span>Decision</span>
            </div>
          </div>
        </section>


        <section className="if-enter w-full">
          <div className="if-surface-elevated relative mx-auto max-w-md overflow-hidden p-6 sm:p-8">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-300/40 to-violet-300/30" />
            <div className="pointer-events-none absolute right-[-90px] top-[-90px] h-56 w-56 rounded-full bg-[rgba(143,131,255,0.04)] blur-[70px]" />

            <div className="relative">
              <p className="if-eyebrow">
                Administrative Access
              </p>

              <h2 className="if-heading mt-2 text-2xl font-bold">
                Verify your identity
              </h2>

              <p className="mt-3 text-sm leading-6 text-[var(--if-text-muted)]">
                Successful authentication is evaluated against enterprise
                authorization policy before a privileged session is issued.
              </p>


              <form
                onSubmit={handleSubmit}
                className="mt-7 space-y-4"
              >
                <label className="block">
                  <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.13em] text-[var(--if-text-faint)]">
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
                    className="if-input px-4 py-3 text-sm"
                    placeholder="iamadmin"
                  />
                </label>


                <label className="block">
                  <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.13em] text-[var(--if-text-faint)]">
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
                      className="if-input px-4 py-3 pr-12 text-sm"
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
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-[var(--if-text-muted)] transition hover:bg-white/[0.03] hover:text-white"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword
                        ? <EyeOff size={17} />
                        : <Eye size={17} />
                      }
                    </button>
                  </div>
                </label>


                {error && (
                  <div className="rounded-xl border border-[rgba(239,114,130,0.18)] bg-[rgba(239,114,130,0.06)] px-4 py-3 text-sm text-[var(--if-deny)]">
                    {error}
                  </div>
                )}


                <button
                  type="submit"
                  disabled={loading}
                  className="if-button-primary w-full px-5 py-3.5 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-55"
                >
                  {loading
                    ? "Evaluating identity..."
                    : (
                      <>
                        <LockKeyhole size={17} />
                        Authenticate & Evaluate
                      </>
                    )
                  }
                </button>
              </form>


              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-[var(--if-border-soft)]" />

                <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--if-text-faint)]">
                  Recruiter Experience
                </span>

                <div className="h-px flex-1 bg-[var(--if-border-soft)]" />
              </div>


              <button
                type="button"
                onClick={exploreDemo}
                className="w-full rounded-xl border border-violet-300/15 bg-violet-300/[0.04] px-5 py-3.5 text-sm font-semibold text-violet-100 transition hover:border-violet-300/25 hover:bg-violet-300/[0.07]"
              >
                Explore Read-Only Demo
              </button>


              <p className="mt-3 text-center text-xs leading-5 text-[var(--if-text-faint)]">
                Synthetic enterprise IAM data · Governance modifications disabled
              </p>


              <div className="mt-6 rounded-xl border border-[var(--if-border-soft)] bg-black/10 p-4">
                <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--if-text-faint)]">
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
                        className="rounded-lg border border-[var(--if-border-soft)] bg-[rgba(5,8,13,0.55)] px-2.5 py-1.5 text-[10px] text-[var(--if-text-muted)]"
                      >
                        {item} · Planned
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>


      <button
        type="button"
        title="IdentityForge Access Assistant — coming next"
        className="fixed bottom-5 right-5 z-20 flex items-center gap-2 rounded-full border border-teal-300/15 bg-[rgba(7,11,17,0.9)] px-4 py-3 text-sm font-medium text-teal-200 shadow-[0_14px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl transition hover:border-teal-300/25 hover:bg-[rgba(12,18,27,0.96)]"
      >
        <span className="relative flex h-7 w-7 items-center justify-center rounded-full border border-teal-300/15 bg-teal-300/[0.05]">
          <Bot size={15} />
        </span>

        <span className="hidden sm:inline">
          Access Assistant
        </span>
      </button>
    </div>
  );
}


type DecisionTone =
  | "allow"
  | "step-up"
  | "deny";


function DecisionEnvironment({
  state,
  children,
}: {
  state: DecisionTone;
  children: React.ReactNode;
}) {
  const glow =
    state === "allow"
      ? "bg-[rgba(85,214,162,0.04)]"
      : state === "step-up"
      ? "bg-[rgba(230,179,92,0.04)]"
      : "bg-[rgba(239,114,130,0.04)]";

  return (
    <div className="identityforge-background relative min-h-screen px-4 py-8 text-[var(--if-text-primary)] sm:px-6">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={`absolute left-[8%] top-[10%] h-[360px] w-[360px] rounded-full ${glow} blur-[120px]`}
        />

        <div className="absolute bottom-[8%] right-[8%] h-[320px] w-[320px] rounded-full bg-[rgba(143,131,255,0.025)] blur-[110px]" />
      </div>

      <div className="relative z-10 flex min-h-[calc(100vh-4rem)] items-center justify-center">
        {children}
      </div>
    </div>
  );
}


function DecisionAmbient({
  tone,
}: {
  tone: DecisionTone;
}) {
  const nodeClass =
    tone === "allow"
      ? "bg-[var(--if-allow)]"
      : tone === "step-up"
      ? "bg-[var(--if-step-up)]"
      : "bg-[var(--if-deny)]";

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute right-[-30px] top-[-30px] h-40 w-40 rounded-full border border-white/[0.02]" />

      <div className="absolute right-[55px] top-[55px] h-2 w-2 rounded-full border border-white/10 bg-[var(--if-ink-2)]">
        <div
          className={`absolute inset-[2px] rounded-full ${nodeClass} opacity-70`}
        />
      </div>

      <div className="absolute right-[62px] top-[63px] h-px w-28 rotate-[22deg] origin-left bg-gradient-to-r from-white/[0.06] to-transparent" />
    </div>
  );
}


function DecisionHeader({
  icon,
  tone,
  eyebrow,
  title,
  description,
}: {
  icon: React.ReactNode;
  tone: DecisionTone;
  eyebrow: string;
  title: string;
  description: string;
}) {
  const toneClasses =
    tone === "allow"
      ? "border-emerald-300/15 bg-emerald-300/[0.05] text-[var(--if-allow)]"
      : tone === "step-up"
      ? "border-amber-300/15 bg-amber-300/[0.05] text-[var(--if-step-up)]"
      : "border-rose-300/15 bg-rose-300/[0.05] text-[var(--if-deny)]";

  return (
    <div className="flex items-start gap-4">
      <div
        className={`flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl border p-3 ${toneClasses}`}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p
          className={[
            "text-[10px] font-semibold uppercase tracking-[0.17em]",
            tone === "allow"
              ? "text-[var(--if-allow)]"
              : tone === "step-up"
              ? "text-[var(--if-step-up)]"
              : "text-[var(--if-deny)]",
          ].join(" ")}
        >
          {eyebrow}
        </p>

        <h1 className="if-heading mt-1 text-2xl font-bold sm:text-3xl">
          {title}
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--if-text-secondary)]">
          {description}
        </p>
      </div>
    </div>
  );
}


function DecisionStatusStrip({
  decision,
  risk,
}: {
  decision: string;
  risk: string;
}) {
  return (
    <div className="mt-7 grid gap-3 sm:grid-cols-2">
      <DecisionMetric
        label="Authorization Decision"
        value={decision}
      />

      <DecisionMetric
        label="Session Risk"
        value={risk}
      />
    </div>
  );
}


function DecisionChecks({
  checks,
}: {
  checks: Array<{
    name: string;
    status: string;
    explanation: string;
  }>;
}) {
  return (
    <div className="mt-6 grid gap-3 lg:grid-cols-2">
      {checks.map(
        (
          check,
          index
        ) => (
          <div
            key={`${check.name}-${index}`}
            className="flex gap-3 rounded-xl border border-[var(--if-border-soft)] bg-black/10 p-4"
          >
            <CheckCircle2
              size={18}
              className={
                check.status ===
                "PASS"
                  ? "mt-0.5 shrink-0 text-[var(--if-allow)]"
                  : check.status ===
                    "WARN"
                  ? "mt-0.5 shrink-0 text-[var(--if-step-up)]"
                  : check.status ===
                    "INFO"
                  ? "mt-0.5 shrink-0 text-[var(--if-violet-soft)]"
                  : "mt-0.5 shrink-0 text-[var(--if-deny)]"
              }
            />

            <div>
              <p className="text-sm font-semibold text-[var(--if-text-primary)]">
                {check.name}
              </p>

              <p className="mt-1 text-xs leading-5 text-[var(--if-text-muted)]">
                {check.explanation}
              </p>
            </div>
          </div>
        )
      )}
    </div>
  );
}


function ReturnButton({
  onClick,
  tone,
}: {
  onClick: () => void;
  tone: "step-up" | "deny";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "mt-6 flex w-full items-center justify-center gap-2 rounded-xl border bg-black/10 px-5 py-3.5 text-sm font-semibold text-[var(--if-text-secondary)] transition hover:text-white",
        tone ===
        "deny"
          ? "border-[rgba(239,114,130,0.16)] hover:border-[rgba(239,114,130,0.28)]"
          : "border-[rgba(230,179,92,0.16)] hover:border-[rgba(230,179,92,0.28)]",
      ].join(" ")}
    >
      <RotateCcw size={17} />
      Return to Sign In
    </button>
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
    <div className="rounded-xl border border-[var(--if-border-soft)] bg-black/10 p-4">
      <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--if-text-faint)]">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold text-[var(--if-text-primary)]">
        {value.replaceAll(
          "_",
          " "
        )}
      </p>
    </div>
  );
}


function FabricLine({
  left,
  top,
  width,
  rotate,
}: {
  left: string;
  top: string;
  width: string;
  rotate: string;
}) {
  return (
    <div
      className="absolute h-px origin-left bg-gradient-to-r from-teal-300/15 via-violet-300/10 to-transparent"
      style={{
        left,
        top,
        width,
        transform:
          `rotate(${rotate})`,
      }}
    />
  );
}


function FabricNode({
  left,
  top,
  tone,
}: {
  left: string;
  top: string;
  tone:
    | "teal"
    | "violet";
}) {
  return (
    <div
      className={[
        "absolute h-3 w-3 rounded-full border bg-[var(--if-ink-2)]",
        tone ===
        "teal"
          ? "border-teal-300/25"
          : "border-violet-300/25",
      ].join(" ")}
      style={{
        left,
        top,
      }}
    >
      <div
        className={[
          "absolute inset-[3px] rounded-full",
          tone ===
          "teal"
            ? "bg-teal-300/70"
            : "bg-violet-300/70",
        ].join(" ")}
      />
    </div>
  );
}
