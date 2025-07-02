// benchService.js

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";


export async function fetchBenchDetails() {
  try {
    const response = await fetch(`${BASE_URL}/bms/details`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch bench details:", error);
    throw error;
  }
}

export async function fetchEmployeeById(empId) {
  try {
    const response = await fetch(`${BASE_URL}/bms/details/${empId}`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch employee with ID ${empId}:`, error);
    throw error;
  }
}
