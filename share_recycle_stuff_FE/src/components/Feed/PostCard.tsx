import { useState } from 'react';
import Icon from '@ant-design/icons';
import { BsThreeDotsVertical } from 'react-icons/bs';
import HeartIcon from '../icons/HeartIcon';
import CommentIcon from '../icons/CommentIcon';
import ImageCarousel from '../ImageCarousel/ImageCarousel';
import { formatLikes, formatViews, formatTimeAgo, formatPrice } from '../../utils/formatters';
import type { Post } from '../../types/schema';
import styles from './PostCard.module.css';

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleMoreMenuToggle = () => {
    setShowMoreMenu(!showMoreMenu);
  };

  const handleDescriptionToggle = () => {
    setShowFullDescription(!showFullDescription);
  };

  const truncatedDescription = post.content.length > 50 
    ? `${post.content.substring(0, 50)}...more`
    : post.content;

  return (
    <article className={styles.postCard}>
      {/* Post Header */}
      <div className={styles.postHeader}>
        <div className={styles.authorInfo}>
          <img
            src={post.account_id.avatar}
            alt={post.account_id.name}
            className={styles.authorAvatar}
          />
          <div className={styles.authorDetails}>
            <h3 className={styles.authorName}>{post.account_id.name}</h3>
            <div className={styles.timeIndicator}>
              <div className={styles.timeDot}></div>
            </div>
          </div>
          <span className={styles.timestamp}>
            {formatTimeAgo(post.create_at)}
          </span>
        </div>
        
        <button 
          className={styles.moreButton}
          onClick={handleMoreMenuToggle}
        >
          <BsThreeDotsVertical size={20} />
        </button>

        {showMoreMenu && (
          <div className={styles.moreMenu}>
            <button className={styles.menuItem}>Edit</button>
            <button className={styles.menuItem}>Delete</button>
            <button className={styles.menuItem}>Report</button>
          </div>
        )}
      </div>

      {/* Post Image */}
      <div className={styles.imageSection}>
        <ImageCarousel
          images={post.images}
          currentIndex={post.currentImageIndex}
          hasMoreImages={post.hasMoreImages}
        />
      </div>

      {/* Post Actions */}
      <div className={styles.postActions}>
        <button 
          className={`${styles.actionButton} ${isLiked ? styles.liked : ''}`}
          onClick={handleLike}
        >
          <Icon 
            component={HeartIcon} 
            className={styles.actionIcon}
          />
        </button>
        
        <button className={styles.actionButton}>
          <Icon 
            component={CommentIcon} 
            className={styles.actionIcon}
          />
        </button>
      </div>

      {/* Post Stats */}
      <div className={styles.postStats}>
        <span className={styles.statsText}>
          {formatLikes(post.like_count)}
        </span>
        <span className={styles.statsText}>
          {formatViews(post.view_count)}
        </span>
      </div>

      {/* Post Content */}
      <div className={styles.postContent}>
        {post.title && (
          <p className={styles.postTitle}>{post.title}</p>
        )}
        <div className={styles.postDetails}>
          <p className={styles.detailText}>Mục đích: {post.purpose}</p>
          {post.category && (
            <p className={styles.detailText}>Phân loại: {post.category}</p>
          )}
          {post.price > 0 && (
            <p className={styles.detailText}>Giá: {formatPrice(post.price)}</p>
          )}
        </div>
        <p className={styles.description}>
          {showFullDescription ? post.content : truncatedDescription}
          {post.content.length > 50 && (
            <button 
              className={styles.moreButton}
              onClick={handleDescriptionToggle}
            >
              {showFullDescription ? 'less' : 'more'}
            </button>
          )}
        </p>
      </div>

      

        {/* View Comments */}
        <p 
          className={styles.viewCommentsButton} 
          onClick={() => console.log("Mở danh sách comment")}
        >
          View all comments
        </p>

    </article>
  );
};

export default PostCard;