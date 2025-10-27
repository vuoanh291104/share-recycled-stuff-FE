import { useState, useCallback, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Feed from '../../components/Feed/Feed';
import styles from './Home.module.css';
import MessageIcon from '../../components/icons/MessageIcon';
import Icon from '@ant-design/icons';
import PostCreation from '../../components/Profile/PostCreation';
import ProfileHeader from '../../components/Profile/ProfileHeader';
import ReviewSection from '../../components/Review/ReviewSection';
import feedStyles from '../../components/Feed/Feed.module.css';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import type { Post, PostResponse } from '../../types/schema';
import type { ErrorResponse } from '../../api/api';
import { getData, postData } from '../../api/api';
import { useMessage } from '../../context/MessageProvider';
import { normalizePosts } from '../../utils/normalizePost';

interface PostProps {
  message: string,
  result : any,
}

interface ApiResponse<T> {
  message: string;
  result: T;
}
interface PostListResponse {
  content: PostResponse[];
}

const Profile = () => {
  const {showMessage} = useMessage ();
  const location = useLocation();
  const params = useParams();

  const isEditing = location.pathname.includes('/profile/edit');

  const [activeTab, setActiveTab] = useState<'posts' | 'reviews'>('posts');
  const [posts, setPosts] = useState<Post[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  const userInfo = localStorage.getItem("userInfo");
  const me = userInfo? JSON.parse(userInfo) : null;

  const notMyProfile = params.userId && Number(params.userId) !== me.accountId; 
  
  const currentUser = me; // sau check xem currentUser ở đây là owner hay là user khác

  
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      let res: ApiResponse<PostListResponse>;
      if (params.userId && Number(params.userId) !== currentUser.id) {
        //  Profile ng khác
        res = await getData<ApiResponse<PostListResponse>>(`/api/post/user/${params.userId}`);
        setIsOwner(false);
      } else {
        // Profile của mk
        res = await getData<ApiResponse<PostListResponse>>(`/api/post/my`);
        setIsOwner(true);
      }
      const posts: Post[] = normalizePosts(res.result.content);
      setPosts(posts);
      // setPosts(res?.result?.content|| []);
    } catch (error: any) {
      const err: ErrorResponse = error;
      showMessage({ type: 'error', message: err.message, code: err.status });
    } finally {
      setLoading(false);
    }
  }, [params.userId, currentUser.id, showMessage]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleActionSuccess = useCallback(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleCreatePost = async (payload: any) => {
    try {
      const res = await postData<PostProps>('/api/post', payload)
      console.log(res);
      showMessage({type: "success", message:"Đăng bài thành công"})
      setPosts(prev => [res.result, ...prev]);
    } catch (error: any) {
      const errorData : ErrorResponse = error;
      showMessage({type: "error", message: errorData.message, code: errorData.status});
    }
  }
  

  return (
    <div className={styles.homeLayout}>
      {/* <Sidebar /> */}
      <Header />

      <div className={styles.mainContent}>
        {
          isEditing ? <Outlet/> :
          <>
            <ProfileHeader 
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
            <div className={feedStyles.postsContainer}>
              {activeTab === 'posts' ? (
                <>
                  {!notMyProfile &&
                    <PostCreation 
                      user={currentUser}
                      onCreatePost={handleCreatePost}
                    />                  
                  }
                  <Feed 
                    posts={posts}
                    currentUser={currentUser}
                    onActionSuccess={handleActionSuccess}
                  />
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
