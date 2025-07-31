// src/services/mentorService.js

import apiClient from "../api/apiClinet"; // Adjust the import path to your apiClient configuration

/**
 * Adds a new mentor feedback entry for a specific employee.
 * Corresponds to: POST /bms/mentor-feedback/{empId}
 * @param {string|number} empId - The ID of the employee to add feedback for.
 * @param {string} feedbackText - The content of the feedback.
 * @returns {Promise<Object>} The newly created feedback object returned from the API.
 */
export async function addMentorFeedback(empId, feedbackText) {
    try {
        // The request body must match the format expected by the backend
        const payload = {
            mentor_feedback: feedbackText
        };
        const response = await apiClient.post(`/bms/mentor-feedback/${empId}`, payload);
        return response.data;
    } catch (error) {
        console.error(`Failed to add mentor feedback for employee ${empId}:`, error);
        // Re-throw the error so the component can handle it
        throw error;
    }
}

/**
 * Retrieves all mentor feedback for a specific candidate.
 * Corresponds to: GET /bms/mentor-feedback/candidate/{empId}
 * @param {string|number} empId - The ID of the employee (candidate).
 * @returns {Promise<Array>} A list of mentor feedback objects.
 */
export async function getFeedbacksByCandidate(empId) {
    try {
        const response = await apiClient.get(`/bms/mentor-feedback/candidate/${empId}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to get mentor feedback for candidate ${empId}:`, error);
        throw error;
    }
}

/**
 * Updates an existing mentor feedback entry.
 * Corresponds to: PUT /bms/mentor-feedback/{feedbackId}
 * @param {string|number} feedbackId - The ID of the feedback entry to update.
 * @param {string} feedbackText - The updated content of the feedback.
 * @returns {Promise<Object>} The updated feedback object from the API.
 */
export async function updateMentorFeedback(feedbackId, feedbackText) {
    try {
        const payload = {
            mentor_feedback: feedbackText
        };
        const response = await apiClient.put(`/bms/mentor-feedback/${feedbackId}`, payload);
        return response.data;
    } catch (error) {
        console.error(`Failed to update mentor feedback ${feedbackId}:`, error);
        throw error;
    }
}

/**
 * Deletes a mentor feedback entry.
 * Corresponds to: DELETE /bms/mentor-feedback/{feedbackId}
 * @param {string|number} feedbackId - The ID of the feedback to delete.
 * @returns {Promise<string>} A success message from the API.
 */
export async function deleteMentorFeedback(feedbackId) {
    try {
        const response = await apiClient.delete(`/bms/mentor-feedback/${feedbackId}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to delete mentor feedback ${feedbackId}:`, error);
        throw error;
    }
}

/**
 * Retrieves all feedbacks given by a specific trainer.
 * Corresponds to: GET /bms/mentor-feedback/trainer/{trainerId}
 * @param {string|number} trainerId - The employee ID of the trainer.
 * @returns {Promise<Array>} A list of mentor feedback objects.
 */
export async function getFeedbacksByTrainer(trainerId) {
    try {
        const response = await apiClient.get(`/bms/mentor-feedback/trainer/${trainerId}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to get mentor feedback for trainer ${trainerId}:`, error);
        throw error;
    }
}
