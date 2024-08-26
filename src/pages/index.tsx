import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

interface Conversation {
  id: string;
  contactName: string;
  lastMessage: string;
  timestamp: string;
}

const HomePage: React.FC = () => {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    const fetchConversations = async () => {
      const res = await fetch('/api/conversations');
      const data = await res.json();
      setConversations(data);
    };
    fetchConversations();
  }, []);

  return (
    <div className={styles.container}>
      <h1>Recent Conversations</h1>
      <ul className={styles.conversationList}>
        {conversations.map(conv => (
          <li key={conv.id} className={styles.conversationItem}>
            <Link href={`/chat/${conv.id}`}>
              <div className={styles.conversationInfo}>
                <h3>{conv.contactName}</h3>
                <p>{conv.lastMessage}</p>
              </div>
              <span className={styles.timestamp}>{conv.timestamp}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;