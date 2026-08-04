import { apiFetch } from "./api";

export interface AIConfidenceData {
  score: number;
  prediction: string;
  trend: string;
}

export async function getAIConfidence(): Promise<AIConfidenceData> {
  return apiFetch<AIConfidenceData>("/ai-confidence/");
}