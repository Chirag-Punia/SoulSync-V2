import Post from "../models/Post.js";
import Chat from "../models/Chat.js";

export const getAllPosts = async () => {
  return await Post.find().sort({ createdAt: -1 });
};

export const deleteUserPostsAndChats = async (userId) => {
  await Post.deleteMany({ userId });
  await Chat.deleteMany({ userId });
};

export const createPost = async (postData) => {
  const post = new Post(postData);
  return await post.save();
};

export const likeUnlikePost = async (postId, userId) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error("Post not found");
  }

  const index = post.likes.indexOf(userId);
  if (index === -1) {
    post.likes.push(userId);
  } else {
    post.likes.splice(index, 1);
  }

  return await post.save();
};

export const addComment = async (postId, commentData) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error("Post not found");
  }

  post.comments.push(commentData);
  return await post.save();
};

export const getUserPosts = async (userId) => {
  return await Post.find({ userId }).sort({ createdAt: -1 });
};
