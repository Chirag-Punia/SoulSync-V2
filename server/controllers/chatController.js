import { GeminiLLM } from "../services/geminiLLM.js";
import Chat from "../models/Chat.js";

export class ChatController {
  constructor() {
    this.llm = new GeminiLLM();
  }

  setLLM(llmType) {
    switch (llmType) {
      case "gemini":
        this.llm = new GeminiLLM();
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
      const { message } = req.body;


      if (!userId || !message) {
        return res
          .status(400)
          .json({ error: "User ID and message are required" });
      }
      if (!message) {
        return res.status(400).json({ error: " message are required" });
      }

      const botResponse = await this.llm.generateResponse(message);

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
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      });
      await chat.save();
      res.json({ response: botResponse });
    } catch (error) {
      console.error("Chat error:", error);
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
}
