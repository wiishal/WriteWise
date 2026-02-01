// lib/checkLocalLLM.ts
export async function isLocalLLMActive(): Promise<boolean> {
  try {
    const res = await fetch("http://localhost:11434/api/tags", {
      method: "GET",
      signal: AbortSignal.timeout(1500),
    });

    return res.ok;
  } catch (err) {
    return false;
  }
}
