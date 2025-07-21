// src/services/assessmentService.js
import apiClient from "../api/apiClinet";

export async function fetchAllAssessments() {
  try {
    const response = await apiClient.get("/bms/assessments");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch assessments:", error);
    throw error;
  }
}

