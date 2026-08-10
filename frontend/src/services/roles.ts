import { apiFetch } from "./api";

import type { Role } from "../types/roles";

export async function getRoles(): Promise<Role[]> {
  return apiFetch<Role[]>("/roles/");
}

export async function getHighRiskRoles(): Promise<Role[]> {
  return apiFetch<Role[]>("/roles/high-risk");
}