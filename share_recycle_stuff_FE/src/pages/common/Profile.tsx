import { useState } from 'react';
import Header from '../../components/Header/Header';
import Feed from '../../components/Feed/Feed';
import styles from './Home.module.css';
import MessageIcon from '../../components/icons/MessageIcon';
import Icon from '@ant-design/icons';
import { mockRootProps } from '../../data/homeMockData';
import PostCreation from '../../components/Profile/PostCreation';
import ProfileHeader from '../../components/Profile/ProfileHeader';
import ReviewSection from '../../components/Review/ReviewSection';
import feedStyles from '../../components/Feed/Feed.module.css';
import { Outlet, useLocation } from 'react-router-dom';

const Profile = () => {
  const { currentUser, posts } = mockRootProps;
  const location = useLocation();
  const isEditing = location.pathname.includes('/profile/edit');
  const [activeTab, setActiveTab] = useState<'posts' | 'reviews'>('posts');
  return (
    <div className={styles.homeLayout}>
      {/* <Sidebar /> */}
      <Header currentUser={currentUser} />

      <div className={styles.mainContent}>
        {
          isEditing ? <Outlet/> :
          <>
            <ProfileHeader 
              user={currentUser} 
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
            <div className={feedStyles.postsContainer}>
              {activeTab === 'posts' ? (
                <>
                  <PostCreation user={currentUser} />
                  <Feed posts={posts}/>
                </>
              ) : (
                <ReviewSection user={currentUser} />
              )}
            </div>
          </>
        }

      <div className={styles.messagesSection}>
        <button className={styles.messagesButton}>
          <Icon 
            component={MessageIcon} 
            className={styles.messageIcon}
          />
          <span className={styles.messagesText}>Messages</span>
        </button>
      </div>
        
      </div>
    </div>
  );
};

export default Profile;
