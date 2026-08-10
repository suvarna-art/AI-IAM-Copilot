import { apiFetch } from "./api";

import type { AnalyticsData } from "../types/analytics";

export async function getAnalytics(): Promise<AnalyticsData> {
  return apiFetch<AnalyticsData>("/analytics/");
}
