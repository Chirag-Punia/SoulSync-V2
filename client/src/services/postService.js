import { api } from "./apiClient";

export const postService = {
  getPosts: async () => {
    try {
      const response = await api.get("/posts");
      return response.data;
    } catch (error) {
      console.error("Get posts error:", error);
      throw error;
    }
  },

  createPost: async (post) => {
    try {
      const response = await api.post("/posts", post);
      return response.data;
    } catch (error) {
      console.error("Create post error:", error);
      throw error;
    }
  },

  likePost: async (postId, userId) => {
    try {
      const response = await api.put(`/posts/${postId}/like`, { userId });
      return response.data;
    } catch (error) {
      console.error("Like post error:", error);
      throw error;
    }
  },

  addComment: async (postId, comment) => {
    try {
      const response = await api.post(`/posts/${postId}/comments`, comment);
      return response.data;
    } catch (error) {
      console.error("Add comment error:", error);
      throw error;
    }
  },
};
