import { useEffect, useRef, useState } from 'react';
import { deleteData, getData, putData } from '../../../api/api';
import type { NotificationType } from '../../../types/schema';
import styles from './Notification.module.css';
import NotificationItem from './NotificationItem';
import { useNotification } from '../../../context/NotificationContext';

interface NotiResponse {
  message: string;
  result: {
    totalElements: number;
    totalPages: number;
    size: number;
    content: NotificationType[];
  };
}

interface NotiUnread {
  message: string;
  result: NotificationType[];
}

const Notification = () => {
  const { unreadCount, setUnreadCount, latestNotification } = useNotification();

  const [listNoti, setListNoti] = useState<NotificationType[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isAll, setIsAll] = useState(true);
  const size = 10;
  const hasFetchRef = useRef(false);

  const getAll = async (pageNum: number) => {
    try {
      const res = await getData<NotiResponse>('/api/notifications', { page: pageNum, size });
      if (pageNum === 0) {
        setListNoti(res.result.content);
      } else {
        setListNoti((prev) => [...prev, ...res.result.content]);
      }
      setTotalPages(res.result.totalPages);
    } catch (error) {
      console.error(error);
    }
  };

  const getUnRead = async () => {
    try {
      const res = await getData<NotiUnread>('/api/notifications/unread');
      setListNoti(res.result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isAll) {
      if (page === 0 && hasFetchRef.current) return;
      hasFetchRef.current = true;
      getAll(page);
    }
  }, [page, isAll]);

  // Khi có noti mới từ SSE → thêm vào đầu danh sách
  useEffect(() => {
    if (latestNotification) {
      setListNoti((prev) => [latestNotification as unknown as NotificationType, ...prev]);
    }
  }, [latestNotification]);

  const handleLoadMore = () => {
    if (page < totalPages - 1) {
      setPage((prev) => prev + 1);
    }
  };

  const allRead = async () => {
    try {
      await putData('/api/notifications/mark-all-read', {});
      setUnreadCount(0);
      setListNoti((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error(error);
    }
  };

  const handleShowAll = async () => {
    setIsAll(true);
    setPage(0);
    setListNoti([]);
    await getAll(0);
  };

  const handleShowUnread = async () => {
    setIsAll(false);
    setListNoti([]);
    await getUnRead();
  };

  const onDelete = async (notiID: number) => {
    try {
      await deleteData(`/api/notifications/${notiID}`);
      let deletedNoti: NotificationType | undefined;
      setListNoti((prev) => {
        const found = prev.find((n) => n.id === notiID);
        deletedNoti = found;
        return prev.filter((n) => n.id !== notiID);
      });
      if (deletedNoti && !deletedNoti.read) {
        setUnreadCount(Math.max(0, unreadCount - 1));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.title}>Thông báo</div>
        <div className={styles.hasRead} onClick={allRead}>Đánh dấu đã đọc tất cả</div>
      </div>

      <div className={styles.tabs}>
        <div className={`${styles.tab} ${isAll ? styles.active : ''}`} onClick={handleShowAll}>
          Tất cả
        </div>
        <div className={`${styles.tab} ${!isAll ? styles.active : ''}`} onClick={handleShowUnread}>
          Chưa đọc
        </div>
      </div>

      <div className={styles.container}>
        {listNoti?.map((noti) => (
          <NotificationItem
            key={noti.id}
            noti={noti}
            onMarked={(id) => {
              setListNoti((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
            }}
            onDelete={onDelete}
          />
        ))}
      </div>

      {isAll && page < totalPages - 1 && (
        <div className={styles.loadMore} onClick={handleLoadMore}>
          Xem thêm
        </div>
      )}
    </div>
  );
};

export default Notification;
