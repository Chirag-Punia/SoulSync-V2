import { useState, useEffect, useRef } from "react";
import { Card, CardBody, Input, Button } from "@nextui-org/react";
import { chatService } from "../services/chatService";
import { auth } from "../services/firebaseConfig";
import { useNavigate } from "react-router-dom";
import Typewriter from "typewriter-effect";
import { Spinner } from "@nextui-org/react";

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [typingMessage, setTypingMessage] = useState(null);
  const [loadingChats, setLoadingChats] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

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
        handleSendMessage(transcript);
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

  const handleSendMessage = async (message = newMessage) => {
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
          handleSendMessage(newMessage);
        }
      }, 500);
    } else {
      console.error("Speech recognition not initialized.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="h-[600px] flex flex-col">
        <CardBody className="flex flex-col p-4">
          <div className="flex-grow overflow-y-auto mb-4 space-y-4">
            {loadingChats ? (
              <div className="flex justify-center items-center h-full">
                <Spinner size="xl" />
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message._id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                        : "bg-gray-100 dark:bg-gray-800 backdrop-blur-lg bg-white/10 dark:bg-black/10"
                    }`}
                  >
                    <div>{message.text}</div>
                  </div>
                </div>
              ))
            )}
            {typingMessage && !isRecording && (
              <div className="flex justify-start">
                <div className="max-w-[70%] rounded-lg p-3 bg-gray-100 dark:bg-gray-700">
                  <Typewriter
                    options={{
                      strings: [typingMessage],
                      autoStart: true,
                      delay: 50,
                      cursor: "▋",
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                setIsTyping(true);
              }}
              placeholder="Type your message..."
              className="flex-grow"
              disabled={isLoading || isTyping}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isTyping) {
                  handleSendMessage();
                  setIsTyping(false);
                }
              }}
            />
            <Button
              onPress={handleSendMessage}
              isLoading={isLoading}
              color="secondary"
              variant="shadow"
              disabled={isTyping}
            >
              Send
            </Button>
            <Button
              onPress={startVoiceInput}
              color="primary"
              variant="shadow"
              isDisabled={isRecording || isTyping}
            >
              {isRecording ? "Listening..." : "🎤 Speak"}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default ChatBot;
