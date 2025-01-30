import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardBody,
  Input,
  Button,
  Divider,
  Avatar,
  ScrollShadow,
} from "@nextui-org/react";
import { chatService } from "../services/chatService";
import { auth } from "../services/firebaseConfig";
import { useNavigate } from "react-router-dom";
import Typewriter from "typewriter-effect";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMicrophone,
  FaPaperPlane,
  FaPlus,
  FaTrash,
  FaRobot,
  FaBars,
} from "react-icons/fa";

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [typingMessage, setTypingMessage] = useState(null);
  const [loadingChats, setLoadingChats] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, typingMessage]);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.continuous = false;

      recognition.onstart = () => setIsRecording(true);
      recognition.onend = () => setIsRecording(false);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setNewMessage(transcript);
        sendMessageToAPI(transcript);
      };

      recognitionRef.current = recognition;
    } else {
      console.error("Speech recognition not supported in this browser.");
    }
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }
      await initializeChat(user.uid);
    });

    return () => unsubscribe();
  }, [navigate]);

  const initializeChat = async (userId) => {
    try {
      setLoadingChats(true);
      const chats = await chatService.initializeChat(userId);
      setMessages(chats);
    } catch (error) {
      console.error("Failed to initialize chat:", error);
    } finally {
      setLoadingChats(false);
    }
  };

  const sendMessageToAPI = async (message) => {
    if (!message.trim() || isLoading || !auth.currentUser) return;

    const userId = auth.currentUser.uid;
    const userMessage = {
      _id: Date.now(),
      text: message,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");
    setIsLoading(true);
    setIsTyping(true);

    try {
      const { response } = await chatService.sendMessage(userId, message);

      if (response && typeof response === "string") {
        setTypingMessage(response);
        const typingDuration = response.length * 50;

        setTimeout(() => {
          const botResponse = {
            _id: Date.now() + 1,
            text: response,
            sender: "bot",
            timestamp: new Date(),
          };

          setMessages((prev) => [...prev, botResponse]);
          chatService.saveChat(userId, [userMessage, botResponse]);
          setTypingMessage(null);
          setIsTyping(false);
        }, typingDuration);
      } else {
        console.error("Invalid response format", response);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startVoiceInput = () => {
    if (isTyping) {
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.start();

      setTimeout(() => {
        if (newMessage.trim()) {
          sendMessageToAPI(newMessage);
        }
      }, 500);
    } else {
      console.error("Speech recognition not initialized.");
    }
  };
  const startNewChat = async () => {
    if (!auth.currentUser) return;

    const newChat = {
      id: Date.now().toString(),
      userId: auth.currentUser.uid,
      messages: [],
      createdAt: new Date(),
      title: "New Chat",
    };

    setChatHistory([newChat, ...chatHistory]);
    setActiveChatId(newChat.id);
    setMessages([]);
  };

  const selectChat = async (chatId) => {
    setActiveChatId(chatId);
    const selectedChat = chatHistory.find((chat) => chat.id === chatId);
    if (selectedChat) {
      setMessages(selectedChat.messages);
    }
  };

  const deleteChat = async (chatId) => {
    setChatHistory(chatHistory.filter((chat) => chat.id !== chatId));
    if (activeChatId === chatId) {
      setActiveChatId(null);
      setMessages([]);
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] relative bg-gradient-to-br from-[#0F172A] to-[#1E293B]">
      <Button
        isIconOnly
        className="md:hidden fixed top-4 left-4 z-50 bg-gradient-to-r from-purple-600 to-pink-600"
        onPress={toggleSidebar}
      >
        <FaBars />
      </Button>

      <div className="h-full flex">
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3 }}
              className="fixed md:relative z-40 h-full"
            >
              <Card className="w-[280px] h-full bg-black/20 backdrop-blur-xl border border-white/10 rounded-none md:rounded-lg">
                <CardBody className="p-0">
                  <div className="p-4">
                    <Button
                      fullWidth
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      startContent={<FaPlus />}
                      onPress={startNewChat}
                    >
                      New Chat
                    </Button>
                  </div>
                  <Divider className="bg-white/10" />
                  <ScrollShadow className="h-[calc(100%-80px)]">
                    <div className="p-2 space-y-2">
                      {chatHistory.map((chat) => (
                        <motion.div
                          key={chat.id}
                          whileHover={{ scale: 1.02 }}
                          className={`p-3 rounded-lg cursor-pointer flex items-center justify-between group ${
                            activeChatId === chat.id
                              ? "bg-white/10"
                              : "hover:bg-white/5"
                          }`}
                          onClick={() => {
                            selectChat(chat.id);
                            if (window.innerWidth < 768) {
                              setIsSidebarOpen(false);
                            }
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            <Avatar
                              icon={<FaRobot />}
                              size="sm"
                              className="bg-gradient-to-br from-purple-500 to-pink-500"
                            />
                            <span className="text-white text-sm truncate max-w-[160px]">
                              {chat.title}
                            </span>
                          </div>
                          <Button
                            isIconOnly
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 bg-transparent text-red-500 hover:bg-red-500/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteChat(chat.id);
                            }}
                          >
                            <FaTrash size={14} />
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollShadow>
                </CardBody>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 h-full">
          <Card className="h-full bg-black/20 backdrop-blur-xl border border-white/10 rounded-none md:rounded-lg">
            <CardBody className="p-4 flex flex-col h-full">
              <ScrollShadow className="flex-grow mb-4">
                <div className="space-y-4 min-h-full">
                  {loadingChats ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-white/60 p-4">
                      <FaRobot size={48} className="mb-4" />
                      <h3 className="text-xl font-semibold mb-2 text-center">
                        How can I help you today?
                      </h3>
                      <p className="text-center">
                        Start a conversation by typing a message below.
                      </p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <motion.div
                        key={message._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${
                          message.sender === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[85%] md:max-w-[70%] rounded-lg p-4 ${
                            message.sender === "user"
                              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                              : "bg-white/10 text-white/90"
                          }`}
                        >
                          <div className="break-words">{message.text}</div>
                        </div>
                      </motion.div>
                    ))
                  )}
                  {typingMessage && !isRecording && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="max-w-[85%] md:max-w-[70%] rounded-lg p-4 bg-white/10 text-white/90">
                        <Typewriter
                          options={{
                            strings: [typingMessage],
                            autoStart: true,
                            delay: 50,
                            cursor: "",
                          }}
                        />
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollShadow>

              <div className="flex gap-2 pt-4 border-t border-white/10">
                <Input
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    setIsTyping(true);
                  }}
                  placeholder="Type your message..."
                  className="flex-grow"
                  classNames={{
                    input: "text-white",
                    inputWrapper:
                      "bg-white/5 hover:bg-white/10 group-data-[focused=true]:bg-white/10",
                  }}
                  disabled={isLoading}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isTyping && !e.shiftKey) {
                      e.preventDefault();
                      sendMessageToAPI(newMessage);
                      setIsTyping(false);
                    }
                  }}
                />
                <Button
                  isIconOnly
                  onPress={() => sendMessageToAPI(newMessage)}
                  isLoading={isLoading}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                >
                  <FaPaperPlane />
                </Button>
                <Button
                  isIconOnly
                  onPress={startVoiceInput}
                  isDisabled={isRecording}
                  className={`${
                    isRecording
                      ? "bg-red-500"
                      : "bg-gradient-to-r from-blue-600 to-cyan-600"
                  } text-white`}
                >
                  <FaMicrophone />
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ChatBot;
