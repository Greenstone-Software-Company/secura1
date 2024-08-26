import React, { useState, KeyboardEvent } from 'react';
import { useSession } from 'next-auth/react';
import styles from './MeetingRoom.module.css';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
}

const MeetingRoom: React.FC = () => {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        sender: session?.user?.name || 'Anonymous',
        content: newMessage,
        timestamp: new Date(),
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messageList}>
        {messages.length === 0 ? (
          <div className={styles.emptyState}>No messages yet. Start a conversation!</div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={styles.message}>
              <div className={styles.sender}>{msg.sender}</div>
              <div className={styles.messageContent}>
                <p className={styles.messageText}>{msg.content}</p>
              </div>
              <div className={styles.timestamp}>{msg.timestamp.toLocaleTimeString()}</div>
            </div>
          ))
        )}
      </div>
      <div className={styles.messageInputContainer}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className={styles.messageInput}
        />
        <button onClick={sendMessage} className={styles.sendButton}>Send</button>
      </div>
    </div>
  );
};

export default MeetingRoom;