import apiClient from "../api/apiClinet"; // Assuming apiClient is in this location

/**
 * This service file is dedicated to fetching data from the new, consolidated
 * dashboard analytics endpoints. Each function returns both the aggregated
 * counts and the detailed candidate lists for bench and assessment reports.
 */

// ===================================================================================
// Bench Management Analytics
// ===================================================================================

/**
 * Fetches the master list of all candidates with their details.
 * Corresponds to: /bms/analytics/employees/with-details
 * @returns {Promise<Object>} The full API response including counts and a list of all candidates.
 */
export async function fetchEmployeesWithDetails() {
  try {
    const response = await apiClient.get("/bms/analytics/employees/with-details");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch employees with details:", error);
    throw error;
  }
}

/**
 * Fetches the bench trend (count of employees) over a specified number of months.
 * Corresponds to: /bms/analytics/trend/with-details
 * @param {number} months - The number of past months to include in the trend analysis.
 * @returns {Promise<Object>} The full API response including trend counts and candidate lists.
 */
export async function fetchTrendWithDetails(months = 6) {
  try {
    const response = await apiClient.get("/bms/analytics/trend/with-details", {
      params: { months }
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch trend for the last ${months} months:`, error);
    throw error;
  }
}

/**
 * Fetches the distribution of employee statuses for a given date range.
 * Corresponds to: /bms/analytics/status-distribution/with-details
 * @param {string} startDate - The start date in 'YYYY-MM-DD' format.
 * @param {string} endDate - The end date in 'YYYY-MM-DD' format.
 * @returns {Promise<Object>} The full API response including status counts and candidate lists.
 */
export async function fetchStatusDistributionWithDetails(startDate, endDate) {
  try {
    const response = await apiClient.get("/bms/analytics/status-distribution/with-details", {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch status distribution details:", error);
    throw error;
  }
}

/**
 * Fetches the bench aging analysis for a given date range.
 * Corresponds to: /bms/analytics/aging-analysis/with-details
 * @param {string} startDate - The start date in 'YYYY-MM-DD' format.
 * @param {string} endDate - The end date in 'YYYY-MM-DD' format.
 * @returns {Promise<Object>} The full API response including aging counts and candidate lists.
 */
export async function fetchAgingAnalysisWithDetails(startDate, endDate) {
  try {
    const response = await apiClient.get("/bms/analytics/aging-analysis/with-details", {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch aging analysis details:", error);
    throw error;
  }
}

/**
 * Fetches the daily on-bench vs. left-bench status for a given date range.
 * Corresponds to: /bms/analytics/bench-status/daily/with-details
 * @param {string} startDate - The start date in 'YYYY-MM-DD' format.
 * @param {string} endDate - The end date in 'YYYY-MM-DD' format.
 * @returns {Promise<Object>} The full API response including daily counts and candidate lists.
 */
export async function fetchDailyBenchStatusWithDetails(startDate, endDate) {
  try {
    const response = await apiClient.get("/bms/analytics/bench-status/daily/with-details", {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch daily bench status details:", error);
    throw error;
  }
}

/**
 * Fetches the monthly on-bench vs. left-bench status for a given date range.
 * Corresponds to: /bms/analytics/bench-status/monthly/with-details
 * @param {string} startDate - The start date in 'YYYY-MM-DD' format.
 * @param {string} endDate - The end date in 'YYYY-MM-DD' format.
 * @returns {Promise<Object>} The full API response including monthly counts and candidate lists.
 */
export async function fetchMonthlyBenchStatusWithDetails(startDate, endDate) {
  try {
    const response = await apiClient.get("/bms/analytics/bench-status/monthly/with-details", {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch monthly bench status details:", error);
    throw error;
  }
}


// ===================================================================================
// Assessment & Competency Analytics
// ===================================================================================

/**
 * Fetches the average proficiency score for each primary skill.
 * Corresponds to: /bms/analytics/skill-proficiency
 * @returns {Promise<Array>} A list of skill objects with their average scores.
 */
export async function fetchSkillProficiency() {
  try {
    const response = await apiClient.get("/bms/analytics/skill-proficiency");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch skill proficiency:", error);
    throw error;
  }
}

/**
 * Fetches a detailed breakdown of proficiency for sub-topics within a main topic.
 * Corresponds to: /bms/analytics/skill-proficiency/sub-topics/{mainTopic}
 * @param {string} mainTopic - The main topic to get the sub-topic breakdown for.
 * @returns {Promise<Array>} A list of sub-topic objects with their average scores.
 */
export async function fetchSubTopicProficiency(mainTopic) {
  try {
    const response = await apiClient.get(`/bms/analytics/skill-proficiency/sub-topics/${mainTopic}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch sub-topic proficiency for ${mainTopic}:`, error);
    throw error;
  }
}

/**
 * Fetches the leaderboard of top performers for a specific main topic.
 * Corresponds to: /bms/analytics/leaderboard/{mainTopic}
 * @param {string} mainTopic - The main topic for the leaderboard.
 * @returns {Promise<Array>} A sorted list of top-performing employees for that skill.
 */
export async function fetchLeaderboard(mainTopic) {
  try {
    const response = await apiClient.get(`/bms/analytics/leaderboard/${mainTopic}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch leaderboard for ${mainTopic}:`, error);
    throw error;
  }
}

/**
 * Fetches a list of employees who need support based on low scores or overdue assessments.
 * Corresponds to: /bms/analytics/needs-support
 * @param {Object} params - Optional query parameters.
 * @param {string} params.mainTopic - Filter by a specific skill.
 * @param {number} params.scoreThreshold - The score below which employees are flagged.
 * @returns {Promise<Array>} A list of employees flagged as needing support.
 */
export async function fetchNeedsSupport(params = {}) {
  try {
    const response = await apiClient.get("/bms/analytics/needs-support", { params });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch employees needing support:", error);
    throw error;
  }
}

/** 
* Fetches a single candidate's scores for all their subtopics, along with the average score for each.
 * Corresponds to: /bms/scores/candidate/{empId}/subtopics
 * @param {string | number} empId - The employee ID of the candidate.
 * @returns {Promise<Array>} A list of subtopic objects with the candidate's marks and the average marks.
 */
export async function fetchCandidateSubtopicScores(empId) {
  try {
    const response = await apiClient.get(`/bms/scores/candidate/${empId}/subtopics`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch subtopic scores for employee ${empId}:`, error);
    throw error;
  }
}
