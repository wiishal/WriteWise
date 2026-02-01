import { Analysis, UserWriting } from "../types/type";
import { getAnalysis, saveAnalysis } from "@/services/services.write";

export async function getAnalysisController(userWriting: UserWriting) {
  try {
    if (!userWriting.subject?.trim() || !userWriting.writing?.trim()) {
      return {
        success: false,
        message: "Subject and writing are required",
      };
    }

    const response = await getAnalysis(userWriting);
    if (!response.success) {
      return {
        success: false,
        message: response.error.message,
      };
    }

    return {
      success: true,
      analysis: response.analysis,
    };
  } catch (error) {
    console.error("Controller error:", error);
    return {
      success: false,
      message: "Network or server error",
    };
  }

}

export async function saveAnalysisController(analysis :Analysis) {
  try {
    const response = await saveAnalysis(analysis)
    if(!response.success){
      return {
        success:false,
        message:response.error.message
      }
    }

    return {
      success:true,
      message:"Analysis saved!"
    }
  } catch (error) {
    return {
      success:false,
      message:"Network or server error"
    }
  }
}
