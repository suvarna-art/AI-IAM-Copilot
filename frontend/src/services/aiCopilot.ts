import { apiFetch } from "./api";
import type {
  CopilotRequest,
  CopilotResponse,
} from "../types/aiCopilot";

export async function askCopilot(
  request: CopilotRequest
): Promise<CopilotResponse> {
  return apiFetch<CopilotResponse>("/ai/copilot", {
    method: "POST",
    body: JSON.stringify(request),
  });
}