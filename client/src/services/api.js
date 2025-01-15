import axios from 'axios';
import { auth } from './firebaseConfig';

const API_BASE_URL = 'https://soulsync-v2.onrender.com/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const chatService = {
  sendMessage: async (userId,message) => {
    try {
      const token = await auth.currentUser.getIdToken();
      if(!message)return;
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
      if(!message.text)return;
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
  }
};

export const communityService = {
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
  }
};