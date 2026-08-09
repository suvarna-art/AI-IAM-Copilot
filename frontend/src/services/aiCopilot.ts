import type {
  CopilotRequest,
  CopilotResponse,
} from "../types/aiCopilot";

const API_URL = "http://127.0.0.1:8000";

export async function askCopilot(
  request: CopilotRequest
): Promise<CopilotResponse> {
  const response = await fetch(`${API_URL}/ai/copilot`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("Failed to communicate with AI Copilot");
  }

  return response.json();
}