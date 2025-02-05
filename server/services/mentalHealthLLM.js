import { BaseLLM } from "./baseLLM.js";     
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export class MentalHealthLLM extends BaseLLM {
  constructor(baseUrl) {
    super();
    this.baseUrl = baseUrl || process.env.FLASK_API_URL; // URL where your Flask app is deployed
  }

  async generateResponse(message) {
    try {
      const response = await axios.post(`${this.baseUrl}/chat`, {
        query: `${message}`,
        session_id : ""
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // The Flask API returns both response and emotion analysis
      return response.data;
    } catch (error) {
      console.error("Flask API error:", error);
      throw new Error("Failed to get response from mental health chatbot");
    }
  }

  async healthCheck() {
    try {
      const response = await axios.get(`${this.baseUrl}/health`);
      return response.data.status === "healthy";
    } catch (error) {
      console.error("Health check failed:", error);
      return false;
    }
  }
}