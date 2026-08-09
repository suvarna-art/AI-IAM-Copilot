export type CopilotRequest = {
  prompt: string;
};

export type CopilotResponse = {
  answer: string;
  intent: string;
  risk_level: string;
  recommendations: string[];
};