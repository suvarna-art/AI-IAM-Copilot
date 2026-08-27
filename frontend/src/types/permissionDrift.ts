export interface PermissionDriftFinding {
  user_id: string;
  user_name: string;
  account_type: string;
  privileged: boolean;
  status: string;
  department: string;
  owner: string;
  permission: string;
  resource: string;
  risk_level: string;
  expected_usage_pattern: string;

  analysis_window_days: number;
  analysis_window_start: string;
  analysis_timestamp: string;

  usage_count_14d: number;
  active_days_14d: number;
  last_used_at: string | null;

  activity_state:
    | "ACTIVE"
    | "LOW_ACTIVITY"
    | "DORMANT"
    | "NEVER_USED";

  drift_score: number;

  raw_classification:
    | "LOW"
    | "MEDIUM"
    | "HIGH";

  exemption_applied: boolean;
  exemption_status:
    | "ACTIVE"
    | "EXPIRED"
    | "NOT_YET_ACTIVE"
    | null;

  exemption_id: number | null;
  exemption_type: string | null;
  exemption_reason: string | null;
  expected_frequency: string | null;

  final_status:
    | "ACTIVE"
    | "MONITORED"
    | "DRIFT_CANDIDATE"
    | "EXEMPT"
    | "EXEMPTION_EXPIRED";
}

export interface PermissionDriftSummary {
  analysis_window_days: number;

  total_identities: number;
  total_permissions: number;

  active: number;
  monitored: number;
  drift_candidates: number;
  exempt: number;
  exemption_expired: number;

  high_risk_findings: number;
  dormant_permissions: number;
  privileged_permissions: number;
  service_account_permissions: number;
}

export interface PermissionDriftExemption {
  exemption_id: number;

  user_id: string | null;
  account_type: string | null;
  permission: string | null;

  exemption_type: string;
  reason: string;
  expected_frequency: string | null;

  valid_from: string;
  valid_until: string | null;

  created_by: string;
  status: string;
  created_at: string;
}