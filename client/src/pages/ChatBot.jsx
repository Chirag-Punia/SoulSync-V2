import { useState, useEffect } from "react";
import { Card, CardBody, Input, Button } from "@nextui-org/react";
import { chatService } from "../services/api";
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
  const navigate = useNavigate();

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

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isLoading || !auth.currentUser) return;

    const userId = auth.currentUser.uid;
    const userMessage = {
      _id: Date.now(),
      text: newMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");
    setIsLoading(true);

    try {
      const { response } = await chatService.sendMessage(userId, newMessage);

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

  return (
     <div className="max-w-3xl mx-auto">
    <Card className="h-[600px] flex flex-col">
      <CardBody className="flex flex-col p-4">
        <div className="flex-grow overflow-y-auto mb-4 space-y-4">
          {loadingChats ? ( // Display spinner if chats are loading
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
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700"
                  }`}
                >
                  <div>{message.text}</div>
                </div>
              </div>
            ))
          )}
          {typingMessage && (
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
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow"
            disabled={isLoading}
          />
          <Button
            color="primary"
            onPress={handleSendMessage}
            isLoading={isLoading}
          >
            Send
          </Button>
        </div>
      </CardBody>
    </Card>
  </div>
  );
}

export default ChatBot;
