// src/services/interviewService.js
import apiClient from "../api/apiClinet";

export async function fetchInterviewCyclebyEmpId(empId) {
  try {
    const response = await apiClient.get(`/bms/interviews/${empId}/cycles-details`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch interview cycle for employee ID ${empId}:`, error);
    throw error;
  }
}

export async function fetchInterviewRoundsbyCycleId(cycleId) {
  try {
    const response = await apiClient.get(`/bms/interviews/cycles/${cycleId}/details`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch interview rounds for cycle ID ${cycleId}:`, error);
    throw error;
  }
}
