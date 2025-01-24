import express from "express";
import * as UserController from "../controllers/profileController.js";

const router = express.Router();

router.post("/save-user", UserController.saveUser);
router.get("/user-profile", UserController.getUserProfile);
router.put("/update-profile", UserController.updateProfile);
router.patch("/toggle-anonymous", UserController.toggleAnonymous);
router.patch("/update-preferences", UserController.updatePreferences);
router.patch("/connect-account", UserController.connectAccount);

export default router;