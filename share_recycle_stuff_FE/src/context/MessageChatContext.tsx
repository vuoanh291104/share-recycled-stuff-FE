import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { MessageChat } from '../types/schema';

interface MessageChatContextType {
  messageRealtime: MessageChat[];
  sendMessage: (receiverId: number, content: string) => void;
  connect: () => void;
  disconnect: () => void;
  socketConnected: boolean;
}

const MessageChatContext = createContext<MessageChatContextType | undefined>(undefined);

export const MessageChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messageRealtime, setMessageRealtime] = useState<MessageChat[]>([]);
  const [socketConnected, setSocketConnected] = useState<boolean>(false);
  const socketRef = useRef<WebSocket | null>(null);

  // Lấy token hiện tại từ localStorage
  const [token, setToken] = useState<string | null>(localStorage.getItem('accessToken'));

  //Lắng nghe sự kiện "token-updated" để cập nhật token ngay khi login
  useEffect(() => {
    const updateToken = () => {
      const newToken = localStorage.getItem('accessToken');
      setToken(newToken);
      console.log('[WebSocket] Token updated:', newToken);
    };

    // Lắng nghe event token-updated
    window.addEventListener('token-updated', updateToken);
    return () => window.removeEventListener('token-updated', updateToken);
  }, []);

  const base_url = import.meta.env.VITE_CHAT_SERVICE_WS_URL;
  const WS_URL = `${base_url}?token=${token}`;

  const userInfo = localStorage.getItem('userInfo');
  const user = userInfo ? JSON.parse(userInfo) : null;
  const senderId = user?.accountId ?? null;

  const connect = () => {
    if (!token || !WS_URL) {
      console.warn('[WebSocket] Missing token, skip connect');
      return;
    }

    // Nếu socket đã mở, không tạo mới
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) return;

    const socket = new WebSocket(WS_URL);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('[WebSocket] Connected');
      setSocketConnected(true);
      socket.send(
        JSON.stringify({
          type: 'ping',
          content: `hello from user ${senderId}`,
        })
      );
    };

    socket.onmessage = (event) => {
      try {
        const msg: MessageChat = JSON.parse(event.data);
        if (msg.type === 'text' && msg.content) {
          setMessageRealtime((prev) => [...prev, msg]);
        }
      } catch (error) {
        console.error('[WebSocket] Invalid message format', error);
      }
    };

    socket.onclose = (event) => {
      console.warn('[WebSocket] Disconnected', event.code, event.wasClean);
      setSocketConnected(false);
    };

    socket.onerror = (error) => {
      console.error('[WebSocket] Error:', error);
    };
  };

  const sendMessage = (receiverId: number, content: string) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      console.warn('[WebSocket] Cannot send message: socket not connected');
      return;
    }

    const now = new Date().toISOString();
    const message: Partial<MessageChat> = {
      type: 'text',
      receiver_id: receiverId,
      content,
    };

    socketRef.current.send(JSON.stringify(message));

    // append ngay để UI phản hồi nhanh
    const tempId = Date.now();
    setMessageRealtime((prev) => [
      ...prev,
      {
        ...message,
        sender_id: senderId,
        created_at: now,
        id: tempId,
      } as MessageChat,
    ]);
  };

  const disconnect = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.close();
      setSocketConnected(false);
    }
  };

  // Tự động connect khi token có
  useEffect(() => {
    if (token) {
      connect();
      return () => disconnect();
    }
  }, [token]);

  return (
    <MessageChatContext.Provider
      value={{
        messageRealtime,
        sendMessage,
        connect,
        disconnect,
        socketConnected,
      }}
    >
      {children}
    </MessageChatContext.Provider>
  );
};

export const useMessageChat = (): MessageChatContextType => {
  const context = useContext(MessageChatContext);
  if (!context) throw new Error('useMessageChat must be used within a MessageChatProvider');
  return context;
};
