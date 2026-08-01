export interface DashboardData {
  securityScore: number;
  activeIdentities: number;
  highRiskAccounts: number;
  pendingReviews: number;
}

export interface Activity {
  id: number;
  user: string;
  action: string;
  status: string;
  time: string;
}

export interface AIInsight {
  id: number;
  title: string;
  description: string;
  severity: "Low" | "Medium" | "High";
}