export interface PrivilegedAccount {
  id: string;
  username: string;
  displayName: string;
  department: string;
  role: string;
  riskLevel: string;
  riskScore: number;
  mfaEnabled: boolean;
  status: string;
  lastAccess: string;
}

export interface PrivilegedAccessSummary {
  totalAccounts: number;
  highRiskAccounts: number;
  mfaDisabledAccounts: number;
  inactiveAccounts: number;
}