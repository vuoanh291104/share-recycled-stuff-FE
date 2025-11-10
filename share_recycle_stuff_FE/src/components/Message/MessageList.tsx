import { useEffect, useRef, useState, useCallback } from "react";
import { useMessageChat } from "../../context/MessageChatContext";
import type { MessageChat } from "../../types/schema";
import axios from "axios";
import styles from "./Message.module.css";

interface MessageListProp {
  recipientId: number;
}

interface MessageResponse {
  success: boolean;
  page: number;
  size: number;
  messages: MessageChat[];
}

const MessageList = ({ recipientId }: MessageListProp) => {
  const { messageRealtime } = useMessageChat();
  const [messages, setMessages] = useState<MessageChat[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);

  const API_BASE = import.meta.env.VITE_CHAT_SERVICE_HTTP_URL;
  const token = localStorage.getItem("accessToken");

  const userInfo = localStorage.getItem("userInfo");
  const user = userInfo ? JSON.parse(userInfo) : null;
  const loggedUserId = user?.accountId;

  // Fetch lịch sử tin nhắn
  const fetchMessages = useCallback(
    async (pageNum: number) => {
      if (!recipientId || !token || isFetchingRef.current) return;
      isFetchingRef.current = true;
      try {
        const res = await axios.get<MessageResponse>(
          `${API_BASE}/messages/history/${recipientId}?page=${pageNum}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const newMsgs = Array.isArray(res.data.messages) ? res.data.messages : [];

        if (newMsgs.length === 0) setHasMore(false);

        // Merge với messages hiện tại, sắp xếp theo thời gian
        setMessages(prev => {
          const idsPrev = new Set(prev.map(m => m.id));
          const msgsToAdd = newMsgs.filter(m => !idsPrev.has(m.id));
          const combined = [...msgsToAdd, ...prev]; // page cũ thêm lên đầu
          return combined.sort((a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        });
      } catch (error) {
        console.error("❌ Fetch messages error:", error);
      } finally {
        isFetchingRef.current = false;
      }
    },
    [recipientId, token, API_BASE]
  );

  // Load lại khi recipientId thay đổi
  useEffect(() => {
    setMessages([]);
    setPage(0);
    setHasMore(true);
    fetchMessages(0);
  }, [recipientId, fetchMessages]);

  // Merge tin nhắn realtime
  useEffect(() => {
    if (!recipientId || !loggedUserId) return;

    setMessages(prev => {
      const newMessages = messageRealtime.filter(
        msg =>
          (msg.sender_id === recipientId && msg.receiver_id === loggedUserId) ||
          (msg.sender_id === loggedUserId && msg.receiver_id === recipientId)
      );

      const idsPrev = new Set(prev.map(m => m.id));
      const newMsgsToAdd = newMessages.filter(m => !idsPrev.has(m.id));

      const combined = [...prev, ...newMsgsToAdd];
      return combined.sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    });
  }, [messageRealtime, recipientId, loggedUserId]);

  // Auto scroll xuống cuối khi có tin nhắn mới
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  // Pagination khi scroll
  const handleScroll = () => {
    if (!containerRef.current || !hasMore || isFetchingRef.current) return;

    if (containerRef.current.scrollTop < 100) {
      const prevHeight = containerRef.current.scrollHeight;
      const nextPage = page + 1;
      fetchMessages(nextPage).then(() => {
        if (containerRef.current) {
          const newHeight = containerRef.current.scrollHeight;
          containerRef.current.scrollTop = newHeight - prevHeight;
        }
      });
      setPage(nextPage);
    }
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={styles.message_container}
    >
      {messages.length === 0 ? (
        <div className={styles.no_message}>Chưa có tin nhắn nào</div>
      ) : (
        messages.map((msg, index) => {
          const isMine = msg.sender_id === loggedUserId;
          return (
            <div
              key={msg.id || msg.created_at || index}
              className={`${styles.message_item} ${isMine ? styles.mine : styles.theirs}`}
            >
              <div className={styles.message_content}>{msg.content}</div>
              {msg.created_at && (
                <div className={styles.message_time}>
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default MessageList;
