import { apiFetch } from "./api";

import type { SettingsData } from "../types/settings";

export async function getSettings(): Promise<SettingsData> {
  return apiFetch<SettingsData>("/settings/");
}