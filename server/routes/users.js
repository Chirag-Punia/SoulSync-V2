import express from "express";
import * as AuthController from "../controllers/authController.js";
import { authenticateUser } from "../middleware/firebaseAuthMiddleware.js";
const router = express.Router();

router.post("/login", AuthController.loginUser);
router.get("/:firebaseUid", AuthController.getUserProfile);
router.get("/", authenticateUser, AuthController.getUserProfile2);
router.post("/", AuthController.createOrUpdateProfile);
router.patch("/:firebaseUid/preferences", AuthController.updateUserPreferences);
router.delete("/:firebaseUid", AuthController.deleteUser);

export default router;
