import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Button,
  Input,
  Textarea,
  Avatar,
} from "@nextui-org/react";
import { postService } from "../services/postService";
import { auth } from "../services/firebaseConfig";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart, FaComment } from "react-icons/fa";

function Community() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login");
        return;
      }
      fetchPosts();
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchPosts = async () => {
    try {
      const data = await postService.getPosts();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim() || !auth.currentUser)
      return;

    try {
      const post = {
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || "Anonymous",
        ...newPost,
      };

      const createdPost = await postService.createPost(post);
      setPosts([createdPost, ...posts]);
      setNewPost({ title: "", content: "" });
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  const handleLike = async (postId) => {
    if (!auth.currentUser) return;

    try {
      const updatedPost = await postService.likePost(
        postId,
        auth.currentUser.uid
      );
      setPosts(posts.map((post) => (post._id === postId ? updatedPost : post)));
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  const handleComment = async (postId) => {
    if (!commentText.trim() || !auth.currentUser) return;

    try {
      const comment = {
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || "Anonymous",
        content: commentText,
      };

      const updatedPost = await postService.addComment(postId, comment);
      setPosts(posts.map((post) => (post._id === postId ? updatedPost : post)));
      setCommentText("");
      setActiveCommentPost(null);
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  if (!auth.currentUser) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">
        Community Support
      </h1>

      <Card className="mb-6">
        <CardBody className="space-y-4">
          <Input
            label="Title"
            placeholder="Enter your post title"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <Textarea
            label="Content"
            placeholder="Share your thoughts..."
            value={newPost.content}
            onChange={(e) =>
              setNewPost({ ...newPost, content: e.target.value })
            }
          />
          <Button color="primary" onPress={handleCreatePost}>
            Create Post
          </Button>
        </CardBody>
      </Card>

      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post._id} className="overflow-visible">
            <CardBody className="space-y-4">
              <div className="flex items-center space-x-2">
                <Avatar name={post.userName} className="w-8 h-8" />
                <div>
                  <p className="font-semibold">{post.userName}</p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(post.createdAt), "MMM d, yyyy")}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {post.content}
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  size="sm"
                  variant="light"
                  onPress={() => handleLike(post._id)}
                  startContent={
                    post.likes.includes(auth.currentUser?.uid) ? (
                      <FaHeart className="text-red-500" />
                    ) : (
                      <FaRegHeart />
                    )
                  }
                >
                  {post.likes.length}
                </Button>

                <Button
                  size="sm"
                  variant="light"
                  onPress={() =>
                    setActiveCommentPost(
                      activeCommentPost === post._id ? null : post._id
                    )
                  }
                  startContent={<FaComment />}
                >
                  {post.comments.length}
                </Button>
              </div>

              {activeCommentPost === post._id && (
                <div className="space-y-2">
                  <Input
                    size="sm"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleComment(post._id)
                    }
                  />
                  <Button size="sm" onPress={() => handleComment(post._id)}>
                    Comment
                  </Button>
                </div>
              )}

              {post.comments.length > 0 && (
                <div className="space-y-2 mt-4">
                  {post.comments.map((comment, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg"
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <Avatar name={comment.userName} className="w-6 h-6" />
                        <p className="font-semibold text-sm">
                          {comment.userName}
                        </p>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Community;
