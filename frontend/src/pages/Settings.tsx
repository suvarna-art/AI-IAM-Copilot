import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  Settings as SettingsIcon,
  ShieldCheck,
  Workflow,
  BrainCircuit,
  Building2,
  CheckCircle2,
  Clock3,
} from "lucide-react";

import { getSettings } from "../services/settings";

import type { SettingsData } from "../types/settings";

export default function Settings() {
  const [settings, setSettings] =
    useState<SettingsData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        setError("");

        const result = await getSettings();

        console.log(
          "SETTINGS DATA:",
          result
        );

        setSettings(result);
      } catch (err) {
        console.error(
          "Settings API Error:",
          err
        );

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(
            "Unable to load application settings."
          );
        }
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-slate-400">
          Loading Settings...
        </p>
      </div>
    );
  }

  if (error || !settings) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
        <p className="font-medium text-red-400">
          Settings unavailable
        </p>

        <p className="mt-1 text-sm text-slate-500">
          {error || "No settings data returned."}
        </p>
      </div>
    );
  }

  const {
    organization,
    security,
    governance,
    ai,
  } = settings;

  return (
    <div className="space-y-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section>
        <div className="flex items-start gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10">
            <SettingsIcon
              size={22}
              className="text-cyan-400"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white">
              Settings
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Application and security configuration
            </p>
          </div>

        </div>
      </section>


      {/* =====================================================
          ORGANIZATION
      ===================================================== */}

      <section>

        <SectionHeader
          icon={<Building2 size={18} />}
          title="Organization"
          subtitle="Enterprise environment configuration"
        />

        <div className="grid gap-5 md:grid-cols-3">

          <InfoCard
            label="Organization"
            value={organization.name}
          />

          <InfoCard
            label="Environment"
            value={organization.environment}
          />

          <InfoCard
            label="Region"
            value={organization.region}
          />

        </div>

      </section>


      {/* =====================================================
          SECURITY
      ===================================================== */}

      <section>

        <SectionHeader
          icon={<ShieldCheck size={18} />}
          title="Security Controls"
          subtitle="Identity authentication and security configuration"
        />

        <div className="grid gap-4 md:grid-cols-2">

          <SettingRow
            label="Multi-Factor Authentication"
            description="Require MFA for identity authentication."
            enabled={security.mfaEnabled}
          />

          <SettingRow
            label="Single Sign-On"
            description="Enable centralized enterprise authentication."
            enabled={security.ssoEnabled}
          />

          <SettingRow
            label="Risk Monitoring"
            description="Continuously monitor identity security risk."
            enabled={security.riskMonitoring}
          />

          <SettingRow
            label="Password Policy"
            description="Current enterprise password policy."
            enabled
            value={security.passwordPolicy}
          />

        </div>

        <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/40 p-5">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <Clock3
                size={18}
                className="text-cyan-400"
              />

              <div>

                <p className="text-sm font-semibold text-white">
                  Session Timeout
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Automatic session expiration interval
                </p>

              </div>

            </div>

            <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-sm font-medium text-cyan-400">
              {security.sessionTimeoutMinutes} minutes
            </span>

          </div>

        </div>

      </section>


      {/* =====================================================
          GOVERNANCE
      ===================================================== */}

      <section>

        <SectionHeader
          icon={<Workflow size={18} />}
          title="Identity Governance"
          subtitle="Access review and privileged access controls"
        />

        <div className="grid gap-4 md:grid-cols-2">

          <SettingRow
            label="Access Reviews"
            description="Enable identity access certification campaigns."
            enabled={governance.accessReviewsEnabled}
          />

          <SettingRow
            label="Privileged Access Monitoring"
            description="Monitor elevated and privileged identities."
            enabled={governance.privilegedAccessMonitoring}
          />

          <SettingRow
            label="Audit Logging"
            description="Record governance and security events."
            enabled={governance.auditLogging}
          />

          <SettingRow
            label="Review Frequency"
            description="Scheduled identity certification frequency."
            enabled
            value={governance.reviewFrequency}
          />

        </div>

      </section>


      {/* =====================================================
          AI CONFIGURATION
      ===================================================== */}

      <section>

        <SectionHeader
          icon={<BrainCircuit size={18} />}
          title="AI Security"
          subtitle="AI-powered identity intelligence configuration"
        />

        <div className="grid gap-4 md:grid-cols-3">

          <SettingRow
            label="AI Copilot"
            description="Enable intelligent IAM assistance."
            enabled={ai.copilotEnabled}
          />

          <SettingRow
            label="Risk Analysis"
            description="Enable AI-powered identity risk analysis."
            enabled={ai.riskAnalysisEnabled}
          />

          <SettingRow
            label="Recommendations"
            description="Enable AI security recommendations."
            enabled={ai.recommendationsEnabled}
          />

        </div>

      </section>


      {/* =====================================================
          CONFIGURATION STATUS
      ===================================================== */}

      <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">

        <div className="flex items-center gap-3">

          <CheckCircle2
            size={20}
            className="text-emerald-400"
          />

          <div>

            <p className="text-sm font-semibold text-white">
              Configuration Status
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Enterprise security configuration is active and being monitored.
            </p>

          </div>

        </div>

      </section>

    </div>
  );
}


/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({
  icon,
  title,
  subtitle,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-4 flex items-start gap-3">

      <div className="mt-0.5 text-cyan-400">
        {icon}
      </div>

      <div>
        <h2 className="font-semibold text-white">
          {title}
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          {subtitle}
        </p>
      </div>

    </div>
  );
}


/* =========================================================
   INFO CARD
========================================================= */

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">

      <p className="text-xs uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-3 text-lg font-semibold text-white">
        {value}
      </p>

    </div>
  );
}


/* =========================================================
   SETTING ROW
========================================================= */

function SettingRow({
  label,
  description,
  enabled,
  value,
}: {
  label: string;
  description: string;
  enabled: boolean;
  value?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">

      <div className="flex items-start justify-between gap-4">

        <div>

          <p className="text-sm font-semibold text-white">
            {label}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {description}
          </p>

        </div>

        {value ? (
          <span className="shrink-0 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400">
            {value}
          </span>
        ) : (
          <span
            className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${
              enabled
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                : "border-slate-700 bg-slate-800/50 text-slate-400"
            }`}
          >
            {enabled ? "Enabled" : "Disabled"}
          </span>
        )}

      </div>

    </div>
  );
}