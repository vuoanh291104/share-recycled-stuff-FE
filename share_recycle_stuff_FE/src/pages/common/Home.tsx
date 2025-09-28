import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import Feed from '../../components/Feed/Feed';
import type { HomePageProps } from '../../types/schema';
import styles from './Home.module.css';
import MessageIcon from '../../components/icons/MessageIcon';
import Icon from '@ant-design/icons';


const Home = ({ currentUser, posts }: HomePageProps) => {
  return (
    <div className={styles.homeLayout}>
      <Sidebar />
      
      <div className={styles.mainContent}>
        <Header currentUser={currentUser} />
        {/* Messages Button */}
      <div className={styles.messagesSection}>
        <button className={styles.messagesButton}>
          <Icon 
            component={MessageIcon} 
            className={styles.messageIcon}
          />
          <span className={styles.messagesText}>Messages</span>
        </button>
      </div>
        <Feed posts={posts} />
        
      </div>
    </div>
  );
};

export default Home;
