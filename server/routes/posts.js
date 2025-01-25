import express from "express";
import * as PostController from "../controllers/postController.js";

const router = express.Router();

router.get("/", PostController.getAllPosts);
router.delete("/delete/:userId", PostController.deleteUserPostsAndChats);
router.post("/", PostController.createPost);
router.put("/:id/like", PostController.likeUnlikePost);
router.post("/:id/comments", PostController.addComment);
router.get("/:userId", PostController.getUserPosts);

export default router;
