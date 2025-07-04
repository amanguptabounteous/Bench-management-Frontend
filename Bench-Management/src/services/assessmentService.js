const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export async function fetchAllAssessments() {
  try {
    const response = await fetch(`${BASE_URL}/bms/assessments`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch assessments:", error);
    throw error;
  }
}