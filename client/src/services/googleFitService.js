import { api } from "./apiClient";
import { getAuthToken } from "./authService";

export const GoogleFitService = {
  async getOAuthUrl() {
    try {
      const token = await getAuthToken();
      const response = await api.get("/gfit/oauth-url", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.authUrl;
    } catch (error) {
      console.error("Error getting Google Fit OAuth URL:", error);
      throw error;
    }
  },

  async fetchGoogleFitData() {
    try {
      const token = await getAuthToken();
      const response = await api.get("/gfit/fetch-data", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching Google Fit data:", error);
      throw error;
    }
  },

  async getUserData() {
    try {
      const token = await getAuthToken();
      const response = await api.get("/gfit/user/data", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching Google Fit user data:", error);
      throw error;
    }
  },
};
