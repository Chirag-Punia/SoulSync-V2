import { api } from "./apiClient";
import { getAuthToken } from "./authService";

export const FitbitService = {
  async getOAuthUrl() {
    try {
      const token = await getAuthToken();
      const response = await api.get(
        `${import.meta.env.VITE_API_BASE_URL}/fitbit/oauth-url`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.authUrl;
    } catch (error) {
      console.error("Error getting Fitbit OAuth URL:", error);
      throw error;
    }
  },

  async fetchFitbitData() {
    try {
      const token = await getAuthToken();
      const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/fitbit/data`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching Fitbit data:", error);
      throw error;
    }
  },
};
