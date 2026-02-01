
import axios from "axios";

export async function logUserId() {
  try {
    const res = await axios.post("/api/user/sync");
    return res.data;
  } catch (error:any) {
    if (axios.isAxiosError(error) && error.response?.data) {
      return error.response.data;
    }
    throw error;
  }
}
export async function fetchUserProgress() {
  try {
    const res = await axios.get("/api/user/sync");
    return res.data;
  } catch (error:any) {
    if (axios.isAxiosError(error) && error.response?.data) {
      return error.response.data;
    }
    throw error;
  }
}

export async function fetchUserWritingProgress() {
  try {
    const res = await axios.get("/api/user/progress");
    return res.data;
  } catch (error:any) {
    if (axios.isAxiosError(error) && error.response?.data) {
      return error.response.data;
    }
    throw error;
  }
}