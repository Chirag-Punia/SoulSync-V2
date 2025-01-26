import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Button,
  Input,
  Textarea,
  Avatar,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Drawer,
} from "@nextui-org/react";
import { postService } from "../services/postService";
import { auth } from "../services/firebaseConfig";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaRegHeart,
  FaComment,
  FaPaperPlane,
  FaTimes,
  FaEllipsisV,
} from "react-icons/fa";
import { IoChatboxEllipses } from "react-icons/io5";
import { motion } from "framer-motion";
import Chat from "./Chat";
function Community() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const navigate = useNavigate();

  const [selectedUser, setSelectedUser] = useState(null);
  const [chatMessage, setChatMessage] = useState("");
  const [activeChats, setActiveChats] = useState([]);

  // Current user info (you can get this from your auth system)
  const currentUser = {
    id: "Chirag-Punia", // Using login as ID
    userName: "Chirag Punia",
    // Add other user details as needed
  };

  const handleStartChat = (user) => {
    // Check if chat is already open
    if (!activeChats.find((chat) => chat.id === user.id)) {
      setActiveChats([...activeChats, user]);
    }
  };

  const handleCloseChat = (userId) => {
    setActiveChats(activeChats.filter((chat) => chat.id !== userId));
  };

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
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);

  const startChat = (user) => {
    setSelectedUser(user);
    setIsChatOpen(true);
    // Fetch chat history here
    setMessages([
      // Sample messages - replace with actual chat history
      { sender: user.id, content: "Hey there!", timestamp: new Date() },
      {
        sender: auth.currentUser.uid,
        content: "Hi! How are you?",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            Community Hub
          </h1>
          <p className="text-gray-400">
            Share your thoughts and connect with others
          </p>
        </motion.div>

        {/* Create Post Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
            <CardBody className="space-y-6 p-6">
              <Input
                label="Title"
                placeholder="What's on your mind?"
                value={newPost.title}
                onChange={(e) =>
                  setNewPost({ ...newPost, title: e.target.value })
                }
                classNames={{
                  input: "text-white",
                  label: "text-gray-400",
                }}
              />
              <Textarea
                label="Content"
                placeholder="Share your story..."
                value={newPost.content}
                onChange={(e) =>
                  setNewPost({ ...newPost, content: e.target.value })
                }
                classNames={{
                  input: "text-white",
                  label: "text-gray-400",
                }}
                minRows={3}
              />
              <Button
                color="secondary"
                variant="shadow"
                onPress={handleCreatePost}
                className="bg-gradient-to-r from-violet-500 to-fuchsia-500 w-full"
                startContent={<FaPaperPlane />}
              >
                Create Post
              </Button>
            </CardBody>
          </Card>
        </motion.div>

        {/* Posts */}
        <div className="space-y-6">
          {posts.map((post, index) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="backdrop-blur-xl bg-white/10 border border-white/20 hover:border-purple-500/50 transition-all">
                <CardBody className="space-y-4 p-6">
                  {/* Post Header */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <Avatar
                        src={`https://api.dicebear.com/6.x/initials/svg?seed=${post.userName}`}
                        className="ring-2 ring-purple-500"
                      />
                      <div>
                        <p className="font-semibold text-white">
                          {post.userName}
                        </p>
                        <p className="text-xs text-gray-400">
                          {format(new Date(post.createdAt), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                    <Button
                      isIconOnly
                      variant="light"
                      onPress={() =>
                        handleStartChat({
                          id: post.userId,
                          userName: post.userName, // Make sure this is available in your post data
                        })
                      }
                      className="text-purple-400 hover:text-purple-300"
                    >
                      <IoChatboxEllipses size={20} />
                    </Button>
                  </div>

                  {/* Post Content */}
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {post.title}
                    </h3>
                    <p className="text-gray-300 mt-2">{post.content}</p>
                  </div>

                  {/* Post Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button
                        size="sm"
                        variant="light"
                        onPress={() => handleLike(post._id)}
                        className={
                          post.likes.includes(auth.currentUser?.uid)
                            ? "text-pink-500"
                            : "text-gray-400"
                        }
                        startContent={
                          post.likes.includes(auth.currentUser?.uid) ? (
                            <FaHeart />
                          ) : (
                            <FaRegHeart />
                          )
                        }
                      >
                        {post.likes.length}
                      </Button>

                      <Popover placement="bottom">
                        <PopoverTrigger>
                          <Button
                            size="sm"
                            variant="light"
                            className="text-gray-400"
                            startContent={<FaComment />}
                          >
                            {post.comments.length}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-0">
                          <div className="max-h-96 overflow-y-auto bg-gray-900 rounded-lg">
                            <div className="p-4 space-y-4">
                              {post.comments.map((comment, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-start space-x-3 p-2 hover:bg-gray-800 rounded-lg"
                                >
                                  <Avatar
                                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${comment.userName}`}
                                    className="w-8 h-8"
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <span className="font-medium text-white text-sm">
                                        {comment.userName}
                                      </span>
                                      <Button
                                        size="sm"
                                        variant="light"
                                        className="text-purple-400 hover:text-purple-300"
                                        onPress={() =>
                                          handleStartChat({
                                            id: comment.userId,
                                            userName: comment.userName, // Using commenter's name
                                            isCommenter: true, // Optional: to differentiate between post author and commenter
                                          })
                                        }
                                      >
                                        Chat
                                      </Button>
                                    </div>
                                    <p className="text-gray-300 text-sm mt-1">
                                      {comment.content}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                            {/* Comment Input Section */}
                            <div className="p-4 border-t border-gray-700">
                              <div className="flex gap-2">
                                <Input
                                  size="sm"
                                  placeholder="Add a comment..."
                                  value={commentText}
                                  onChange={(e) =>
                                    setCommentText(e.target.value)
                                  }
                                  className="flex-1"
                                />
                                <Button
                                  size="sm"
                                  color="secondary"
                                  onPress={() => handleComment(post._id)}
                                >
                                  Post
                                </Button>
                              </div>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </CardBody>
              </Card>
              <div className="fixed bottom-0 right-0 flex flex-row-reverse space-x-4 space-x-reverse p-4">
                {activeChats.map((user) => (
                  <Chat
                    key={user.id}
                    currentUser={currentUser}
                    recipientUser={user}
                    onClose={() => handleCloseChat(user.id)}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Chat Drawer */}
      <Drawer
        open={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        placement="right"
        size="sm"
        className="bg-[#111827]"
      >
        <div className="h-full flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar
                src={`https://api.dicebear.com/6.x/initials/svg?seed=${selectedUser?.userName}`}
                className="w-10 h-10"
              />
              <span className="font-semibold text-white">
                {selectedUser?.userName}
              </span>
            </div>
            <Button
              isIconOnly
              variant="light"
              onPress={() => setIsChatOpen(false)}
              className="text-gray-400"
            >
              <FaTimes />
            </Button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.sender === auth.currentUser.uid
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    message.sender === auth.currentUser.uid
                      ? "bg-purple-500 text-white"
                      : "bg-gray-700 text-white"
                  }`}
                >
                  <p>{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {format(message.timestamp, "HH:mm")}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="flex-1"
                classNames={{
                  input: "text-white",
                }}
              />
              <Button
                color="secondary"
                isIconOnly
                className="bg-gradient-to-r from-violet-500 to-fuchsia-500"
                onPress={() => {
                  if (!chatMessage.trim()) return;
                  setMessages([
                    ...messages,
                    {
                      sender: auth.currentUser.uid,
                      content: chatMessage,
                      timestamp: new Date(),
                    },
                  ]);
                  setChatMessage("");
                }}
              >
                <FaPaperPlane />
              </Button>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
}

export default Community;
