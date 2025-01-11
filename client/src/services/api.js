import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const chatService = {
  sendMessage: async (message) => {
    try {
      const response = await api.post('/chat', { message });
      return response.data;
    } catch (error) {
      console.error('Chat error:', error);
      throw error;
    }
  }
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