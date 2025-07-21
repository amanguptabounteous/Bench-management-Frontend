import apiClient from "../api/apiClinet";
export async function fetchFeedbackbyId(empId) {
  try {
    const response = await apiClient.get(`/bms/feedback/${empId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch employee with ID ${empId}:`, error);
    throw error;
  }
}