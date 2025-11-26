import { API_ENDPOINTS } from "@/config/apiConfig";
import axiosInstance from "./axiosInterceptor";

export const fetchUserRoutines = async () => {
  try {
    const res = await axiosInstance.get(API_ENDPOINTS.routineByUserGroup);
    if (!res.data) {
      throw new Error("No data found");
    }
    return res.data.data;
  } catch (error) {
    console.error("Error fetching routines:", error);
    throw error;
  }
};

export const fetchRoutineByGroupId = async (groupId) => {
  try {
    const res = await axiosInstance.get(`${API_ENDPOINTS.adminRoutines}?${groupId}`);
    if (!res.data) {
      throw new Error("No data found for the specified group");
    }
    return res.data.data;
  } catch (error) {
    console.error("Error fetching routine by group ID:", error);
    throw error;
  }
}