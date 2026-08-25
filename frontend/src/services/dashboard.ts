import { apiFetch } from "./api";
import type { DashboardData } from "../types/dashboard";

export async function getDashboardData(): Promise<DashboardData> {
  return apiFetch<DashboardData>("/dashboard");
}