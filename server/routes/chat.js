import express from "express";
import { ChatController } from "../controllers/chatController.js";

const router = express.Router();
const chatController = new ChatController();

router.post("/initialize/:userId", chatController.initializeChat);
router.get("/:userId", chatController.getChatHistory);
router.delete("/:userId", chatController.deleteChatHistory);
router.post("/:userId", chatController.handleChat);
router.post("/save/:userId", chatController.saveChat);

export { router as chatRouter };
