import { AppError } from "@/lib/error/error";
import { handleApiError } from "@/lib/error/handleApiError";
import { runLLM } from "@/lib/llm/LLMRouter";
import { buildWriteAnalysisPrompt } from "@/lib/prompts/buildWriteAnalysisPropmt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { subject, writing } = body ?? {};
    console.log(body)

    console.log("Received for analysis:", { subject, writing });

    if (!subject || !writing) {
      throw new AppError(
        "Subject and writing are required",
        400,
        "INVALID_INPUT",
      );
    }

    const wordCount = writing.trim().split(/\s+/).length;

    if (wordCount < 40) {
      throw new AppError("Minimum 40 words required", 401, "INVALID_INPUT");
    }

    const prompt = buildWriteAnalysisPrompt(subject, writing);

    const llmResult = await runLLM(prompt);
    console.log("LLM result:", llmResult.provider);

    const analysis = safeParseJSON(llmResult.text);

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

function safeParseJSON(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    throw new AppError(
      "LLM returned invalid JSON",
      422,
      "INVALID_LLM_RESPONSE",
    );
  }
}
