export interface AnalyticsSummary {
  totalIdentities: number;
  activeIdentities: number;
  privilegedIdentities: number;
  highRiskIdentities: number;
  inactiveIdentities: number;
  excessiveAccessIdentities: number;
}

export interface AnalyticsDistribution {
  name: string;
  value: number;
}

export interface AccessTrend {
  period: string;
  accessRequests: number;
  approved: number;
  denied: number;
}

export interface SecurityMetrics {
  securityScore: number;
  accessReviewCompletion: number;
  privilegedAccountPercentage: number;
  highRiskPercentage: number;
}

export interface AnalyticsData {
  summary: AnalyticsSummary;
  riskDistribution: AnalyticsDistribution[];
  identityStatus: AnalyticsDistribution[];
  accessTrend: AccessTrend[];
  securityMetrics: SecurityMetrics;
}