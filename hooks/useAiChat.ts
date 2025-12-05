import { useState, useEffect, useCallback, useRef } from 'react';
import { streamMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: Date;
}

interface UseAiChatOptions {
  autoLoad?: boolean;
}

export const useAiChat = ({ autoLoad = true }: UseAiChatOptions = {}) => {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load from local storage
  useEffect(() => {
    if (autoLoad) {
      const saved = localStorage.getItem('nexus_chats');
      if (saved) {
        try {
          const parsed = JSON.parse(saved).map((c: any) => ({
            ...c,
            updatedAt: new Date(c.updatedAt),
            messages: c.messages.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }))
          }));
          setChats(parsed);
          if (parsed.length > 0) {
            setCurrentChatId(parsed[0].id);
          }
        } catch (e) {
          console.error("Failed to load chats", e);
        }
      }
      setIsLoading(false);
    }
  }, [autoLoad]);

  // Save to local storage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('nexus_chats', JSON.stringify(chats));
    }
  }, [chats, isLoading]);

  const currentChat = chats.find(c => c.id === currentChatId) || null;

  const createChat = useCallback(() => {
    const newChat: ChatSession = {
      id: Date.now().toString(),
      title: 'New Conversation',
      messages: [],
      updatedAt: new Date()
    };
    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    return newChat.id;
  }, []);

  const deleteChat = useCallback((id: string) => {
    setChats(prev => prev.filter(c => c.id !== id));
    if (currentChatId === id) {
      setCurrentChatId(null);
    }
  }, [currentChatId]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    let activeChatId = currentChatId;
    if (!activeChatId) {
      activeChatId = createChat();
    }

    const userMsg: ChatMessage = {
      role: 'user',
      text,
      timestamp: new Date()
    };

    // Optimistic Update
    setChats(prev => prev.map(c => {
      if (c.id === activeChatId) {
        // Update title if it's the first message
        const title = c.messages.length === 0 ? text.slice(0, 30) + (text.length > 30 ? '...' : '') : c.title;
        return {
          ...c,
          title,
          messages: [...c.messages, userMsg],
          updatedAt: new Date()
        };
      }
      return c;
    }));

    setIsSending(true);

    // Placeholder for AI response
    const aiMsgId = Date.now().toString(); // Temporary ID for tracking
    const aiMsg: ChatMessage = {
      role: 'model',
      text: '', // Start empty
      timestamp: new Date()
    };

    setChats(prev => prev.map(c => {
      if (c.id === activeChatId) {
        return { ...c, messages: [...c.messages, aiMsg] };
      }
      return c;
    }));

    try {
      // Get conversation history for context
      const chat = chats.find(c => c.id === activeChatId);
      const history = chat ? chat.messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })) : [];

      const stream = streamMessageToGemini(text, history);
      let fullText = '';

      for await (const chunk of stream) {
        fullText += chunk;
        
        // Update the last message (AI response) with current accumulated text
        setChats(prev => prev.map(c => {
          if (c.id === activeChatId) {
            const msgs = [...c.messages];
            const lastMsg = msgs[msgs.length - 1];
            if (lastMsg.role === 'model') {
              lastMsg.text = fullText;
            }
            return { ...c, messages: msgs };
          }
          return c;
        }));
      }

    } catch (error) {
      console.error("Chat Error:", error);
      setChats(prev => prev.map(c => {
        if (c.id === activeChatId) {
          const msgs = [...c.messages];
          const lastMsg = msgs[msgs.length - 1];
          lastMsg.text = "Sorry, I encountered an error. Please try again.";
          lastMsg.isError = true;
          return { ...c, messages: msgs };
        }
        return c;
      }));
    } finally {
      setIsSending(false);
    }
  }, [createChat, currentChatId, chats]);

  return {
    chats,
    currentChat,
    currentChatId,
    setCurrentChatId,
    createChat,
    deleteChat,
    sendMessage,
    isSending,
    isLoading
  };
};