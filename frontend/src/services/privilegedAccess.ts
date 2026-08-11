import { apiFetch } from "./api";

import type {
  PrivilegedAccount,
} from "../types/privilegedAccess";

export async function getPrivilegedAccounts(): Promise<
  PrivilegedAccount[]
> {
  return apiFetch<PrivilegedAccount[]>(
    "/privileged-access/"
  );
}

export async function getHighRiskPrivilegedAccounts(): Promise<
  PrivilegedAccount[]
> {
  return apiFetch<PrivilegedAccount[]>(
    "/privileged-access/high-risk"
  );
}

export async function getMfaDisabledPrivilegedAccounts(): Promise<
  PrivilegedAccount[]
> {
  return apiFetch<PrivilegedAccount[]>(
    "/privileged-access/mfa-disabled"
  );
}