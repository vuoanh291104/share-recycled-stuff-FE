import { useNavigate } from 'react-router-dom';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import styles from './UserSearchCard.module.css';

interface UserSearchCardProps {
  user: {
    id: number;
    displayName: string;
    avatarUrl: string;
    location?: string;
    isProxySeller: boolean;
    averageRating?: number;
  };
}

const UserSearchCard = ({ user }: UserSearchCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/profile/${user.id}`);
  };

  const getAvatarUrl = (url: string | null | undefined): string | undefined => {
    if (!url) return undefined;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
  };

  return (
    <div className={styles.userCard} onClick={handleClick}>
      <Avatar 
        src={getAvatarUrl(user.avatarUrl)} 
        size={48} 
        icon={<UserOutlined />}
        className={styles.avatar}
      />
      <span className={styles.displayName}>{user.displayName}</span>
    </div>
  );
};

export default UserSearchCard;
