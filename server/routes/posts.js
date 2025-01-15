import express from "express";
import Post from "../models/Post.js";

const router = express.Router();

// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/delete/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    await Post.deleteMany({ userId });


    await Chat.deleteMany({ userId });


    res
      .status(200)
      .json({ message: "User's posts and chats have been deleted." });
  } catch (error) {
    console.error("Error deleting posts and chats:", error);
    res.status(500).json({ error: "Failed to delete posts and chats" });
  }
});
// Create a post
router.post("/", async (req, res) => {
  const post = new Post({
    userId: req.body.userId,
    userName: req.body.userName,
    title: req.body.title,
    content: req.body.content,
  });

  try {
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Like/Unlike a post
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const index = post.likes.indexOf(req.body.userId);
    if (index === -1) {
      post.likes.push(req.body.userId);
    } else {
      post.likes.splice(index, 1);
    }

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add a comment
router.post("/:id/comments", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({
      userId: req.body.userId,
      userName: req.body.userName,
      content: req.body.content,
    });

    const updatedPost = await post.save();
    res.status(201).json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const posts = await Post.find({ userId }).sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

export default router;
