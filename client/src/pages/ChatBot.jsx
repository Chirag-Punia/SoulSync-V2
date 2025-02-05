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


  return (
    <div className="h-[40rem] w-full flex items-center justify-center p-4">
      <div className="w-full max-w-3xl h-[37.5rem]">
        <Card className="h-full bg-black/20 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl">
          {/* Chat Header */}
          <div className="p-4 border-b border-white/10 bg-white/5">
            <div className="flex items-center gap-3">
              <Avatar
                icon={<FaRobot />}
                className="bg-gradient-to-br from-purple-600 to-pink-600"
              />
              <div>
                <h2 className="text-lg font-semibold text-white">AI Assistant</h2>
                <p className="text-sm text-white/60">Always here to help</p>
              </div>
            </div>
          </div>

          <CardBody className="p-4 flex flex-col">
            <ScrollShadow className="flex-grow mb-4">
              <div className="space-y-4 min-h-full">
                {loadingChats ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-white/60 p-4">
                    <div className="relative">
                      <div className="absolute -top-2 -right-2 text-yellow-400 animate-pulse">
                        <MdMood size={24} />
                      </div>
                      <FaRobot size={48} className="mb-4 text-purple-500" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-center">
                      Hi! I'm your AI Assistant
                    </h3>
                    <p className="text-center">
                      I'm here to help! Start a conversation by typing a message below.
                    </p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <motion.div
                      key={message._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-start gap-2 ${
                        message.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {message.sender === "bot" && (
                        <Avatar
                          icon={<FaRobot />}
                          className="bg-gradient-to-br from-purple-600 to-pink-600"
                        />
                      )}
                      <div
                        className={`max-w-[85%] md:max-w-[70%] rounded-lg p-4 ${
                          message.sender === "user"
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                            : "bg-white/10 text-white/90"
                        }`}
                      >
                        <div className="break-words">{message.text}</div>
                      </div>
                      {message.sender === "user" && (
                        <Avatar
                          src={auth.currentUser.photoURL}
                          className="bg-gradient-to-br from-blue-600 to-cyan-600"
                        />
                      )}
                    </motion.div>
                  ))
                )}
                {typingMessage && !isRecording && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2"
                  >
                    <Avatar
                      icon={<FaRobot />}
                      className="bg-gradient-to-br from-purple-600 to-pink-600"
                    />
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
  );
};

export default ChatBot;