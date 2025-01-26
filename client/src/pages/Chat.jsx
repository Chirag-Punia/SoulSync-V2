// components/Chat.jsx
import { useState, useEffect, useRef } from "react";
import { Card, CardBody, Input, Button, Avatar } from "@nextui-org/react";
import { localChatService } from "../services/localChatService";
import { FaPaperPlane, FaTimes } from "react-icons/fa";
import { format } from "date-fns";

const Chat = ({ currentUser, recipientUser, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const chatRoomRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!currentUser || !recipientUser) return;

    // Create chat room ID
    const chatRoomId = localChatService.createChatRoomId(
      currentUser.id,
      recipientUser.id
    );
    chatRoomRef.current = chatRoomId;

    // Subscribe to messages
    const unsubscribe = localChatService.subscribeToMessages(
      chatRoomId,
      (newMessages) => {
        setMessages(newMessages || []);
        scrollToBottom();
      }
    );

    return () => unsubscribe();
  }, [currentUser, recipientUser]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !chatRoomRef.current) return;

    localChatService.sendMessage(chatRoomRef.current, {
      senderId: currentUser.id,
      senderName: currentUser.userName,
      recipientId: recipientUser.id,
      recipientName: recipientUser.userName,
      content: newMessage.trim(),
    });

    setNewMessage("");
  };

  return (
    <Card className="fixed right-0 bottom-0 w-96 h-[500px] bg-gradient-to-br from-gray-900 to-gray-800 rounded-tl-lg shadow-xl">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Avatar
            src={`https://api.dicebear.com/6.x/initials/svg?seed=${recipientUser.userName}`}
            className="w-10 h-10"
          />
          <span className="font-semibold text-white">
            {recipientUser.userName}
          </span>
        </div>
        <Button
          isIconOnly
          variant="light"
          onPress={onClose}
          className="text-gray-400 hover:text-gray-200"
        >
          <FaTimes />
        </Button>
      </div>

      {/* Messages Area */}
      <div className="h-[380px] overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.senderId === currentUser.id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                msg.senderId === currentUser.id
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-white"
              }`}
            >
              <p className="text-xs text-gray-300 mb-1">
                {msg.senderId === currentUser.id ? "You" : msg.senderName}
              </p>
              <p className="break-words">{msg.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {format(new Date(msg.timestamp), "HH:mm")}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1"
            classNames={{
              input: "text-white",
              inputWrapper: "bg-gray-800",
            }}
          />
          <Button
            isIconOnly
            color="secondary"
            onPress={handleSendMessage}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <FaPaperPlane />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default Chat;
