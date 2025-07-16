import apiClient from "../api/apiClinet";

// Fetch all bench details
export async function fetchBenchDetails() {
  try {
    const response = await apiClient.get("/bms/details");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch bench details:", error);
    throw error;
  }
}

// Fetch a single employee by ID
export async function fetchEmployeeById(empId) {
  try {
    const response = await apiClient.get(`/bms/details/${empId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch employee with ID ${empId}:`, error);
    throw error;
  }
}

// Fetch employees by bench end date range
export async function fetchEmployeesByBenchEndDateRange(start, end) {
  try {
    const response = await apiClient.get("/bms/details/bench-end-date-range", {
      params: { start, end }
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch employees by bench end date range:", error);
    throw error;
  }
}

// --- NEW: Partial update for a candidate ---
/**
 * Partially updates a candidate.
 * @param {number} id - The emp_id of the candidate to update.
 * @param {Object} updateDTO - Object with fields to update.
 * @returns {Promise<Object>} The updated candidate.
 */
export async function updateCandidate(id, updateDTO) {
  try {
    const response = await apiClient.patch(
      `/bms/candidate/update/${id}`,
      updateDTO,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to update candidate with ID ${id}:`, error.response?.data || error.message);
    throw error;
  }
}
