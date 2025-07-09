// src/services/scoreService.js
import apiClient from "../api/apiClinet";

export async function fetchEmployeeScore(empId) {
  try {
    const response = await apiClient.get(`/bms/scores/filter`, {
      params: { empId }
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch employee score for ID ${empId}:`, error);
    throw error;
  }
}

export async function fetchAllEmployeeScoresbyTopic(topic) {
  try {
    const response = await apiClient.get(`/bms/scores/filter`, {
      params: { topic }
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch employee scores for topic ${topic}:`, error);
    throw error;
  }
}
