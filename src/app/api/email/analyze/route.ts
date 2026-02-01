import { AppError } from "@/lib/error/error";
import { handleApiError } from "@/lib/error/handleApiError";
import { runLLM } from "@/lib/llm/LLMRouter";
import { buildEmailAnalysisPrompt } from "@/lib/prompts/buildEmailAnalysisPrompt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  
  try {
    const body = await req.json();
    const { subject, writing, audience, tone, purpose } = body;
    console.log("email", subject)
    if (!subject || !writing) {
      throw new AppError("Missing fields", 401, "INVALID_INPUT");
    }

    const wordCount = writing.trim().split(/\s+/).length;

    if (wordCount < 40) {

      throw new AppError("Minimum 40 words required", 401, "INVALID_INPUT");
    }

    const prompt = buildEmailAnalysisPrompt(subject, writing);
    const llmResult = await runLLM(prompt);

    let analysis;
    try {
      analysis = JSON.parse(llmResult.text);
    } catch {
      analysis = {
        clarityScore: 0,
        structureScore: 0,
        toneMatch: "Neutral",
        feedback: "Unable to analyze writing. Please try again.",
      };
    }
    return NextResponse.json(
      {
        success: true,
        llmProvider: llmResult.provider,
        analysis,
      },
      { status: 200 },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
