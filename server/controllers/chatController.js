import { MentalHealthLLM } from "../services/mentalHealthLLM.js";
import Chat from "../models/Chat.js";

export class ChatController {
  constructor() {
    this.llm = new MentalHealthLLM();
  }
  setLLM(llmType) {
    switch (llmType) {
      case "mental-health":
        this.llm = new MentalHealthLLM();
        break;
      default:
        throw new Error("Unsupported LLM type");
    }
  }

  initializeChat = async (req, res) => {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      let chat = await Chat.findOne({ userId });

      if (!chat) {
        const initialMessage = {
          text: "Hello! How are you feeling today?",
          sender: "system",
          timestamp: new Date(),
        };

        chat = new Chat({ userId, messages: [initialMessage] });
        await chat.save();
      }

      res.json(chat.messages);
    } catch (error) {
      console.error("Failed to initialize chat:", error);
      res.status(500).json({ error: "Failed to initialize chat" });
    }
  };

  handleChat = async (req, res) => {
    try {
      const { userId } = req.params;
      const message = req.body.message;

      if (!userId || !message) {
        return res
          .status(400)
          .json({ error: "User ID and message are required" });
      }

      const response = await this.llm.generateResponse(message);

      let chat = await Chat.findOne({ userId });

      if (!chat) {
        chat = new Chat({ userId, messages: [] });
      }

      chat.messages.push({
        text: message,
        sender: "user",
        timestamp: new Date(),
      });

      chat.messages.push({
        text: response.response,
        sender: "bot",
        timestamp: new Date(),
        emotion: response.emotion, // Store emotion analysis from Flask API
      });

      await chat.save();

      res.json(response);
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Failed to process chat message" });
    }
  };
  saveChat = async (userId, messages) => {
    try {
      let chat = await Chat.findOne({ userId });

      if (!chat) {
        chat = new Chat({ userId, messages: [] });
      }

      chat.messages.push(...messages);
      await chat.save();
    } catch (error) {
      console.error("Failed to save chat:", error);
      throw new Error("Failed to save chat");
    }
  };

  getChatHistory = async (req, res) => {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }
      const chat = await Chat.findOne({ userId });
      res.json(chat ? chat.messages : []);
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
      res.status(500).json({ error: "Failed to fetch chat history" });
    }
  };
  deleteChatHistory = async (req, res) => {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      await Chat.deleteOne({ userId });

      res.status(200).json({ message: "Chat history deleted successfully." });
    } catch (error) {
      console.error("Failed to delete chat history:", error);
      res.status(500).json({ error: "Failed to delete chat history" });
    }
  };
}
