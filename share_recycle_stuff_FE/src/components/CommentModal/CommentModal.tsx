import { useState, useEffect, useCallback } from 'react';
import { Modal } from 'antd';
import Icon from '@ant-design/icons';
import HeartIcon from '../icons/HeartIcon';
import CommentIcon from '../icons/CommentIcon';
import ImageCarousel from '../ImageCarousel/ImageCarousel';
import CommentThread from '../CommentThread/CommentThread';
import CommentInput from '../CommentInput/CommentInput';
import { formatLikes, formatViews, formatTimeAgo, formatPrice } from '../../utils/formatters';
import { commentAPI } from '../../data/commentsMockData';
import type { Post, Comment } from '../../types/schema';
import styles from './CommentModal.module.css';
import { mockRootProps } from "../../data/homeMockData";

interface CommentModalProps {
  isOpen: boolean;
  post: Post | null;
  onClose: () => void;
}

const CommentModal = ({ isOpen, post, onClose }: CommentModalProps) => {
  const currentUser = mockRootProps.currentUser;
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Load comments when modal opens
  useEffect(() => {
    if (isOpen && post) {
      loadComments();
    }
  }, [isOpen, post]);

  const loadComments = async () => {
    if (!post) return;
    
    setIsLoading(true);
    try {
      const commentsData = await commentAPI.fetchComments(post.id);
      setComments(commentsData);
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async (content: string) => {
    if (!post) return;
    
    setIsAddingComment(true);
    try {
      const newComment = await commentAPI.addComment(post.id, content);
      setComments(prev => [newComment, ...prev]);
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsAddingComment(false);
    }
  };

  const handleReplyToComment = useCallback(async (parentCommentId: string, content: string) => {
    if (!post) return;
    
    try {
      const newComment = await commentAPI.addComment(post.id, content, parentCommentId);
      setComments(prev => [...prev, newComment]);
    } catch (error) {
      console.error('Failed to add reply:', error);
    }
  }, [post]);

  const handleDeleteComment = useCallback((commentId: string) => {
    const comment = comments.find(c => c.id === commentId);
      if (!comment) return;
      if (comment.account_id.id !== currentUser.id) {
        return;
      }
    setComments(prev => prev.filter(c => c.id !== commentId));
  }, [comments, currentUser]);


  const handleEditComment = useCallback((commentId: string, newContent: string) => {
  const comment = comments.find(c => c.id === commentId);
  if (!comment) return;

  //Kiểm tra quyền
  if (comment.account_id.id !== currentUser.id) {
    return;
  }

  setComments(prev => prev.map(c => 
    c.id === commentId ? { ...c, content: newContent } : c
  ));
}, [comments, currentUser]);


  const handleLikePost = () => {
    setIsLiked(!isLiked);
  };

  if (!post) return null;

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width="90vw"
      style={{ maxWidth: 1200, top: 20 }}
      className={styles.commentModal}

    >
      <div className={styles.modalContent}>
        {/* Left side - Post */}
        <div className={styles.postSection}>
          <div className={styles.postHeader}>
            <div className={styles.authorInfo}>
              <img
                src={post.account_id.avatar_url}
                alt={post.account_id.full_name}
                className={styles.authorAvatar}
              />
              <div className={styles.authorDetails}>
                <h3 className={styles.authorName}>{post.account_id.full_name}</h3>
                <span className={styles.timestamp}>
                  {formatTimeAgo(post.create_at)}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.imageSection}>
            <ImageCarousel
              images={post.images}
              currentIndex={post.currentImageIndex}
              hasMoreImages={post.hasMoreImages}
            />
          </div>

          <div className={styles.postActions}>
            <button 
              className={`${styles.actionButton} ${isLiked ? styles.liked : ''}`}
              onClick={handleLikePost}
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

          <div className={styles.postStats}>
            <span className={styles.statsText}>
              {formatLikes(post.like_count + (isLiked ? 1 : 0))}
            </span>
            <br />
            <span className={styles.statsText}>
              {formatViews(post.view_count)}
            </span>
          </div>

          <div className={styles.postContent}>
            {post.title && (
              <p className={styles.postTitle}>{post.title}</p>
            )}
            
            <div className={styles.postDetails}>
              <p className={styles.detailText}>Mục đích: {post.category}</p>
              {post.category && (
                <p className={styles.detailText}>Phân loại: {post.category}</p>
              )}
              {post.price > 0 && (
                <p className={styles.detailText}>Giá: {formatPrice(post.price)}</p>
              )}
            </div>
            
            <p className={styles.description}>{post.content}</p>
          </div>
        </div>

        {/* Right side - Comments */}
        <div className={styles.commentsSection}>
          <div className={styles.commentsHeader}>
            <h3 className={styles.commentsTitle}>Comments</h3>
            <span className={styles.commentsCount}>
              {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
            </span>
          </div>

          <div className={styles.commentsList}>
            {isLoading ? (
              <div className={styles.loading}>Loading comments...</div>
            ) : comments.length > 0 ? (
              (() => {
                // Separate main comments and replies
                const mainComments = comments.filter(c => !c.parent_comment_id);
                const replies = comments.filter(c => c.parent_comment_id);
                
                return mainComments.map((comment) => {
                  const commentReplies = replies.filter(r => r.parent_comment_id === comment.id);
                  
                  return (
                    <CommentThread
                      key={comment.id}
                      parentComment={comment}
                      replies={commentReplies}
                      onReply={handleReplyToComment}
                      onDelete={handleDeleteComment}
                      onEdit={handleEditComment}
                    />
                  );
                });
              })()
            ) : (
              <div className={styles.noComments}>
                No comments yet. Be the first to comment!
              </div>
            )}
          </div>

          <div className={styles.commentInputSection}>
            <CommentInput
              placeholder="Add a comment..."
              onSubmit={handleAddComment}
              isLoading={isAddingComment}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CommentModal;
