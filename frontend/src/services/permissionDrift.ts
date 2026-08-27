import { apiFetch } from "./api";

import type {
  PermissionDriftExemption,
  PermissionDriftFinding,
  PermissionDriftSummary,
} from "../types/permissionDrift";


export async function getPermissionDriftSummary():
  Promise<PermissionDriftSummary> {
  return apiFetch<PermissionDriftSummary>(
    "/permission-drift/summary"
  );
}


export async function getPermissionDriftFindings():
  Promise<PermissionDriftFinding[]> {
  return apiFetch<PermissionDriftFinding[]>(
    "/permission-drift/findings"
  );
}


export async function getHighRiskPermissionDrift():
  Promise<PermissionDriftFinding[]> {
  return apiFetch<PermissionDriftFinding[]>(
    "/permission-drift/high-risk"
  );
}


export async function getDriftCandidates():
  Promise<PermissionDriftFinding[]> {
  return apiFetch<PermissionDriftFinding[]>(
    "/permission-drift/drift-candidates"
  );
}


export async function getPermissionDriftExemptions():
  Promise<PermissionDriftExemption[]> {
  return apiFetch<PermissionDriftExemption[]>(
    "/permission-drift/exemptions"
  );
}