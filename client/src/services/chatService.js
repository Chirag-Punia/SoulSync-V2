import { api } from "./apiClient";
import { getAuthToken } from "./authService";

export const chatService = {
  sendMessage: async (userId, message) => {
    try {
      const token = await getAuthToken();
      const response = await api.post(`/chat/${userId}`, { message }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Chat error:", error);
      throw error;
    }
  },

  loadChats: async (userId) => {
    try {
      const token = await getAuthToken();
      const response = await api.get(`/chat/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to load chats:", error);
      throw error;
    }
  },

  saveChat: async (userId, message) => {
    try {
      if (!message.text) return;
      const token = await getAuthToken();
      const response = await api.post(`/chat/save/${userId}`, { message }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to save chat:", error);
      throw error;
    }
  },

  initializeChat: async (userId) => {
    try {
      const token = await getAuthToken();
      const response = await api.post(`/chat/initialize/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to initialize chat:", error);
      throw error;
    }
  },
};