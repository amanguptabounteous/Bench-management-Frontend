import apiClient from "../api/apiClinet"; // Ensure this path is correct for your project structure

/**
 * Registers a new admin user.
 * @param {string} email - The email for the new admin.
 * @param {string} password - The password for the new admin.
 * @returns {Promise<string>} A promise that resolves to the success message from the server.
 */
export async function registerAdmin(email, password) {
  try {
    const loginRequest = { email, password };
    // Corresponds to @PostMapping("/register")
    const response = await apiClient.post("/bms/admin/register", loginRequest);
    return response.data;
  } catch (error) {
    console.error("Failed to register admin:", error.response?.data || error.message);
    // Re-throw the error's response data if available, otherwise the generic error
    throw new Error(error.response?.data || "An unexpected error occurred during admin registration.");
  }
}

/**
 * Adds a new pre-approved email for a trainer.
 * @param {string} email - The trainer's email to add.
 * @returns {Promise<string>} A promise that resolves to the success message from the server.
 */
export async function addTrainerEmail(email) {
  try {
    const preApprovedEmailRequest = { email };
    // Corresponds to @PostMapping("/add-trainer-email")
    const response = await apiClient.post("/bms/admin/add-trainer-email", preApprovedEmailRequest);
    return response.data;
  } catch (error) {
    console.error("Failed to add trainer email:", error.response?.data || error.message);
    throw new Error(error.response?.data || "An unexpected error occurred while adding the trainer's email.");
  }
}

/**
 * Fetches all pre-approved trainer emails.
 * @returns {Promise<Array>} A promise that resolves to a list of trainer email objects.
 */
export async function getAllTrainerEmails() {
    try {
        // Corresponds to @GetMapping("/trainer-emails")
        const response = await apiClient.get("/bms/admin/trainer-emails");
        return response.data;
    } catch (error) {
        console.error("Failed to fetch trainer emails:", error.response?.data || error.message);
        throw new Error(error.response?.data || "An unexpected error occurred while fetching trainer emails.");
    }
}

export async function synchBenchwithApi(){
  try {
    // Corresponds to @GetMapping("/external-candidates")
    const response = await apiClient.get("/bms/external-candidates");
    return response.data;
  } catch (error) {
    console.error("Failed to synchronize bench with API:", error.response?.data || error.message);
    throw new Error(error.response?.data || "An unexpected error occurred while synchronizing the bench.");
  }
}

export async function synchAssessmentToDatabase() {
  try {
    // Call the external link to trigger the sync
    const response = await fetch("https://prod-57.westus.logic.azure.com:443/workflows/415702528a9e46869f5c1efc370f9076/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=LJl1TQnsdQdHQmzc1j08KsmcuOHpmt8_UzN__2-hwoM", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ refresh: true }) // Send the required payload
    });

    // Check if the request was successful
    if (!response.ok) {
        // Throw an error with the status text to be caught by the catch block
        throw new Error(`Request failed with status: ${response.status} ${response.statusText}`);
    }

    // Return the response text, as in the example
    return await response.text();
  } catch (error) {
    console.error("Failed to synchronize assessment with database:", error.message);
    throw new Error("An unexpected error occurred while synchronizing the assessment.");
  }
}