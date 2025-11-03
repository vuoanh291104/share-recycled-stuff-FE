import { createContext, useContext, useState, useEffect } from 'react';
import { getData } from '../api/api';
import { EventSourcePolyfill } from 'event-source-polyfill';

interface NotiCount {
  message: string;
  result: {
    count: number;
  };
}

interface NotificationData {
  id: number;
  title: string;
  content: string;
  read: boolean;
  createdAt: string;
}

interface NotificationContextType {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  refreshUnread: () => Promise<void>;
  latestNotification?: NotificationData | null;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [latestNotification, setLatestNotification] = useState<NotificationData | null>(null);

  const token = localStorage.getItem('accessToken');
  const BeURL = import.meta.env.VITE_URL_BACKEND;

  const refreshUnread = async () => {
    try {
      const res = await getData<NotiCount>('/api/notifications/unread-count');
      setUnreadCount(res.result.count);
    } catch (err) {
      console.error('Lỗi khi lấy số thông báo chưa đọc:', err);
    }
  };

  // Lấy số chưa đọc khi khởi tạo
  useEffect(() => {
    refreshUnread();

    const eventSource = new EventSourcePolyfill(`${BeURL}/api/notifications/stream`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      heartbeatTimeout: 1000 * 60 * 30, 
      withCredentials: true,
    });

    (eventSource as any).addEventListener('notification', (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Nhận noti mới:', data);
        setLatestNotification(data);
        setUnreadCount((prev) => prev + 1);
      } catch (err) {
        console.error('Lỗi parse noti SSE:', err);
      }
    });

    (eventSource as any).addEventListener('connected', (event: MessageEvent) => {
      console.log(' Kết nối SSE thành công:', event.data);
    });

    eventSource.onerror = (err) => {
      console.error('Lỗi SSE:', err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);



  return (
    <NotificationContext.Provider value={{ unreadCount, setUnreadCount, refreshUnread, latestNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used inside NotificationProvider');
  return ctx;
};
