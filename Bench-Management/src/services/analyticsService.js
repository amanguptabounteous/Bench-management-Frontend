import apiClient from "../api/apiClinet";

/**
 * Fetches the detailed assessment analytics for a single employee.
 * @param {number | string} empId - The ID of the employee.
 * @returns {Promise<Object>} The assessment analytics data.
 */
export async function fetchAssessmentByEmpId(empId) {
  try {
    const response = await apiClient.get(`/bms/analytics/employee/${empId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch assessment for employee with ID ${empId}:`, error);
    throw error;
  }
}

/**
 * Fetches an analytics report for all employees related to a main topic.
 * @param {string} mainTopic - The main topic to generate a report for (e.g., "Java").
 * @returns {Promise<Array>} A list of employees with their performance data.
 */
export async function fetchReportByMainTopic(mainTopic) {
  try {
    const response = await apiClient.get(`/bms/analytics/report/main-topic/${mainTopic}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch report for main topic "${mainTopic}":`, error);
    throw error;
  }
}

/**
 * Fetches an analytics report for all employees related to a specific sub-topic.
 * @param {string} topic - The sub-topic to generate a report for (e.g., "OOPs").
 * @returns {Promise<Array>} A list of employees with their performance data.
 */
export async function fetchReportByTopic(topic) {
  try {
    const response = await apiClient.get(`/bms/analytics/report/topic/${topic}`);
    return response.data;
  } catch (error)
 {
    console.error(`Failed to fetch report for topic "${topic}":`, error);
    throw error;
  }
}

/**
 * Fetches the top performer for a given main topic.
 * NOTE: This endpoint returns a string, not JSON.
 * @param {string} mainTopic - The main topic (e.g., "Java").
 * @returns {Promise<string>} A string describing the top performer.
 */
export async function fetchTopPerformerByMainTopic(mainTopic) {
  try {
    const response = await apiClient.get(`/bms/analytics/top-performer/main-topic/${mainTopic}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch top performer for main topic "${mainTopic}":`, error);
    throw error;
  }
}

/**
 * Fetches the top performer for a given sub-topic.
 * NOTE: This endpoint returns a string, not JSON.
 * @param {string} topic - The sub-topic (e.g., "OOPs").
 * @returns {Promise<string>} A string describing the top performer.
 */
export async function fetchTopPerformerByTopic(topic) {
  try {
    const response = await apiClient.get(`/bms/analytics/top-performer/${topic}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch top performer for topic "${topic}":`, error);
    throw error;
  }
}
