import { apiFetch } from "./api";

export interface RiskIntelligenceData {
  overallRisk: string;
  riskScore: number;
  confidence: number;
  topFinding: string;
  recommendations: string[];
}

export async function getRiskIntelligence(): Promise<RiskIntelligenceData> {
  return apiFetch<RiskIntelligenceData>("/risk-intelligence/");
}