import { useState, useCallback } from 'react';
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
import type { Post, PostImageResponse } from '../../types/schema';
import type { PostPurpose, PostStatus } from '../../types/enums';
import { PostStatusValues } from '../../types/enums';

const Profile = () => {
  const { currentUser, posts: initialPosts } = mockRootProps;
  const location = useLocation();
  const isEditing = location.pathname.includes('/profile/edit');
  const [activeTab, setActiveTab] = useState<'posts' | 'reviews'>('posts');
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  const handleActionSuccess = useCallback(() => {
    console.log('Action was successful, refetching posts for profile...');
    // TODO: Implement logic to refetch posts from the API for the profile page
  }, []);

  const handleCreatePost = (postData: {
    title: string;
    content: string;
    price: number;
    category: string;
    purpose: PostPurpose;
    images: string[];
  }) => {
    const now = new Date();
    
    // Create new post object with all required fields from Post schema
    const newPost: Post = {
      id: Date.now(),
      accountId: currentUser,
      title: postData.title,
      content: postData.content,
      category: postData.category,
      price: postData.price,
      purpose: postData.purpose,
      status: PostStatusValues.ACTIVE as PostStatus,
      viewCount: 0,
      likeCount: 0,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      images: postData.images.map((url, idx) => ({
        id: idx + 1,
        imageUrl: url,
        displayOrder: idx
      } as PostImageResponse)),
      currentImageIndex: 0,
      hasMoreImages: postData.images.length > 1,
    };

    setPosts(prevPosts => [newPost, ...prevPosts]);
    console.log('Post mới đã tạo:', newPost);
    // TODO: Call API to create post
  };

  return (
    <div className={styles.homeLayout}>
      {/* <Sidebar /> */}
      <Header />

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
                  <PostCreation 
                    user={currentUser}
                    onCreatePost={handleCreatePost}
                  />
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
