import { Button } from 'antd';
import Icon from '@ant-design/icons';
import StarIcon from '../icons/StarIcon';
import type { User } from '../../types/schema';
import styles from './ProfileHeader.module.css';

interface ProfileHeaderProps {
  user: User;
}

const ProfileHeader = ({ user }: ProfileHeaderProps) => {
  return (
    <div className={styles.profileHeader}>
      <div className={styles.profileInfo}>
        <div className={styles.avatarSection}>
          <img
            src={user.avatar_url}
            alt={user.full_name}
            className={styles.profileAvatar}
          />
        </div>
        
        <div className={styles.userDetails}>
          <h1 className={styles.userName}>{user.full_name}</h1>
          <p className={styles.userBio}>{user.bio}</p>
          <p className={styles.userBio}>
            {user.address}, {user.ward}, {user.district}, {user.city}
          </p>
          <p className={styles.userBio}> {user.phone}</p>

          <div className={styles.ratingSection}>
            <span className={styles.ratingText}>{user.rating_average}/5</span>
            <Icon 
              component={StarIcon} 
              className={styles.starIcon}
            />
            <span className={styles.reviewCount}>{user.total_ratings} reviews</span>
          </div>
        </div>
        <Button 
          className={styles.editButton}
          type="default"
        >
          Edit Profile
        </Button>
      </div>
      
      <div className={styles.tabNavigation}>
        <button className={`${styles.tab} ${styles.activeTab}`}>
          Bài đăng
        </button>
        <button className={styles.tab}>
          Đánh giá
        </button>
      </div>
    </div>
  );
};

export default ProfileHeader;
