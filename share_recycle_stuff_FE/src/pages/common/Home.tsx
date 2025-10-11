import { useState } from 'react';
import Header from '../../components/Header/Header';
import Feed from '../../components/Feed/Feed';
import type { HomePageProps, Post } from '../../types/schema';
import styles from './Home.module.css';
import MessageIcon from '../../components/icons/MessageIcon';
import Icon from '@ant-design/icons';


const Home = ({ currentUser, posts: initialPosts }: HomePageProps) => {
  const [posts, setPosts] = useState(initialPosts);

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
          posts={posts}
          currentUser={currentUser}
          onEditPost={handleEditPost}
          onDeletePost={handleDeletePost}
        />
        
      </div>
    </div>
  );
};

export default Home;
