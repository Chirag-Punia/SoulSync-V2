import express from "express";
import { ChatController } from "../controllers/chatController.js";
import { authenticateUser } from "../middleware/firebaseAuthMiddleware.js";

const router = express.Router();
const chatController = new ChatController();

router.post(
  "/initialize/:userId",
  authenticateUser,
  chatController.initializeChat
);
router.get("/:userId", authenticateUser, chatController.getChatHistory);
router.delete("/:userId", authenticateUser, chatController.deleteChatHistory);
router.post("/:userId", authenticateUser, chatController.handleChat);
router.post("/save/:userId", authenticateUser, chatController.saveChat);

export { router as chatRouter };
