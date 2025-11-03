import clsx from "clsx";
import type { NotificationType } from "../../../types/schema"
import { formatCommentTime } from "../../../utils/formatters";
import styles from './Notification.module.css'
import { CommentOutlined, WarningTwoTone, FileDoneOutlined } from '@ant-design/icons';
import { putData } from "../../../api/api";
import { useNotification } from "../../../context/NotificationContext";
import { Button } from "antd";

interface NotificationItemProp {
  noti: NotificationType;
  onMarked: (id: number) => void;
  onDelete: (notiID: number) => void;
}

const NotificationItem = ({noti, onMarked, onDelete} : NotificationItemProp) => {

  const {unreadCount, setUnreadCount} = useNotification();

  const icons = {
    Post: <FileDoneOutlined style={{ fontSize: 20 }} />,
    Comment: <CommentOutlined style={{ fontSize: 20 }} />,
    Report: <WarningTwoTone style={{ fontSize: 20 }} />
  }

   const markAsRead = async () => {
    if (noti.read) return; 

    try {
      await putData('/api/notifications/mark-read', {
        notificationIds: [noti.id]
      });

      onMarked(noti.id);

      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (err) {
      console.error('Lỗi khi mark-read:', err);
    }
  };

  const deleteNoti = (notiID: number) => {
    onDelete(notiID);
  }


  return (
    <div className= {styles.item}>
      <div className= {clsx(noti.read && styles.read)} onClick={markAsRead}>
        <div className= {styles.titleContainer}>
          <div style={{marginRight:'14px'}}>
            {icons[noti.relatedEntityType as keyof typeof icons] || null}
          </div>
          <div className= {styles.subtitle}>{noti.title}</div>
        </div>
        <div>{noti.content}</div>
        <div className= {styles.time}>{formatCommentTime(noti.createdAt)}</div>
      </div>

      <Button onClick={() => deleteNoti(noti.id)}>Xóa</Button>
    </div>
    
  )
}

export default NotificationItem
