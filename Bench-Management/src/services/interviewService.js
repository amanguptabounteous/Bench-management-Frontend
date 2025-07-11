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

// ✅ NEW: Add interview cycle
export async function addInterviewCycle(empId, cycleData) {
  try {
    const response = await apiClient.post(`/bms/interviews/${empId}/cycles-add`, cycleData);
    return response.data;
  } catch (error) {
    console.error(`Failed to add interview cycle for employee ID ${empId}:`, error);
    throw error;
  }
}

// ✅ NEW: Add interview round to a cycle
export async function addInterviewRound(cycleId, roundData) {
  try {
    const response = await apiClient.post(`/bms/interviews/cycles/${cycleId}/add`, roundData);
    return response.data;
  } catch (error) {
    console.error(`Failed to add interview round to cycle ${cycleId}:`, error);
    throw error;
  }
}
