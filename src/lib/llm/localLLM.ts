import { AppError } from "../error/error";

export async function callLocalLLM(prompt: string) {
  let res: Response;

  try {
    res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(10_000), // 10s timeout
      body: JSON.stringify({
        model: "llama3",
        prompt,
        stream: false,
      }),
    });
  } catch (err) {
    throw new AppError(
      "Local LLM is unreachable",
      503,
      "LOCAL_LLM_DOWN"
    );
  }

  if (!res.ok) {
    throw new AppError(
      "Local LLM responded with an error",
      502,
      "LOCAL_LLM_ERROR"
    );
  }

  let data: any;
  try {
    data = await res.json();
  } catch {
    throw new AppError(
      "Local LLM returned invalid JSON",
      502,
      "LOCAL_LLM_BAD_RESPONSE"
    );
  }

  if (!data?.response) {
    throw new AppError(
      "Local LLM returned empty response",
      502,
      "LOCAL_LLM_EMPTY_RESPONSE"
    );
  }

  return data;
}
