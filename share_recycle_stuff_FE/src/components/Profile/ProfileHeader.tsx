import { Button, Modal } from 'antd';
import Icon from '@ant-design/icons';
import StarIcon from '../icons/StarIcon';
import type { User } from '../../types/schema';
import styles from './ProfileHeader.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import ReportModal from '../Report/ReportModal';

interface ProfileHeaderProps {
  user: User;
  activeTab: 'posts' | 'reviews';
  onTabChange: (tab: 'posts' | 'reviews') => void;
}

const ProfileHeader = ({ user, activeTab, onTabChange }: ProfileHeaderProps) => {

  const navigate = useNavigate();

  const params = useParams ();

  const userInfo = localStorage.getItem("userInfo");
  const me = userInfo ? JSON.parse (userInfo) : null;

  const notMyProfile = params.userId && Number(params.userId) !== me.accountId; 

  const reportedAccountId = Number(params.userId); //id của cái đứa mk muốn rp nó đây

  const [modalReport, setModalReport] = useState (false);
  const [resetKey, setResetKey] = useState(0);
  
  const openModalReport = () => {
    setModalReport (true);
  }
  
  const reportOK = () => {
    setModalReport (false);
  }
  
  const cancelReport = () => {
    setModalReport (false);
  }

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

        <div>

          {!notMyProfile &&
            <Button 
              className={styles.editButton}
              type="default"
              onClick={() => navigate ('/profile/edit')}
            >
              Edit Profile
            </Button>         
          }

          {notMyProfile && 
            <Button
              className={styles.editButton}
              type="default"
              onClick={openModalReport}
            >
              Báo cáo
            </Button>
          }
        </div>

        <Modal
          title="Báo cáo "
          closable={{ 'aria-label': 'Custom Close Button' }}
          open={modalReport}
          onCancel={cancelReport}
          footer = {false}
          afterClose={() => setResetKey(k => k + 1)}
        >
          <ReportModal 
            key={resetKey}
            reportOK={reportOK}
            cancelReport={cancelReport}
            reportTypeCode = {3}
            reportedAccountId={reportedAccountId}
          />
        </Modal>
        
        
      </div>
      
      <div className={styles.tabNavigation}>
        <button 
          className={`${styles.tab} ${activeTab === 'posts' ? styles.activeTab : ''}`}
          onClick={() => onTabChange('posts')}
        >
          Bài đăng
        </button>
        
        <button 
          className={`${styles.tab} ${activeTab === 'reviews' ? styles.activeTab : ''}`}
          onClick={() => onTabChange('reviews')}
        >
          Đánh giá
        </button>
      </div>
    </div>
  );
};

export default ProfileHeader;
