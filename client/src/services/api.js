import axios from 'axios';
import { auth } from './firebaseConfig';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const chatService = {
  sendMessage: async (userId, message) => {
    try {
      const token = await auth.currentUser.getIdToken();
      if (!message) return;
      const response = await api.post(`/chat/${userId}`, { message }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Chat error:', error);
      throw error;
    }
  },

  loadChats: async (userId) => {
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await api.get(`/chat/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to load chats:', error);
      throw error;
    }
  },

  saveChat: async (userId, message) => {
    try {
      if (!message.text) return;
      const token = await auth.currentUser.getIdToken();
      const response = await api.post(`/chat/save/${userId}`, { message }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to save chat:', error);
      throw error;
    }
  },
  initializeChat: async (userId) => {
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await api.post(`/chat/initialize/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to initialize chat:', error);
      throw error;
    }
  },
};

export const moodService = {
  getMoodHistory: async () => {
    try {
      const response = await api.get('/moods');
      return response.data;
    } catch (error) {
      console.error('Mood history error:', error);
      throw error;
    }
  },
  addMoodEntry: async (mood) => {
    try {
      const response = await api.post('/moods', mood);
      return response.data;
    } catch (error) {
      console.error('Add mood error:', error);
      throw error;
    }
  },
};

export const postService = {
  getPosts: async () => {
    try {
      const response = await api.get('/posts');
      return response.data;
    } catch (error) {
      console.error('Get posts error:', error);
      throw error;
    }
  },
  createPost: async (post) => {
    try {
      const response = await api.post('/posts', post);
      return response.data;
    } catch (error) {
      console.error('Create post error:', error);
      throw error;
    }
  },
  likePost: async (postId, userId) => {
    try {
      const response = await api.put(`/posts/${postId}/like`, { userId });
      return response.data;
    } catch (error) {
      console.error('Like post error:', error);
      throw error;
    }
  },
  addComment: async (postId, comment) => {
    try {
      const response = await api.post(`/posts/${postId}/comments`, comment);
      return response.data;
    } catch (error) {
      console.error('Add comment error:', error);
      throw error;
    }
  },
};

export const userService = {
  getProfile: async (firebaseUid) => {
    try {
      const response = await api.get(`/users/${firebaseUid}`);
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  createOrUpdateProfile: async (userData) => {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  updatePreferences: async (firebaseUid, preferences) => {
    try {
      const response = await api.patch(`/users/${firebaseUid}/preferences`, preferences);
      return response.data;
    } catch (error) {
      console.error('Update preferences error:', error);
      throw error;
    }
  },

  deleteProfile: async (firebaseUid) => {
    try {
      await api.delete(`/users/${firebaseUid}`);
    } catch (error) {
      console.error('Delete profile error:', error);
      throw error;
    }
  },
};

export const scheduleService = {
  getSchedule: async (userId, date) => {
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await api.get(`/schedule`, {
        params: { userId, date },
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch schedule:', error);
      throw error;
    }
  },
  
  addTask: async (userId, task) => {
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await api.post(`/schedule`, { userId, task }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to add task:', error);
      throw error;
    }
  },
  
  updateTask: async (userId, taskId, completed) => {
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await api.patch(`/schedule/task`, { userId, taskId, completed }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  },
};
