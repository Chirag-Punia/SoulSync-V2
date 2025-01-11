import { useState } from 'react';
import { Card, CardBody, Input, Button } from "@nextui-org/react";
import { chatService } from '../services/api';

// Sample chat messages
const initialMessages = [
  { id: 1, text: "Hello! How are you feeling today?", sender: "bot" },
  { id: 2, text: "I'm feeling a bit anxious", sender: "user" },
  { id: 3, text: "I understand. Let's talk about what's causing your anxiety.", sender: "bot" },
];

function ChatBot() {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: newMessage,
      sender: "user",
    };

    setMessages([...messages, userMessage]);
    setNewMessage("");

    try {
      // Simulating API call
      // const response = await chatService.sendMessage(newMessage);
      const botResponse = {
        id: messages.length + 2,
        text: "I'm here to help. Can you tell me more about what you're experiencing?",
        sender: "bot",
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
    } catch (error) {
      console.error('Failed to get bot response:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="h-[600px] flex flex-col">
        <CardBody className="flex flex-col p-4">
          <div className="flex-grow overflow-y-auto mb-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
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
                  {message.text}
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-grow"
            />
            <Button color="primary" onClick={handleSendMessage}>
              Send
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default ChatBot;