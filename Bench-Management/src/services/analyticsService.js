import apiClient from "../api/apiClinet";

// ================================================================================= --
// Existing Functions (Unchanged)
// ================================================================================= --

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

/**
 * Fetches bench employees within a given date range for the reports table.
 * @param {string} startDate - The start date in 'YYYY-MM-DD' format.
 * @param {string} endDate - The end date in 'YYYY-MM-DD' format.
 * @returns {Promise<Array>} A list of employee data objects.
 */
export async function fetchBenchEmployeesForReport(startDate, endDate) {
  try {
    const response = await apiClient.get('/bms/analytics/employees', {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch bench employees for report:", error);
    throw error;
  }
}

/**
 * Fetches the total number of employees on the bench for the last N months.
 * @param {number} months - The number of past months to include in the trend.
 * @returns {Promise<Object>} An object mapping month-year to employee count (e.g., {"Jul 2024": 20}).
 */
export async function fetchBenchTrend(months) {
  try {
    const response = await apiClient.get('/bms/analytics/trend', {
      params: { months }
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch bench trend data:", error);
    throw error;
  }
}

/**
 * Fetches the distribution of employees by their current status within a date range.
 * @param {string} startDate - The start date in 'YYYY-MM-DD' format.
 * @param {string} endDate - The end date in 'YYYY-MM-DD' format.
 * @returns {Promise<Object>} An object mapping status to employee count (e.g., {"On Bench": 12}).
 */
export async function fetchStatusDistribution(startDate, endDate) {
  try {
    const response = await apiClient.get('/bms/analytics/status-distribution', {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch status distribution data:", error);
    throw error;
  }
}

/**
 * Fetches the distribution of employees by their aging days on the bench.
 * @param {string} startDate - The start date in 'YYYY-MM-DD' format.
 * @param {string} endDate - The end date in 'YYYY-MM-DD' format.
 * @returns {Promise<Object>} An object mapping aging buckets to employee count (e.g., {"0-30 days": 8}).
 */
export async function fetchAgingAnalysis(startDate, endDate) {
  try {
    const response = await apiClient.get('/bms/analytics/aging-analysis', {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch aging analysis data:", error);
    throw error;
  }
}

/**
 * Fetches a consolidated report grouped by all main topics.
 * @returns {Promise<Array>} A list of main topics with their aggregated performance data.
 */
export async function fetchAllReportsByMainTopic() {
    try {
        const response = await apiClient.get('/bms/analytics/report/by-main-topic');
        return response.data;
    } catch (error) {
        console.error("Failed to fetch consolidated report by main topic:", error);
        throw error;
    }
}

/**
 * Fetches a consolidated report grouped by all sub-topics.
 * @returns {Promise<Array>} A list of sub-topics with their aggregated performance data.
 */
export async function fetchAllReportsByTopic() {
    try {
        const response = await apiClient.get('/bms/analytics/report/by-topic');
        return response.data;
    } catch (error) {
        console.error("Failed to fetch consolidated report by topic:", error);
        throw error;
    }
}

// ================================================================================= --
// ✨ NEW FUNCTIONS FOR GENERATE REPORT PAGE ✨
// ================================================================================= --

/**
 * Fetches the daily bench status (joined vs. released) for a given date range.
 * @param {string} startDate - The start date in 'YYYY-MM-DD' format.
 * @param {string} endDate - The end date in 'YYYY-MM-DD' format.
 * @returns {Promise<Object>} An object mapping dates to join/release counts.
 */
export async function fetchDailyBenchStatus(startDate, endDate) {
  try {
    const response = await apiClient.get('/bms/analytics/bench-status/daily', {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch daily bench status:", error);
    throw error;
  }
}

/**
 * Fetches the monthly bench status (joined vs. released) for a given date range.
 * @param {string} startDate - The start date in 'YYYY-MM-DD' format.
 * @param {string} endDate - The end date in 'YYYY-MM-DD' format.
 * @returns {Promise<Object>} An object mapping month-year strings to join/release counts.
 */
export async function fetchMonthlyBenchStatus(startDate, endDate) {
  try {
    const response = await apiClient.get('/bms/analytics/bench-status/monthly', {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch monthly bench status:", error);
    throw error;
  }
}
  