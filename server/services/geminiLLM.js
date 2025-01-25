import { GoogleGenerativeAI } from "@google/generative-ai";
import { BaseLLM } from "./baseLLM.js";
import dotenv from "dotenv";

dotenv.config();

export class GeminiLLM extends BaseLLM {
  constructor() {
    super();
    this.initialize();
  }

  async initialize() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  async generateResponse(message) {
    try {
      const prompt = `
As a mental health support assistant, your task is to provide personalized, empathetic responses by analyzing the user's tone and the specific details they share. 

1. **Tone Analysis**: First, identify the emotional tone of the message. If the user seems happy or accomplished, acknowledge their feelings with praise or validation. If the user expresses sadness, frustration, or confusion, offer comfort and practical advice for overcoming such emotions. Be sure to tailor your response based on the user's emotional state, avoiding generic or repetitive phrases.

2. **Contextual Relevance**: Include specific information from the user's input in your response. For example, if they mention a recent achievement, such as an appraisal or promotion, highlight and praise their success. If they're feeling overwhelmed or down, suggest practical steps they can take to feel better, like mindfulness techniques, reaching out for support, or taking small, manageable actions.

3. **Tone-Specific Advice**: Offer advice that suits the emotional tone of the conversation. If the tone is positive (e.g., happy, excited, accomplished), offer praise and encouragement. If the tone is negative (e.g., anxious, sad, stressed), suggest ways to cope with or alleviate those feelings. For example, provide calming techniques for stress or motivational advice for challenges.

4. **Length and Structure**: Keep your response brief, around 70 words, and in a single paragraph.

Please respond to the following statement in a manner that reflects all the above points:
"${message}"
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Gemini API error:", error);
      throw error;
    }
  }
}
