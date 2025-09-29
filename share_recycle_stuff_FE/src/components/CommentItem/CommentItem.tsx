import { useState } from 'react';
import { Button, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { BsThreeDotsVertical } from 'react-icons/bs';
import CommentInput from '../CommentInput/CommentInput';
import { formatCommentTime } from '../../utils/formatters';
import type {CommentItemProps } from '../../types/schema';
import styles from './CommentItem.module.css';
import { mockRootProps } from '../../data/homeMockData';

const CommentItem = ({ comment, onReply, onDelete, onEdit, isReply = false }: CommentItemProps) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const currentUser = mockRootProps.currentUser;
  const isOwner = comment.account_id.id === currentUser.id;

  const handleReply = (content: string) => {
    // For replies, use the original parent comment ID
    // For main comments, use the comment's own ID as parent
    const parentId = comment.parent_comment_id || comment.id;
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
      : []),
    {
      key: 'report',
      label: 'Report'
    }
  ];

  return (
    <div className={`${styles.commentItem} ${isReply ? styles.replyItem : ''}`}>
      <div className={styles.commentHeader}>
        <img
          src={comment.account_id.avatar}
          alt={comment.account_id.name}
          className={`${styles.avatar} ${isReply ? styles.replyAvatar : ''}`}
        />
        <div className={styles.commentContent}>
          <div className={styles.authorInfo}>
            <span className={`${styles.authorName} ${isReply ? styles.replyAuthor : ''}`}>
              {comment.account_id.name}
            </span>
            <span className={`${styles.timestamp} ${isReply ? styles.replyTimestamp : ''}`}>
              {formatCommentTime(comment.created_at)}
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
