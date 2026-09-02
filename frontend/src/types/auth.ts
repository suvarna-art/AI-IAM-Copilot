export type AuthMode =
  | "SIGNED_OUT"
  | "ADMIN"
  | "DEMO";


export type AccessDecisionType =
  | "ALLOW"
  | "READ_ONLY"
  | "STEP_UP"
  | "DENY";


export type RiskLevel =
  | "LOW"
  | "MEDIUM"
  | "HIGH";


export interface AuthorizationCheck {
  name: string;
  status:
    | "PASS"
    | "WARN"
    | "FAIL"
    | "INFO";

  explanation: string;
}


export interface AuthorizationDecision {
  decision: AccessDecisionType;

  access_scope: string;

  role: string;

  department: string;

  privileged: boolean;

  risk_level: RiskLevel;

  risk_score: number;

  reason: string;

  checks: AuthorizationCheck[];
}


export interface LoginResponse {
  access_token: string;

  token_type: string;

  expires_in_minutes: number;

  authorization: AuthorizationDecision;
}


export interface AuthenticatedUser {
  username: string;
  role: string;
}


export interface AuthSession {
  mode: AuthMode;

  username: string | null;

  displayName: string | null;

  role: string | null;

  accessScope: string | null;

  authorization: AuthorizationDecision | null;
}