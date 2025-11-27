import { API_ENDPOINTS } from "@/config/apiConfig";
import axiosInstance from "./axiosInterceptor";
// Admin issue services
export const getIssues = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${API_ENDPOINTS.issuesAdmin}?${queryString}` : API_ENDPOINTS.issuesAdmin;
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching issues:", error);
    throw error;
  }
};

export const getIssueById = async (issueId) => {
  try {
    const response = await axiosInstance.get(`${API_ENDPOINTS.issuesAdmin}/${issueId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching issue by ID:", error);
    throw error;
  }
};

export const getIssueStats = async () => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.issuesAdminStats);
    return response.data;
  } catch (error) {
    console.error("Error fetching issue stats:", error);
    throw error;
  }
};

export const updateIssue = async (issueId, issueData) => {
  try {
    const response = await axiosInstance.put(
      `${API_ENDPOINTS.issuesAdmin}/${issueId}`,
      issueData,
    );
    return response.data;
  } catch (error) {
    console.error("Error updating issue:", error);
    throw error;
  }
};

export const updateIssueStatus = async (issueId, status) => {
  try {
    console.log(`Making PATCH request to: ${API_ENDPOINTS.issuesAdmin}/${issueId}/status with status:`, status);
    const response = await axiosInstance.patch(`${API_ENDPOINTS.issuesAdmin}/${issueId}/status`, {
      status,
    });
    if (!response.data) {
      throw new Error("No data found");
    }
    return response.data.data;
  } catch (error) {
    console.error("Error updating issue status:", error);
    console.error("Request details:", {
      url: `/admin/${issueId}/status`,
      method: 'PATCH',
      status
    });
    throw error;
  }
};

export const deleteIssue = async (issueId) => {
  try {
    const response = await axiosInstance.delete(`${API_ENDPOINTS.issuesAdmin}/${issueId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting issue:", error);
    throw error;
  }
};

// User issue services (for creating issues)
export const createIssue = async (issueData) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.issues, issueData);
    return response.data;
  } catch (error) {
    console.error("Error creating issue:", error);
    throw error;
  }
};

export const getMyIssues = async () => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.myIssues);
    return response.data;
  } catch (error) {
    console.error("Error fetching my issues:", error);
    throw error;
  }
};

// Issue type and status constants
export const ISSUE_TYPES = {
  MISSING_TEACHER: "MISSING_TEACHER",
  MISSING_ROUTINE: "MISSING_ROUTINE",
  INCORRECT_TIME: "INCORRECT_TIME",
  INCORRECT_ROOM: "INCORRECT_ROOM",
  INCORRECT_TEACHER: "INCORRECT_TEACHER",
  OTHERS: "OTHERS",
};

export const REPORT_STATUS = {
  OPEN: "OPEN",
  IN_PROGRESS: "IN_PROGRESS",
  RESOLVED: "RESOLVED",
  CLOSED: "CLOSED",
};
