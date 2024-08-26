import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import styles from '../../styles/Chat.module.css';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
}

const ChatPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (id) {
      const fetchMessages = async () => {
        const res = await fetch(`/api/messages/${id}`);
        const data = await res.json();
        setMessages(data);
      };
      fetchMessages();
    }
  }, [id]);

  const sendMessage = async () => {
    if (newMessage.trim() && session?.user?.id) {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newMessage,
          receiverId: id,
          senderId: session.user.id,
        }),
      });
      const data = await res.json();
      setMessages([...messages, data]);
      setNewMessage('');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.messageList}>
        {messages.map(message => (
          <div
            key={message.id}
            className={`${styles.message} ${
              message.senderId === session?.user?.id ? styles.sent : styles.received
            }`}
          >
            {message.content}
          </div>
        ))}
      </div>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className={styles.input}
        />
        <button onClick={sendMessage} className={styles.sendButton}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;