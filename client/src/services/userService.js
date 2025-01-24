// userService.js
import { api } from "./apiClient";
import { getAuthToken } from "./authService";
import { auth } from "./firebaseConfig";
import { sendPasswordResetEmail, getAuth, deleteUser } from "firebase/auth";
export const userService = {
  loginUser: async (user) => {
    try {
      const userData = {
        firebaseUid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email.split("@")[0],
      };

      await api.post("/users/login", userData);
    } catch (error) {
      console.error("Error during login:", error);
      throw new Error("Login failed. Please try again.");
    }
  },

  signUpUser: async (user) => {
    try {
      const userData = {
        firebaseUid: user.uid,
        email: user.email,
        displayName: user.displayName || "Anonymous",
      };

      await api.post("/users/login", userData);
    } catch (error) {
      console.error("Signup Error:", error);
      throw new Error("Signup failed. Please try again.");
    }
  },
  updatePreferences: async (preferences) => {
    try {
      const token = await getAuthToken();
      await api.patch("/data/update-preferences", preferences, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error updating preferences:", error);
      throw error;
    }
  },
  getProfile: async () => {
    try {
      const token = await getAuthToken();
      const user = auth.currentUser;
      if (!user) return null;

      const response = await api.get(`/users/${user.uid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Get profile error:", error);
      throw error;
    }
  },

  updateProfile: async (profileData) => {
    try {
      const token = await getAuthToken();
      await api.put("/data/update-profile", profileData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Profile update error:", error);
      throw error;
    }
  },
  getUserProfileData: async () => {
    try {
      const token = await getAuthToken();
      const response = await api.get(`/data/user-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Get user profile data error:", error);
      throw error;
    }
  },
  deleteUserAccount: async () => {
    try {
      const currentAuth = getAuth();
      const user = currentAuth.currentUser;
      if (!user) return;

      const providerId = user.providerData[0]?.providerId;
      const token = await user.getIdToken();

      console.warn("Deleting chats for user.");
      await api.delete(`/chat/${user.uid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.warn("Deleting posts for user.");
      await api.delete(`/posts/delete/${user.uid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.warn("Deleting user from database.");
      await api.delete(`/users/${user.uid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.warn("Deleting user authentication account.");
      await deleteUser(user);
    } catch (error) {
      console.error("Error deleting account or related data:", error);
      throw error;
    }
  },

  exportUserData: async () => {
    try {
      const token = await getAuthToken();
      const user = auth.currentUser;
      if (!user) return null;

      const chats = (
        await api.get(`/chat/${user.uid}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ).data;

      const posts = (
        await api.get(`/posts/${user.uid}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ).data;

      return {
        userData: {
          email: user.email,
          displayName: user.displayName,
          createdAt: user.metadata.creationTime,
        },
        chats,
        posts,
      };
    } catch (error) {
      console.error("Error exporting data:", error);
      throw error;
    }
  },

  toggleAnonymous: async (isAnonymous) => {
    try {
      const token = await getAuthToken();
      const response = await api.patch(
        "/data/toggle-anonymous",
        { isAnonymous },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.status === 200;
    } catch (error) {
      console.error("Error toggling anonymous mode:", error);
      throw error;
    }
  },
  resetPassword: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Password reset error:", error);
      throw error;
    }
  },

  connectAccount: async (provider) => {
    try {
      const token = await getAuthToken();
      await api.patch(
        "/data/connect-account",
        {
          provider: provider,
          status: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error saving user data to backend:", error);
      throw error;
    }
  },
};
