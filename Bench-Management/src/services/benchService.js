// src/services/benchService.js
import apiClient from "../api/apiClinet";
export async function fetchBenchDetails() {
  try {
    const response = await apiClient.get("/bms/details");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch bench details:", error);
    throw error;
  }
}

export async function fetchEmployeeById(empId) {
  try {
    const response = await apiClient.get(`/bms/details/${empId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch employee with ID ${empId}:`, error);
    throw error;
  }
}
