import { useCallback, useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import Feed from '../../components/Feed/Feed';
import type { HomePageProps, Post, PostResponse } from '../../types/schema';
import { normalizePosts } from '../../utils/normalizePost';
import styles from './Home.module.css';
import MessageIcon from '../../components/icons/MessageIcon';
import Icon from '@ant-design/icons';
import { getData } from '../../api/api';
import type { ErrorResponse } from '../../api/api';
import { useMessage } from '../../context/MessageProvider';
import ChatContainer from '../../components/Message/ChatContainer';

interface HomeResponse {
  code : number;
  message: string;
  result: {
    content : PostResponse[];
    totalElements: number;
    totalPages: number;
    number: number;
    last: boolean;
  }
}


const Home = () => {

  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const {showMessage} = useMessage();
  // const [isBoxOpen, setIsBoxOpen] = useState(false);

  // currentUser 
  const userInfo = localStorage.getItem("userInfo");
  const currentUser = userInfo? JSON.parse(userInfo) : null;

  const handleActionSuccess =  useCallback( async () => {
    try {
      const res = await getData <HomeResponse>('/api/post/main-page');
      if (res.code === 200 && res.result) {
        console.log(res.result)

        const posts : Post[] = normalizePosts(res.result.content);
        console.log(posts)
        setPosts(posts);
      }
    } catch (error : any) {
      const errData : ErrorResponse = error;
      showMessage({type: "error" , message: errData.message || "Lấy bài đăng thất bại" , code: errData.status})
    }
  }, []);

  useEffect(() => {
    handleActionSuccess();
  }, [handleActionSuccess]);

  // const openChatBox = () => {
  //   setIsBoxOpen(true);
  // }

  // const closeChatBox = () => {
  //   setIsBoxOpen(false);
  // }
  
  return (
    <div className={styles.homeLayout}>
      {/* <Sidebar /> */}
      
      <div className={styles.mainContent}>
        <Header />
      {/* <div className={styles.messagesSection}>
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
      </div> */}
        <Feed 
          posts={posts}
          currentUser={currentUser}
          onActionSuccess={handleActionSuccess}
        />
        {/* {isBoxOpen && <ChatContainer onClose={closeChatBox}/>} */}
        
      </div>
    </div>
  );
};

export default Home;
