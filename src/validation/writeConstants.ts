import * as z from "zod";

//feedback string can be 30-100 words
export const saveAnalysisConstant = z.object({
  clarityScore: z.number().min(1).max(100),
  structureScore: z.number().min(1).max(100),
  grammerScore: z.number().min(1).max(100),
  feedback: z.string(),
  subject: z.string(),
  userWritings:z.string()
});
