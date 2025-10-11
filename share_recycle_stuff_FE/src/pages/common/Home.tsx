import { useCallback } from 'react';
import Header from '../../components/Header/Header';
import Feed from '../../components/Feed/Feed';
import type { HomePageProps } from '../../types/schema';
import styles from './Home.module.css';
import MessageIcon from '../../components/icons/MessageIcon';
import Icon from '@ant-design/icons';


const Home = ({ currentUser, posts: initialPosts }: HomePageProps) => {
  const handleActionSuccess = useCallback(() => {
    console.log('Action was successful, refetching posts...');
    // TODO: Implement logic to refetch posts from the API
  }, []);

  return (
    <div className={styles.homeLayout}>
      {/* <Sidebar /> */}
      
      <div className={styles.mainContent}>
        <Header />
      <div className={styles.messagesSection}>
        <button className={styles.messagesButton}>
          <Icon 
            component={MessageIcon} 
            className={styles.messageIcon}
          />
          <span className={styles.messagesText}>Messages</span>
        </button>
      </div>
        <Feed 
          posts={initialPosts}
          currentUser={currentUser}
          onActionSuccess={handleActionSuccess}
        />
        
      </div>
    </div>
  );
};

export default Home;
