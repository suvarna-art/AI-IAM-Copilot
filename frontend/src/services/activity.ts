import { apiFetch } from "./api";

export interface Activity {
  id: number;
  user: string;
  action: string;
  status: string;
  time: string;
}

export async function getActivities(): Promise<Activity[]> {
  return apiFetch<Activity[]>("/activities/");
}