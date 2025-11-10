import { useState } from 'react';
import { Button, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { BsThreeDotsVertical } from 'react-icons/bs';
import CommentInput from '../CommentInput/CommentInput';
import { formatCommentTime } from '../../utils/formatters';
import type {CommentItemProps } from '../../types/schema';
import styles from './CommentItem.module.css';
import { useNavigate } from 'react-router-dom';

const CommentItem = ({ comment, onReply, onDelete, onEdit, isReply = false }: CommentItemProps) => {
  
  const navigate = useNavigate();

  const [showReplyInput, setShowReplyInput] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const userInfo = localStorage.getItem('userInfo');
  const currentUser = userInfo ? JSON.parse(userInfo) : null;
  const isOwner = comment.author.id === currentUser.accountId;

  const handleReply = async (content: string) => {
    // For replies, use the original parent comment ID
    // For main comments, use the comment's own ID as parent
    
    const parentId = comment.parentCommentId || comment.id;
    onReply(parentId, content);
    setShowReplyInput(false);
  };

  const handleEdit = () => {
    if (editContent.trim() !== comment.content) {
      onEdit(comment.id, editContent.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  const menuItems: MenuProps['items'] = [
    ...(isOwner
      ? [
          {
            key: 'edit',
            label: 'Edit',
            onClick: () => setIsEditing(true)
          },
          {
            key: 'delete',
            label: 'Delete',
            onClick: () => onDelete(comment.id),
            danger: true
          }
        ]
      : [
          {
            key: 'report',
            label: 'Report'
          }
        ]),
    
  ];

  return (
    <div className={`${styles.commentItem} ${isReply ? styles.replyItem : ''}`}>
      <div className={styles.commentHeader}>
        <img
          src={comment.author.avatarUrl || 'scr/example-avatar.png'}
          alt={comment.author.fullName}
          className={`${styles.avatar} ${isReply ? styles.replyAvatar : ''}`}
          onClick={() => navigate(isOwner ? '/profile' : `/profile/${comment.author.id}`)}
          style={{cursor:"pointer"}}
        />
        <div className={styles.commentContent}>
          <div className={styles.authorInfo}>
            <span className={`${styles.authorName} ${isReply ? styles.replyAuthor : ''}`}>
              {comment.author.fullName}
            </span>
            <span className={`${styles.timestamp} ${isReply ? styles.replyTimestamp : ''}`}>
              {formatCommentTime(comment.createdAt)}
            </span>
          </div>
          
          {isEditing ? (
            <div className={styles.editSection}>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className={styles.editTextarea}
                autoFocus
              />
              <div className={styles.editActions}>
                <Button size="small" onClick={handleCancelEdit}>
                  Cancel
                </Button>
                <Button 
                  type="primary" 
                  size="small" 
                  onClick={handleEdit}
                  disabled={!editContent.trim()}
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <p className={`${styles.commentText} ${isReply ? styles.replyText : ''}`}>
              {comment.content}
            </p>
          )}
          
          <div className={styles.commentActions}>      
            <button
              className={styles.actionButton}
              onClick={() => setShowReplyInput(!showReplyInput)}
            >
              Reply
            </button>
          </div>
        </div>
        
        <Dropdown menu={{ items: menuItems }} trigger={['click']}>
          <button className={styles.moreButton}>
            <BsThreeDotsVertical size={16} />
          </button>
        </Dropdown>
      </div>
      
      {showReplyInput && (
        <div className={styles.replyInputSection}>
          <CommentInput
            placeholder="Write a reply..."
            onSubmit={handleReply}
            autoFocus
          />
        </div>
      )}
    </div>
  );
};

export default CommentItem;
