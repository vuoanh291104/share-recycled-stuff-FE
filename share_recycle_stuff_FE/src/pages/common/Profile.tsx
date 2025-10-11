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
import type { Post } from '../../types/schema';
import type { PostPurpose } from '../../types/enums';

const Profile = () => {
  const { currentUser, posts: initialPosts } = mockRootProps;
  const location = useLocation();
  const isEditing = location.pathname.includes('/profile/edit');
  const [activeTab, setActiveTab] = useState<'posts' | 'reviews'>('posts');
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  const handleEditPost = (postId: string, updatedData: Partial<Post>) => {
    console.log('Edit post:', postId, updatedData);
    // Update post in state
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId ? { ...post, ...updatedData } : post
      )
    );
    // TODO: Call API to update post
  };

  const handleDeletePost = (postId: string) => {
    console.log('Delete post:', postId);
    // Remove post from state
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    // TODO: Call API to delete post
  };

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
      id: `post_${Date.now()}`,
      account_id: currentUser,
      title: postData.title,
      content: postData.content,
      category: postData.category,
      price: postData.price,
      purpose: postData.purpose,
      status: 'APPROVED',
      admin_review_comment: '',
      view_count: 0,
      like_count: 0,
      create_at: now,
      update_at: now,
      delete_at: null,
      images: postData.images,
      currentImageIndex: 0,
      hasMoreImages: postData.images.length > 1,
    };

    // Add new post to the beginning of the list
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
                    onEditPost={handleEditPost}
                    onDeletePost={handleDeletePost}
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
