import { GoogleGenAI } from "@google/genai";
import { AppError } from "../error/error";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});
export async function callGemini(prompt: string) {
  try {
    console.log("Calling Gemini (new SDK)");

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    if (!response?.text) {
      throw new AppError(
        "Gemini returned empty response",
        502,
        "EMPTY_LLM_RESPONSE"
      );
    }

    return {
      provider: "gemini",
      text: response.text,
      raw: response,
    };
  } catch (error: any) {
    console.error("Gemini error:", error);

    if (error?.message?.includes("429")) {
      throw new AppError(
        "Gemini rate limit exceeded",
        429,
        "GEMINI_RATE_LIMIT"
      );
    }

    if (error?.message?.includes("401") || error?.message?.includes("403")) {
      throw new AppError(
        "Invalid Gemini API key",
        401,
        "GEMINI_AUTH_ERROR"
      );
    }

    throw new AppError(
      "Gemini service unavailable",
      502,
      "GEMINI_FAILURE"
    );
  }
}
