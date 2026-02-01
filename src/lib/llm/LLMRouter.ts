import { callGemini } from "./callGemini";
import { isLocalLLMActive } from "./checkLocalLLM";
import { callLocalLLM } from "./localLLM";

export async function runLLM(prompt: string) {
  console.log("Running LLM with prompt:");
  if (await isLocalLLMActive()) {
    try {
      return {
        provider: "local",
        text: (await callLocalLLM(prompt)).response,
      };
    } catch (err) {
      console.log(err)
      console.warn("Local LLM failed, falling back to Gemini");
    }
  }

  console.log("Running gemini with prompt:");
  try {
    const res = await callGemini(prompt);
    return {
      provider: "gemini",
      text: res.text,
    };
  } catch (err) {
    throw err; 
  }
}
