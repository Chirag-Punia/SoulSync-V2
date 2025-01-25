import express from "express";
import * as AuthController from "../controllers/authController.js";

const router = express.Router();

router.post("/login", AuthController.loginUser);
router.get("/:firebaseUid", AuthController.getUserProfile);
router.post("/", AuthController.createOrUpdateProfile);
router.patch("/:firebaseUid/preferences", AuthController.updateUserPreferences);
router.delete("/:firebaseUid", AuthController.deleteUser);

export default router;
