import * as PostService from "../services/postService.js";

export const getAllPosts = async (req, res) => {
  try {
    const posts = await PostService.getAllPosts();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUserPostsAndChats = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    await PostService.deleteUserPostsAndChats(userId);

    res
      .status(200)
      .json({ message: "User's posts and chats have been deleted." });
  } catch (error) {
    console.error("Error deleting posts and chats:", error);
    res.status(500).json({ error: "Failed to delete posts and chats" });
  }
};

export const createPost = async (req, res) => {
  try {
    const { userId, userName, title, content } = req.body;
    const newPost = await PostService.createPost({
      userId,
      userName,
      title,
      content,
    });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.body.userId;
    const updatedPost = await PostService.likeUnlikePost(postId, userId);
    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const { userId, userName, content } = req.body;
    const updatedPost = await PostService.addComment(postId, {
      userId,
      userName,
      content,
    });
    res.status(201).json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const posts = await PostService.getUserPosts(userId);
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};