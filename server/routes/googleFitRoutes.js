import express from "express";
import googleFitController from "../controllers/googleFitController.js";
import { authenticateUser } from "../middleware/firebaseAuthMiddleware.js";
import User from "../models/User.js";
const router = express.Router();

router.get(
  "/oauth-url",
  authenticateUser,
  googleFitController.generateOAuthUrl
);
router.get("/auth/callback", googleFitController.handleOAuthCallback);
router.get(
  "/fetch-data",
  authenticateUser,
  googleFitController.fetchAndStoreGoogleFitData
);
router.get(
  "/stored-data",
  authenticateUser,
  googleFitController.getStoredGoogleFitData
);
router.get("/user/data", authenticateUser, async (req, res) => {
  const uid = req.user.user_id;

  try {
    const user = await User.findOne({ firebaseUid: uid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
export default router;
