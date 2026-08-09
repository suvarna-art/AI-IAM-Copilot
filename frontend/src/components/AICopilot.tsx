import { useState } from "react";
import {
  BrainCircuit,
  Send,
  ShieldAlert,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import { askCopilot } from "../services/aiCopilot";
import type { CopilotResponse } from "../types/aiCopilot";

export default function AICopilot() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<CopilotResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAskCopilot() {
    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt) {
      setError("Please enter an IAM question.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await askCopilot({
        prompt: trimmedPrompt,
      });

      setResponse(result);
    } catch (err) {
      console.error("AI Copilot Error:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unable to communicate with AI Copilot.");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleAskCopilot();
    }
  }

  return (
    <section className="rounded-3xl border border-cyan-500/20 bg-slate-900/80 p-6 backdrop-blur-xl">

      {/* Header */}
      <div className="mb-5 flex items-start justify-between">

        <div>
          <div className="flex items-center gap-2">

            <BrainCircuit
              size={22}
              className="text-cyan-400"
            />

            <h2 className="text-xl font-bold text-white">
              AI Copilot
            </h2>

          </div>

          <p className="mt-1 text-sm text-slate-400">
            IAM intelligence and governance assistance
          </p>
        </div>

        <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-400">
          AI ACTIVE
        </span>

      </div>

      {/* Input */}
      <div className="space-y-3">

        <label
          htmlFor="copilot-prompt"
          className="text-xs uppercase tracking-wide text-slate-400"
        >
          Ask your IAM question
        </label>

        <textarea
          id="copilot-prompt"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Example: Which access reviews need immediate attention?"
          rows={3}
          className="w-full resize-none rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500/50"
        />

        <div className="flex items-center justify-between">

          <p className="text-xs text-slate-500">
            Press Enter to ask • Shift + Enter for a new line
          </p>

          <button
            type="button"
            onClick={handleAskCopilot}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-400 transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2
                  size={16}
                  className="animate-spin"
                />
                Thinking...
              </>
            ) : (
              <>
                <Send size={16} />
                Ask Copilot
              </>
            )}
          </button>

        </div>

      </div>

      {/* Error */}
      {error && (
        <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/5 p-4">

          <div className="flex items-center gap-2 text-sm text-red-400">

            <ShieldAlert size={17} />

            <span>{error}</span>

          </div>

        </div>
      )}

      {/* Response */}
      {response && (
        <div className="mt-6 space-y-4">

          {/* Response header */}
          <div className="flex items-center justify-between">

            <p className="text-xs uppercase tracking-wide text-slate-400">
              Copilot Analysis
            </p>

            <span
              className={`rounded-full border px-3 py-1 text-xs ${
                response.risk_level === "High"
                  ? "border-red-500/20 bg-red-500/10 text-red-400"
                  : response.risk_level === "Medium"
                    ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
                    : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
              }`}
            >
              Risk: {response.risk_level}
            </span>

          </div>

          {/* Answer */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">

            <p className="text-sm leading-6 text-slate-200">
              {response.answer}
            </p>

          </div>

          {/* Intent */}
          <div className="flex items-center gap-2">

            <span className="text-xs uppercase tracking-wide text-slate-500">
              Intent
            </span>

            <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-400">
              {response.intent.replaceAll("_", " ")}
            </span>

          </div>

          {/* Recommendations */}
          {response.recommendations.length > 0 && (
            <div>

              <p className="mb-3 text-xs uppercase tracking-wide text-slate-400">
                Recommendations
              </p>

              <div className="space-y-2">

                {response.recommendations.map(
                  (recommendation, index) => (
                    <div
                      key={`${recommendation}-${index}`}
                      className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3"
                    >

                      <CheckCircle2
                        size={17}
                        className="mt-0.5 shrink-0 text-cyan-400"
                      />

                      <span className="text-sm text-slate-300">
                        {recommendation}
                      </span>

                    </div>
                  )
                )}

              </div>

            </div>
          )}

        </div>
      )}

    </section>
  );
}