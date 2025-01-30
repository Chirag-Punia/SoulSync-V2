class LocalChatService {
  constructor() {
    this.messages = new Map();
    this.subscribers = new Map();
  }

  createChatRoomId(user1Id, user2Id) {
    return [user1Id, user2Id].sort().join("_");
  }

  sendMessage(chatRoomId, message) {
    if (!this.messages.has(chatRoomId)) {
      this.messages.set(chatRoomId, []);
    }

    const newMessage = {
      id: Date.now().toString(),
      ...message,
      timestamp: new Date(),
    };

    this.messages.get(chatRoomId).push(newMessage);

    if (this.subscribers.has(chatRoomId)) {
      this.subscribers
        .get(chatRoomId)
        .forEach((callback) => callback(this.messages.get(chatRoomId)));
    }

    return newMessage;
  }

  subscribeToMessages(chatRoomId, callback) {
    if (!this.subscribers.has(chatRoomId)) {
      this.subscribers.set(chatRoomId, new Set());
    }

    this.subscribers.get(chatRoomId).add(callback);

    if (this.messages.has(chatRoomId)) {
      callback(this.messages.get(chatRoomId));
    }

    return () => {
      this.subscribers.get(chatRoomId).delete(callback);
    };
  }
}

export const localChatService = new LocalChatService();
