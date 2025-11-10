import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar/Sidebar'
import type { User } from '../types/schema';
import Header from '../components/Header/Header';
import MessageIcon from '../components/icons/MessageIcon';
import Icon from '@ant-design/icons';
import styles from './Layout.module.css'
import { useState } from 'react';
import ChatContainer from '../components/Message/ChatContainer';

type PrivateLayoutProps = {
  currentUser: User;
}

const PrivateLayout = ({currentUser} : PrivateLayoutProps) => {

  const [isBoxOpen, setIsBoxOpen] = useState (false);

  const openChatBox = () => {
    setIsBoxOpen(true);
  }

  const closeChatBox = () => {
    setIsBoxOpen(false);
  }

  return (
    <div style={{display: 'flex'}}>
    
        <Sidebar />
        <Header />
      <main>
        <Outlet />
      </main>
      <div className={styles.messagesSection}>
        <button 
          className={styles.messagesButton}
          onClick={openChatBox}
          >
          <Icon 
            component={MessageIcon} 
            className={styles.messageIcon}
          />
          <span className={styles.messagesText}>Messages</span>
        </button>
      </div>

      {isBoxOpen && <ChatContainer onClose={closeChatBox}/>}

    </div>
  )
}

export default PrivateLayout
