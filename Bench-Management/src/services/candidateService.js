import apiClient from "../api/apiClinet"; // Ensure this path is correct for your project structure

/**
 * Adds a new candidate to the bench manually.
 * @param {object} candidateData - An object containing all the details of the new candidate.
 * @returns {Promise<object>} A promise that resolves to the newly created candidate object from the server.
 */
export async function addCandidateManually(candidateData) {
  try {
    // This corresponds to your POST bms/candidate endpoint
    const response = await apiClient.post("/bms/candidate", candidateData);
    return response.data;
  } catch (error) {
    console.error("Failed to add candidate manually:", error.response?.data || error.message);
    // Re-throw the error's response data if available for better feedback in the component
    throw new Error(error.response?.data || "An unexpected error occurred while adding the candidate.");
  }
}
