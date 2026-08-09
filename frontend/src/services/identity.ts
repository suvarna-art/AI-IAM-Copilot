import type { Identity } from "../types/identity";

const API_BASE_URL = "http://127.0.0.1:8000";

export async function getIdentities(): Promise<Identity[]> {
  const response = await fetch(
    `${API_BASE_URL}/identities`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch identities: ${response.status}`
    );
  }

  return response.json();
}