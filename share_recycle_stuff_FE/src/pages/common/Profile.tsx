import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import Feed from '../../components/Feed/Feed';
import styles from './Home.module.css';
import MessageIcon from '../../components/icons/MessageIcon';
import Icon from '@ant-design/icons';
import { mockRootProps } from '../../data/homeMockData';
import PostCreation from '../../components/Profile/PostCreation';
import ProfileHeader from '../../components/Profile/ProfileHeader';
import feedStyles from '../../components/Feed/Feed.module.css';
import { Outlet, useLocation } from 'react-router-dom';

const Profile = () => {
  const { currentUser, posts } = mockRootProps;
  const location = useLocation ();
  const isEditing = location.pathname.includes('/profile/edit')
  return (
    <div className={styles.homeLayout}>
      {/* <Sidebar /> */}
      <Header currentUser={currentUser} />

      <div className={styles.mainContent}>
        {
          isEditing?<Outlet/>:
          <>
            <ProfileHeader user={currentUser} />
            <div className = {feedStyles.postsContainer}>
              <PostCreation user={currentUser} />
              <Feed posts={posts}/>
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
