import express from "express";
import {
  getFitbitOAuthUrl,
  handleFitbitCallback,
  fetchFitbitData,
} from "../controllers/fitbitController.js";
import { authenticateUser } from "../middleware/firebaseAuthMiddleware.js";

const router = express.Router();

router.get("/oauth-url", authenticateUser, getFitbitOAuthUrl);
router.get("/callback", handleFitbitCallback);
router.get("/data", authenticateUser, fetchFitbitData);

export default router;
