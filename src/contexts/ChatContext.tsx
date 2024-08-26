import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface ChatContextType {
  conversations: any[];
  activeChat: string | null;
  setActiveChat: (chatId: string) => void;
  sendMessage: (content: string, receiverId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchConversations = async () => {
      const res = await fetch('/api/conversations');
      const data = await res.json();
      setConversations(data);
    };
    if (session) {
      fetchConversations();
    }
  }, [session]);

  const sendMessage = async (content: string, receiverId: string) => {
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, receiverId }),
    });
    const newMessage = await res.json();
    // Update conversations state
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === receiverId
          ? { ...conv, lastMessage: content, timestamp: new Date().toISOString() }
          : conv
      )
    );
  };

  return (
    <ChatContext.Provider value={{ conversations, activeChat, setActiveChat, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};