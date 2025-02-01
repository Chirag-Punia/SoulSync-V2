import express from "express";
import * as subscriptionController from "../controllers/subscriptionController.js";
import { authenticateUser } from "../middleware/firebaseAuthMiddleware.js";
const router = express.Router();

router.post("/subscribe", authenticateUser, subscriptionController.subscribe);
router.post(
  "/unsubscribe",
  authenticateUser,
  subscriptionController.unsubscribe
);
router.post(
  "/",
  subscriptionController.handleSubscriptionConfirmation
);

export default router;
