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

// Partial update for a candidate
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

// ✨ --- NEW FUNCTIONS FOR MANAGING REMARKS --- ✨

/**
 * Creates a new remark for a specific candidate.
 * @param {number} empId - The ID of the employee to add the remark to.
 * @param {string} remarkText - The text of the new remark.
 * @returns {Promise<Object>} A promise that resolves to the newly created remark object (e.g., {id, text, date}).
 */
export async function createRemarkForCandidate(empId, remarkText) {
  try {
    const remarkDTO = { text: remarkText };
    // This maps to your @PostMapping("/{empId}") endpoint
    const response = await apiClient.post(`/bms/remarks/${empId}`, remarkDTO);
    return response.data;
  } catch (error) {
    console.error(`Failed to create remark for employee ${empId}:`, error);
    throw error;
  }
}

/**
 * Deletes a specific remark by its unique ID.
 * @param {number} remarkId - The unique ID of the remark to delete.
 * @returns {Promise<void>} A promise that resolves when the deletion is successful.
 */
export async function deleteRemark(remarkId) {
  try {
    // This maps to your @DeleteMapping("/{remarkId}") endpoint
    await apiClient.delete(`/bms/remarks/${remarkId}`);
  } catch (error) {
    console.error(`Failed to delete remark ${remarkId}:`, error);
    throw error;
  }
}