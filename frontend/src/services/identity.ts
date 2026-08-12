import { apiFetch } from "./api";
import type { Identity } from "../types/identity";

export async function getIdentities(): Promise<Identity[]> {
  return apiFetch<Identity[]>("/identities");
}