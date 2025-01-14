import { GoogleGenerativeAI } from '@google/generative-ai';
import { BaseLLM } from './baseLLM.js';
import dotenv from "dotenv"

dotenv.config();

export class GeminiLLM extends BaseLLM {
  constructor() {
    super();
    this.initialize();
  }

  async initialize() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async generateResponse(message) {
    try {
      const prompt = `As a mental health support assistant, provide a short, empathetic response in exactly one paragraph, limited to approximately 70 words, to the following statement: "${message.text}"`;
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  }
}