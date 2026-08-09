import type { AccessReview } from "../types/accessReview";

const API_BASE_URL = "http://localhost:8000";

export async function getAccessReview(): Promise<AccessReview> {
  const response = await fetch(
    `${API_BASE_URL}/access-review`
  );

  if (!response.ok) {
    throw new Error(
      `Access Review API failed: ${response.status}`
    );
  }

  return response.json();
}