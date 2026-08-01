import { apiFetch } from "./api";
import type { Activity } from "../types/dashboard";

export async function getActivities(): Promise<Activity[]> {
  return apiFetch<Activity[]>("/activities/");
}