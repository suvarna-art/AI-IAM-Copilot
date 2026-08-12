import { apiFetch } from "./api";
import type { AccessControl } from "../types/accessControl";

export async function getAccessControls(): Promise<AccessControl[]> {
  return apiFetch<AccessControl[]>("/access-control");
}

export async function getPrivilegedAccessControls(): Promise<
  AccessControl[]
> {
  return apiFetch<AccessControl[]>("/access-control/privileged");
}

export async function getHighRiskAccessControls(): Promise<
  AccessControl[]
> {
  return apiFetch<AccessControl[]>("/access-control/high-risk");
}

export async function getExcessiveAccessControls(): Promise<
  AccessControl[]
> {
  return apiFetch<AccessControl[]>("/access-control/excessive");
}