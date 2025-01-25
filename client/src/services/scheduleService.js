import { api } from "./apiClient";
import { getAuthToken } from "./authService";

export const scheduleService = {
  getSchedule: async (userId, date) => {
    try {
      const token = await getAuthToken();
      const response = await api.get(`/schedule`, {
        params: { userId, date },
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch schedule:", error);
      throw error;
    }
  },

  addTask: async (userId, task) => {
    try {
      const token = await getAuthToken();
      const response = await api.post(
        `/schedule`,
        { userId, task },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to add task:", error);
      throw error;
    }
  },

  updateTask: async (userId, taskId, completed) => {
    try {
      const token = await getAuthToken();
      const response = await api.patch(
        `/schedule/task`,
        { userId, taskId, completed },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to update task:", error);
      throw error;
    }
  },
  deleteTask: async (userId, taskId) => {
    try {
      const token = await getAuthToken();
      const response = await api.delete(`/schedule/${taskId}`, {
        params: { userId },
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to delete task:", error);
      throw error;
    }
  },
};
