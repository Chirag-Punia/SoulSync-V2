import axios from "axios";

export const emotionService = {
  analyzeImage: async (imageData) => {
    const formData = new FormData();
    formData.append("api_key", import.meta.env.VITE_FACE_API_KEY);
    formData.append("api_secret", import.meta.env.VITE_FACE_API_SECRET);
    formData.append("image_file", imageData);
    formData.append("return_attributes", "emotion");

    try {
      const response = await axios.post(
        "https://api-us.faceplusplus.com/facepp/v3/detect",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to analyze emotion");
    }
  },

  getEmotionHistory: () => {
    return JSON.parse(localStorage.getItem("emotionHistory") || "[]");
  },

  saveEmotionHistory: (emotion) => {
    const history = emotionService.getEmotionHistory();
    history.push({
      ...emotion,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem("emotionHistory", JSON.stringify(history.slice(-10)));
  },
};
