const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export async function fetchEmployeeScore(empId) {
  try {
    const response = await fetch(`${BASE_URL}/bms/scores/filter?empId=${empId}`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch employee score for ID ${empId}:`, error);
    throw error;
  }
}