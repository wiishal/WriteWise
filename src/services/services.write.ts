import axios from "axios";
import { Analysis, UserWriting } from "../types/type";

export async function getAnalysis(userWriting: UserWriting) {
  try {
    const responce = await axios.post("/api/write/analyze", userWriting);
    return responce.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.data) {
      return error.response.data;
    }
    throw error;
  }
}

export async function saveAnalysis(analysis: Analysis) {
  try {
    const responce = await axios.post("/api/write/saveAnalysis", analysis);
    return responce.data
  } catch (error:any) {
    if (axios.isAxiosError(error) && error.response?.data) {
      return error.response.data;
    }
    throw error;
  
  }
}
// api/writing/progress