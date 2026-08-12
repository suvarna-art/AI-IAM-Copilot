import { apiFetch } from "./api";
import type { AccessReview } from "../types/accessReview";

export async function getAccessReview(): Promise<AccessReview> {
  return apiFetch<AccessReview>("/access-review");
}