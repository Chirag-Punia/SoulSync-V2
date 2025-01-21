import { initializeApp } from "firebase/app";
import axios from "axios";
import {
  getAuth,
  deleteUser,
  updatePassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const deleteUserAccount = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const providerId = user.providerData[0]?.providerId;

    console.warn("Deleting chats for user.");

    await axios.delete(
      `${import.meta.env.VITE_API_BASE_URL}/chat/${user.uid}`,
      {
        headers: {
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
      }
    );

    console.warn("Deleting posts for user.");

    await axios.delete(
      `${import.meta.env.VITE_API_BASE_URL}/posts/delete/${user.uid}`,
      {
        headers: {
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
      }
    );


    if (providerId !== "google.com") {
      await deleteUser(user);

    }
  } catch (error) {
    console.error("Error deleting account or related data:", error);
    throw error;
  }
};

export const exportUserData = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return null;

    const chatHistoryResponse = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/chat/${user.uid}`,
      {
        headers: {
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
      }
    );
    const chats = chatHistoryResponse.data;

    const postsResponse = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/posts/${user.uid}`,
      {
        headers: {
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
      }
    );
    const posts = postsResponse.data;

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
};

export const resetUserPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};

export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export const twitterProvider = new TwitterAuthProvider();

export { auth };
