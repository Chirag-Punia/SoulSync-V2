import { api } from "./apiClient";

export const moodService = {
  getMoodHistory: async () => {
    try {
      const response = await api.get("/moods");
      return response.data;
    } catch (error) {
      console.error("Mood history error:", error);
      throw error;
    }
  },

  addMoodEntry: async (mood) => {
    try {
      const response = await api.post("/moods", mood);
      return response.data;
    } catch (error) {
      console.error("Add mood error:", error);
      throw error;
    }
  },
};
