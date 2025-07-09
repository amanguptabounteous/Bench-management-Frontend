// src/services/trainingService.js
import apiClient from "../api/apiClinet";

export async function fetchTrainingDetailsbyempID(empId) {
  try {
    const response = await apiClient.get(`/bms/trainings/employee/${empId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch training details for employee ID ${empId}:`, error);
    throw error;
  }
}
