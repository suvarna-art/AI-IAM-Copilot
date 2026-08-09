import type { AccessControl } from "../types/accessControl";

const API_BASE_URL = "http://localhost:8000";

async function fetchAccessControls(
  endpoint: string
): Promise<AccessControl[]> {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`
  );

  if (!response.ok) {
    throw new Error(
      `Access Control API failed: ${response.status}`
    );
  }

  return response.json();
}


export async function getAccessControls(): Promise<AccessControl[]> {
  return fetchAccessControls("/access-control");
}


export async function getPrivilegedAccessControls(): Promise<AccessControl[]> {
  return fetchAccessControls(
    "/access-control/privileged"
  );
}


export async function getHighRiskAccessControls(): Promise<AccessControl[]> {
  return fetchAccessControls(
    "/access-control/high-risk"
  );
}


export async function getExcessiveAccessControls(): Promise<AccessControl[]> {
  return fetchAccessControls(
    "/access-control/excessive"
  );
}