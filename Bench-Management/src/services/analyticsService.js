import apiClient from "../api/apiClinet";

// ================================================================================= --
// Assessment & Report Analytics
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
  } catch (error) {
    console.error(`Failed to fetch report for topic "${topic}":`, error);
    throw error;
  }
}

/**
 * Fetches the top performer for a given main topic.
 * NOTE: This endpoint may return a string or object.
 * @param {string} mainTopic - The main topic (e.g., "Java").
 * @returns {Promise<string|Object>} A string or object describing the top performer.
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
 * NOTE: This endpoint may return a string or object.
 * @param {string} topic - The sub-topic (e.g., "OOPs").
 * @returns {Promise<string|Object>} A string or object describing the top performer.
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
// Bench Management Analytics
// ================================================================================= --

/**
 * Fetches the daily bench status (on bench vs. left bench) for a given date range.
 * @param {string} startDate - The start date in 'YYYY-MM-DD' format.
 * @param {string} endDate - The end date in 'YYYY-MM-DD' format.
 * @returns {Promise<Object>} An object mapping dates to onBench/leftBench counts.
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
 * Fetches the monthly bench status (on bench vs. left bench) for a given date range.
 * @param {string} startDate - The start date in 'YYYY-MM-DD' format.
 * @param {string} endDate - The end date in 'YYYY-MM-DD' format.
 * @returns {Promise<Object>} An object mapping month-year strings to onBench/leftBench counts.
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

// ================================================================================= --
// ✨ NEW FUNCTIONS FOR TOPIC MANAGEMENT ✨
// ================================================================================= --

/**
 * Fetches a list of all main topics.
 * @returns {Promise<Array>} A list of main topic objects or strings.
 */
export async function fetchAllMainTopics() {
  try {
    const response = await apiClient.get('/api/topics/main');
    return response.data;
  } catch (error) {
    console.error("Failed to fetch all main topics:", error);
    throw error;
  }
}

/**
 * Fetches all sub-topics associated with a given main topic.
 * @param {string} mainTopicName - The name of the main topic.
 * @returns {Promise<Array>} A list of sub-topic objects or strings.
 */
export async function fetchSubTopicsByMainTopic(mainTopicName) {
  try {
    // Ensure mainTopicName is provided to prevent calling /api/topics/undefined
    if (!mainTopicName) {
      console.warn("fetchSubTopicsByMainTopic called without a mainTopicName.");
      return []; // Return empty array if no main topic is specified
    }
    const response = await apiClient.get(`/api/topics/${mainTopicName}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch sub-topics for "${mainTopicName}":`, error);
    throw error;
  }
}