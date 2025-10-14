import { useState, useEffect, useCallback } from 'react';
import PostCard from "./PostCard";
import type { Post, User, UserInfo } from '../../types/schema';
import styles from "./Feed.module.css";
import { useMessage } from '../../context/MessageProvider';

interface FeedProps {
  posts: Post[];
  currentUser?: UserInfo;
  onActionSuccess?: () => void;
}

const Feed = ({ posts = [], currentUser, onActionSuccess }: FeedProps) => {
  const [displayedPosts, setDisplayedPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Initialize with first batch of posts
  useEffect(() => {
    setDisplayedPosts(posts?.slice(0, 2));
    setHasMore((posts?.length || 0) > 2);
  }, [posts]);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop
      >= document.documentElement.offsetHeight - 1000 &&
      !isLoading &&
      hasMore
    ) {
      setIsLoading(true);
      
      // Simulate loading delay
      setTimeout(() => {
        const currentLength = displayedPosts.length;
        const nextBatch = posts.slice(currentLength, currentLength + 2);
        
        if (nextBatch.length > 0) {
          setDisplayedPosts(prev => [...prev, ...nextBatch]);
        } else {
          setHasMore(false);
        }
        
        setIsLoading(false);
      }, 500);
    }
  }, [displayedPosts.length, posts, isLoading, hasMore]);

  // Add scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className={styles.feed}>
      <div className={styles.postsContainer}>
        {displayedPosts.map((post) => (
          <PostCard 
            key={post.id} 
            post={post}
            currentUser={currentUser}
            onActionSuccess={onActionSuccess}
          />
        ))}
        
        {isLoading && (
          <div className={styles.loadingIndicator}>
            <div className={styles.spinner}></div>
            <span>Loading more posts...</span>
          </div>
        )}
        
        {!hasMore && displayedPosts.length > 0 && (
          <div className={styles.endMessage}>
            No more posts to load
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
