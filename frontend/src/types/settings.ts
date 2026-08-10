export interface OrganizationSettings {
  name: string;
  environment: string;
  region: string;
}

export interface SecuritySettings {
  mfaEnabled: boolean;
  ssoEnabled: boolean;
  sessionTimeoutMinutes: number;
  passwordPolicy: string;
  riskMonitoring: boolean;
}

export interface GovernanceSettings {
  accessReviewsEnabled: boolean;
  reviewFrequency: string;
  privilegedAccessMonitoring: boolean;
  auditLogging: boolean;
}

export interface AISettings {
  copilotEnabled: boolean;
  riskAnalysisEnabled: boolean;
  recommendationsEnabled: boolean;
}

export interface SettingsData {
  organization: OrganizationSettings;
  security: SecuritySettings;
  governance: GovernanceSettings;
  ai: AISettings;
}