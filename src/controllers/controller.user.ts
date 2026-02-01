
import { fetchUserProgress, fetchUserWritingProgress, logUserId } from "../services/service.user";

//log user 
export async function logUserIdController() {
  try {
    const responce = await logUserId();
    if (!responce.success) {
      return { success: false, message: responce.error.message };
    }
    return { success: true, message: "User ID logged successfully" };
  } catch (error) {
    console.error("Error while logging user ID", error);
    return { success: false, message: "Network error occur" };
  }
}
// fetchUserProgress
export async function fetchUserProgressController() {
  try {
    const responce = await fetchUserProgress();
    if (!responce.success) {
      return { success: false, message: responce.error.message };
    }
    return { success: true, userProgress: responce.userProgress };
  } catch (error) {
    console.error("Error while getting user progress", error);
    return { success: false, message: "Network error occur" };
  }
}

export async function fetchUserWritingProgressController() {
  try {
    const responce = await fetchUserWritingProgress();
    if (!responce.success) {
      return { success: false, message: responce.error.message };
    }
    return { success: true, progress: responce.progress };
  } catch (error) {
    console.error("Error while getting user progress", error);
    return { success: false, message: "Network error occur" };
  }
}
  
// progress