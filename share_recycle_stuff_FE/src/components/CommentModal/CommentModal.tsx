import { useState, useEffect, useCallback } from 'react';
import { Modal, message} from 'antd';
import Icon from '@ant-design/icons';
import HeartIcon from '../icons/HeartIcon';
import CommentIcon from '../icons/CommentIcon';
import ImageCarousel from '../ImageCarousel/ImageCarousel';
import CommentThread from '../CommentThread/CommentThread';
import CommentInput from '../CommentInput/CommentInput';
import { formatLikes, formatViews, formatTimeAgo, formatPrice } from '../../utils/formatters';
import type { Post, Comment } from '../../types/schema';
import styles from './CommentModal.module.css';
import {deleteData, getData, postData, putData } from '../../api/api';
import type { ErrorResponse } from '../../api/api';
import '../../styles/globalStyle.css'

interface CommentModalProps {
  isOpen: boolean;
  post: Post | null;
  onClose: () => void;
}

interface CommentResponse {
  code: number;
  message: string;
  result : any;
}

interface listCommentResponse {
  code: number;
  message: string;
  result : Comment[];
}


const CommentModal = ({ isOpen, post, onClose }: CommentModalProps) => {

  const userInfo = localStorage.getItem('userInfo');

  const currentUser = userInfo ? JSON.parse(userInfo) : null;

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

  //Lấy list comment cha lên
  const loadComments = async () => {
    if (!post) return;
    
    setIsLoading(true);
    try {

      console.log ("check postID", post.id);
      const commentsData = await getData<listCommentResponse>(`/api/post/${post.id}/comments`)

      console.log('Loaded comments:', commentsData.result);
      setComments(commentsData.result);
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Thêm comment mới

  const handleAddComment = async (content: string) => {
    if (!post) return;
    
    setIsAddingComment(true);
    try {
      const payload = {postId: post.id, content: content};

      const res = await postData<CommentResponse>('/api/comment', payload);
      message.success('Bình luận của bạn đã được gửi!')

      const newComment: Comment = res.result;
      setComments(prev => [newComment, ...prev]);
    } catch (error : any) {
      const errData : ErrorResponse = error;
      message.error(errData.message || 'Đã xảy ra lỗi khi gửi bình luận.');
      console.error('Failed to add comment:', error);
    } finally {
      setIsAddingComment(false);
    }
  };

  // Thêm cái trả lời cmt
  const handleReplyToComment = useCallback(
  async (parentCommentId: string, content: string, onSuccess?: (newReply: Comment) => void) => {
    if (!post) return;
    const payload = {
      parentCommentId,
      content,
    };
    try {
      const res = await postData<CommentResponse>('/api/comment/reply', payload);
      const newReply: Comment = res.result;

      if (onSuccess) onSuccess(newReply);

      setComments((prev) => [...prev, newReply]);
    } catch (error) {
      console.error('Failed to add reply:', error);
    }
  },
  [post]
);

  //Xóa cái cmt
  const handleDeleteComment = useCallback((commentId: string) => {
    const comment = comments.find(c => c.id === commentId);
      if (!comment) return;
      if (comment.author.id !== currentUser.accountId) {
        return;
      }
      try {
        const res = deleteData (`/api/comment/${commentId}`);
      } catch (error) {
        console.error('Failed to delete comment:', error);
      }
    setComments(prev => prev.filter(c => c.id !== commentId));
  }, [comments, currentUser]);


  // Sửa cái cmt
  const handleEditComment = useCallback((commentId: string, newContent: string) => {
  const comment = comments.find(c => c.id === commentId);
  if (!comment) return;

  //Kiểm tra quyền
  if (comment.author.id !== currentUser.accountId) {
    return;
  }

  try {
    const res = putData<CommentResponse>(`/api/comment/${commentId}`, { content: newContent });
  } catch (error) {
    console.error('Failed to edit comment:', error);
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
              {typeof post.author === 'object' && (
                <>
                  <img
                    src={post.author.avatarUrl || '/example-avatar.png'} 
                    alt={post.author.fullName}
                    className={styles.authorAvatar}
                  />
                  <div className={styles.authorDetails}>
                    <h3 className={styles.authorName}>{post.author.fullName}</h3>
                    <span className={styles.timestamp}>
                      {formatTimeAgo(new Date(post.createdAt))}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className={styles.imageSection}>
            <ImageCarousel
              images={post.images}
              currentIndex={post.currentImageIndex || 0}
              hasMoreImages={post.hasMoreImages || false}
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
            {post.likeCount !== undefined && (
              <>
                <span className={styles.statsText}>
                  {formatLikes(post.likeCount + (isLiked ? 1 : 0))}
                </span>
                <br />
              </>
            )}
            <span className={styles.statsText}>
              {formatViews(post.viewCount || 0)}
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
                const mainComments = comments.filter(c => !c.parentCommentId);
                const replies = comments.filter(c => c.parentCommentId);
                
                return mainComments.map((comment) => {
                  
                  return (
                    <CommentThread
                      key={comment.id}
                      parentComment={comment}
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
