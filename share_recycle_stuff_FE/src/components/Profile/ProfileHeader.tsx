import { Button, Modal } from 'antd';
import Icon from '@ant-design/icons';
import StarIcon from '../icons/StarIcon';
import type { ProfileInfo, User } from '../../types/schema';
import styles from './ProfileHeader.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ReportModal from '../Report/ReportModal';
import { getData } from '../../api/api';
import type { ErrorResponse } from '../../api/api';


interface DataResponse {
  code: number,
  message: string,
  result: ProfileInfo
}

interface ProfileHeaderProps {
  activeTab: 'posts' | 'reviews';
  onTabChange: (tab: 'posts' | 'reviews') => void;
}

const ProfileHeader = ({  activeTab, onTabChange }: ProfileHeaderProps) => {

  const navigate = useNavigate();

  const params = useParams ();

  const userInfo = localStorage.getItem("userInfo");
  const me = userInfo ? JSON.parse (userInfo) : null;

  const notMyProfile = params.userId && Number(params.userId) !== me.accountId; 

  const reportedAccountId = Number(params.userId); //id của cái đứa mk muốn rp nó đây

  const [modalReport, setModalReport] = useState (false);
  const [resetKey, setResetKey] = useState(0);

  const [profileInfo, setProfileInfo] = useState<ProfileInfo| null> (null);
  
  const openModalReport = () => {
    setModalReport (true);
  }
  
  const reportOK = () => {
    setModalReport (false);
  }
  
  const cancelReport = () => {
    setModalReport (false);
  }

  const getProfileInfo = async () => {
    const url = notMyProfile? `/api/profile/${Number(params.userId)}` : '/api/profile/me';
    try {
      const res = await getData<DataResponse> (url);
      setProfileInfo(res.result);
    } catch (error: any) {
      console.error('data error');
    }
  }

  useEffect(()=> {
    getProfileInfo();
  },[])

  return (
    <div className={styles.profileHeader}>
      <div className={styles.profileInfo}>
        <div className={styles.avatarSection}>
          <img
            src={profileInfo?.avatarUrl}
            alt={profileInfo?.fullName}
            className={styles.profileAvatar}
          />
        </div>
        
        <div className={styles.userDetails}>
          <h1 className={styles.userName}>{profileInfo?.fullName}</h1>
          <p className={styles.userBio}>{profileInfo?.bio}</p>
          <p className={styles.userBio}>
            {profileInfo?.address ? `${profileInfo.address}, ` : ''}
            {profileInfo?.ward}, {profileInfo?.city}
          </p>
          <p className={styles.userBio}> {profileInfo?.phoneNumber}</p>

          <div className={styles.ratingSection}>
            <span className={styles.ratingText}>{profileInfo?.ratingAverage}/5</span>
            <Icon 
              component={StarIcon} 
              className={styles.starIcon}
            />
            <span className={styles.reviewCount}>{profileInfo?.totalRatings} reviews</span>
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
