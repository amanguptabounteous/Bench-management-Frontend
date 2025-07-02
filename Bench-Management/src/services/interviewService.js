const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export async function fetchInterviewCyclebyEmpId(empId) {
  try {
    const response = await fetch(`${BASE_URL}/bms/interviews/${empId}/cycles-details`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch interview cycle for employee ID ${empId}:`, error);
    throw error;
  }
}

export async function fetchInterviewRoundsbyCycleId(cycleId) {
  try {
    const response = await fetch(`${BASE_URL}/bms/interviews/cycles/${cycleId}/details`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch interview rounds for cycle ID ${cycleId}:`, error);
    throw error;
  }
}