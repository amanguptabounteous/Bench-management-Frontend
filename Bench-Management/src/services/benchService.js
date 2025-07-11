// // src/services/benchService.js
// import apiClient from "../api/apiClinet";
// export async function fetchBenchDetails() {
//   try {
//     const response = await apiClient.get("/bms/details");
//     return response.data;
//   } catch (error) {
//     console.error("Failed to fetch bench details:", error);
//     throw error;
//   }
// }

// export async function fetchEmployeeById(empId) {
//   try {
//     const response = await apiClient.get(`/bms/details/${empId}`);
//     return response.data;
//   } catch (error) {
//     console.error(`Failed to fetch employee with ID ${empId}:`, error);
//     throw error;
//   }
// }

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

// --- ADDED: Fetch employees by bench end date range for Generate Report ---
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