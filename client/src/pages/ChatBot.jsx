import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardBody,
  Input,
  Button,
  Avatar,
  ScrollShadow,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { chatService } from "../services/chatService";
import {
  elevenLabsService,
  AVAILABLE_VOICES,
} from "../services/elevenLabsService";
import { auth } from "../services/firebaseConfig";
import { useNavigate } from "react-router-dom";
import Typewriter from "typewriter-effect";
import { motion } from "framer-motion";
import {
  FaMicrophone,
  FaPaperPlane,
  FaHeart,
  FaVolumeMute,
  FaVolumeUp,
  FaLeaf,
} from "react-icons/fa";
import { MdSelfImprovement } from "react-icons/md";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [typingMessage, setTypingMessage] = useState(null);
  const [loadingChats, setLoadingChats] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const currentAudioRef = useRef(null);
  const [userMood, setUserMood] = useState(null);
  const moodOptions = [
    "😊 Great",
    "😐 Okay",
    "😔 Down",
    "😰 Anxious",
    "🆘 Need Help",
  ];
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const currentTime = new Date().toLocaleTimeString();
  const currentDate = new Date().toLocaleDateString();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowVoiceSettings(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const welcomeMessage = {
    _id: "welcome",
    text: "Hi, I'm MindfulAI, your mental health companion. I'm here to listen, support, and guide you. How are you feeling today?",
    sender: "bot",
    timestamp: new Date(),
  };
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState({
    id: AVAILABLE_VOICES.female.domi.id,
    name: AVAILABLE_VOICES.female.domi.name,
    language: AVAILABLE_VOICES.female.domi.language,
  });

  const [voiceCategory, setVoiceCategory] = useState("female");
  const VoiceSettings = () => (
    <div className="absolute top-full right-0 mt-2 bg-slate-900/95 p-4 rounded-lg shadow-xl border border-purple-500/20 z-50 w-[280px] md:w-auto">
      <div className="flex flex-col gap-2">
        <Select
          size="sm"
          className="w-full"
          value={voiceCategory}
          onChange={(e) => setVoiceCategory(e.target.value)}
        >
          {voiceCategories.map((category) => (
            <SelectItem key={category.key} value={category.key}>
              {category.label}
            </SelectItem>
          ))}
        </Select>
        <Select
          size="sm"
          className="w-full"
          value={selectedVoice.id}
          onChange={(e) => {
            const voices = AVAILABLE_VOICES[voiceCategory];
            const voice = Object.values(voices).find(
              (v) => v.id === e.target.value
            );
            setSelectedVoice(voice);
          }}
        >
          {AVAILABLE_VOICES[voiceCategory] &&
            Object.values(AVAILABLE_VOICES[voiceCategory]).map((voice) => (
              <SelectItem key={voice.id} value={voice.id}>
                {voice.name}
              </SelectItem>
            ))}
        </Select>
      </div>
    </div>
  );
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const CrisisResources = () => (
    <div className="text-xs text-white/60 mt-2 text-center">
      <p>If you're in crisis, please reach out:</p>
      <p className="font-bold">Emergency: 911 | Crisis Hotline: 988</p>
    </div>
  );

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

  const stopSpeaking = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    setIsSpeaking(false);
  };
  const toggleAudio = () => {
    if (isSpeaking) {
      stopSpeaking();
    }
    setAudioEnabled(!audioEnabled);
  };
  const voiceCategories = Object.entries(AVAILABLE_VOICES).map(
    ([key, value]) => ({
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      voices: Object.values(value),
    })
  );

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
      if (audioEnabled) {
        await speakResponse(response, selectedVoice.id);
      }
      if (response && typeof response === "string") {
        setTypingMessage(response);
        const typingDuration = response.length * 50;

        setTimeout(async () => {
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

          if (audioEnabled) {
            await speakResponse(response, selectedVoice.id);
          }
        }, typingDuration);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const speakResponse = async (text, voiceId) => {
    if (!audioEnabled) return;

    try {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }

      setIsSpeaking(true);
      const audioUrl = await elevenLabsService.textToSpeech(text, voiceId);
      const audio = new Audio(audioUrl);
      currentAudioRef.current = audio;

      audio.onended = () => {
        setIsSpeaking(false);
        currentAudioRef.current = null;
      };

      await audio.play();
    } catch (error) {
      console.error("Failed to speak response:", error);
      setIsSpeaking(false);
    }
  };

  const startVoiceInput = () => {
    if (isTyping) return;

    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  return (
    <div className="h-[40rem] w-full flex items-center justify-center p-4">
      <div className="w-full max-w-3xl h-[37.5rem]">
        <Card className="h-full bg-slate-900/90 backdrop-blur-xl border border-purple-500/20 rounded-lg shadow-xl">
          <div className="p-4 border-b border-purple-500/20 bg-purple-900/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar
                  icon={<MdSelfImprovement />}
                  className="bg-gradient-to-br from-purple-400 to-violet-500"
                />
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    MindfulAI
                  </h2>
                  <p className="text-sm text-purple-200/60">
                    Your Mental Health Companion
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {audioEnabled && (
                  <div className="flex gap-2">
                    <Select
                      size="sm"
                      className="w-32"
                      value={voiceCategory}
                      onChange={(e) => setVoiceCategory(e.target.value)}
                    >
                      {voiceCategories.map((category) => (
                        <SelectItem key={category.key} value={category.key}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </Select>
                    <Select
                      size="sm"
                      className="w-32"
                      value={selectedVoice.id}
                      onChange={(e) => {
                        const voices = AVAILABLE_VOICES[voiceCategory];
                        const voice = Object.values(voices).find(
                          (v) => v.id === e.target.value
                        );
                        setSelectedVoice(voice);
                      }}
                    >
                      {AVAILABLE_VOICES[voiceCategory] &&
                        Object.values(AVAILABLE_VOICES[voiceCategory]).map(
                          (voice) => (
                            <SelectItem key={voice.id} value={voice.id}>
                              {voice.name}
                            </SelectItem>
                          )
                        )}
                    </Select>
                  </div>
                )}
                <Button
                  isIconOnly
                  onPress={toggleAudio}
                  className="bg-purple-700/30 text-white hover:bg-purple-700/50"
                >
                  {audioEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
                </Button>
              </div>
            </div>

            <div className="flex gap-2 mt-4 justify-center">
              {moodOptions.map((mood) => (
                <Button
                  key={mood}
                  size="sm"
                  className={`${
                    userMood === mood
                      ? "bg-purple-500 text-white"
                      : "bg-purple-900/30 text-white/70 hover:bg-purple-700/50"
                  } transition-all`}
                  onPress={() => setUserMood(mood)}
                >
                  {mood}
                </Button>
              ))}
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
                      <div className="absolute -top-2 -right-2 text-purple-400 animate-pulse">
                        <FaHeart size={24} />
                      </div>
                      <MdSelfImprovement
                        size={48}
                        className="mb-4 text-purple-500"
                      />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-center">
                      Welcome to Your Safe Space
                    </h3>
                    <p className="text-center">
                      I'm here to listen and support you. How are you feeling
                      today?
                    </p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <motion.div
                      key={message._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-start gap-2 ${
                        message.sender === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      {message.sender === "bot" && (
                        <Avatar
                          icon={<MdSelfImprovement />}
                          className="bg-gradient-to-br from-purple-400 to-violet-500"
                        />
                      )}
                      <div
                        className={`max-w-[85%] md:max-w-[70%] rounded-lg p-4 ${
                          message.sender === "user"
                            ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white"
                            : "bg-slate-800/80 text-white/90"
                        }`}
                      >
                        <div className="break-words">{message.text}</div>
                      </div>
                      {message.sender === "user" && (
                        <Avatar
                          src={auth.currentUser?.photoURL}
                          className="bg-gradient-to-br from-purple-600 to-violet-600"
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
                      icon={<MdSelfImprovement />}
                      className="bg-gradient-to-br from-purple-400 to-violet-500"
                    />
                    <div className="max-w-[85%] md:max-w-[70%] rounded-lg p-4 bg-slate-800/80 text-white/90">
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

            <CrisisResources />

            <div className="flex gap-2 pt-4 border-t border-purple-500/20">
              <Input
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  setIsTyping(true);
                }}
                placeholder="Share your thoughts..."
                className="flex-grow"
                classNames={{
                  input: "text-white",
                  inputWrapper:
                    "bg-slate-800/50 hover:bg-slate-800/70 group-data-[focused=true]:bg-slate-800/70",
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
                className="bg-gradient-to-r from-purple-600 to-violet-600 text-white"
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
                    : "bg-gradient-to-r from-purple-600 to-violet-600"
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
}

export default ChatBot;
