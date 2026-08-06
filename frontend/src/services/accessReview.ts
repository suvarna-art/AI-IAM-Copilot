import type { AccessReview } from "../types/accessReview";

const API_URL = "http://127.0.0.1:8000";

export async function getAccessReview(): Promise<AccessReview> {
  const response = await fetch(`${API_URL}/access-review`);

  if (!response.ok) {
    throw new Error("Failed to fetch Access Review");
  }

  return response.json();
}