import apiClient from "../api/apiClinet";

// ----------------------------------------------------------------
// ✨ NEW SERVER-SIDE FILTERING & PAGINATION FUNCTIONS
// ----------------------------------------------------------------

/**
 * Fetches a paginated and filtered list of candidates from the backend.
 * @param {object} filters - An object containing all filter, sort, and pagination parameters.
 * @param {number} [filters.page=0] - The page number to retrieve.
 * @param {number} [filters.size=20] - The number of items per page.
 * @param {string} [filters.sort='agingDays,desc'] - The sorting parameter (e.g., 'name,asc').
 * @param {string[]} [filters.level] - Array of levels to filter by.
 * @param {string[]} [filters.personStatus] - Array of statuses to filter by.
 * @param {string[]} [filters.primarySkill] - Array of primary skills to filter by.
 * @param {string} [filters.dojStart] - Start date for DOJ range.
 * @param {string} [filters.dojEnd] - End date for DOJ range.
 * @param {string[]} [filters.baseLocation] - Array of locations to filter by.
 * @param {string[]} [filters.yoe] - Array of experience ranges (e.g., ['0-2', '3-5']).
 * @param {boolean} [filters.isDeployable] - Filter by deployable status.
 * @param {string} [filters.blockedBy] - Filter by blocker.
 * @param {string[]} [filters.client] - Array of clients to filter by.
 * @param {string[]} [filters.agingCategory] - Array of aging categories.
 * @returns {Promise<Object>} A promise that resolves to the paginated API response (includes content, totalPages, etc.).
 */
export async function fetchBenchDetailsWithFilters(filters = {}) {
    try {
        // The URLSearchParams object makes it easy to build the query string,
        // especially for arrays where you need multiple params with the same key.
        const params = new URLSearchParams();

        // Append all filter parameters to the query string
        Object.entries(filters).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                // For arrays, append each value separately
                value.forEach(item => params.append(key, item));
            } else if (value !== null && value !== undefined && value !== '') {
                // For other non-empty values
                params.append(key, value);
            }
        });

        const response = await apiClient.get("/bms/filter/details", { params });
        return response.data; // The response includes content, totalPages, totalElements, etc.
    } catch (error) {
        console.error("Failed to fetch filtered bench details:", error);
        throw error;
    }
}


/**
 * Fetches all available options for the filter sidebar.
 * @returns {Promise<Object>} A promise that resolves to an object containing arrays of filter options (levels, skills, etc.).
 */
export async function fetchFilterOptions() {
    try {
        const response = await apiClient.get("/bms/filter/options");
        return response.data;
    } catch (error) {
        console.error("Failed to fetch filter options:", error);
        throw error;
    }
}


// ----------------------------------------------------------------
// DEPRECATED & EXISTING FUNCTIONS
// ----------------------------------------------------------------

/**
 * @deprecated This function fetches all data at once and should be replaced
 * by fetchBenchDetailsWithFilters for better performance.
 */
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
            updateDTO, {
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

/**
 * Creates a new remark for a specific candidate.
 * @param {number} empId - The ID of the employee to add the remark to.
 * @param {string} remarkText - The text of the new remark.
 * @returns {Promise<Object>} A promise that resolves to the newly created remark object.
 */
export async function createRemarkForCandidate(empId, remarkText) {
    try {
        const remarkDTO = { text: remarkText };
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
        await apiClient.delete(`/bms/remarks/${remarkId}`);
    } catch (error) {
        console.error(`Failed to delete remark ${remarkId}:`, error);
        throw error;
    }
}
