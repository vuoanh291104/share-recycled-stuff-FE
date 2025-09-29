import CommentItem from '../CommentItem/CommentItem';
import type { Comment} from '../../types/schema';
import styles from './CommentThread.module.css';

interface CommentThreadProps {
  parentComment: Comment;
  replies: Comment[];
  onReply: (parentCommentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
  onEdit: (commentId: string, newContent: string) => void;
}

const CommentThread = ({ 
  parentComment, 
  replies, 
  onReply, 
  onDelete, 
  onEdit 
}: CommentThreadProps) => {
  return (
    <div className={styles.commentThread}>
      {/* Parent Comment */}
      <CommentItem
        comment={parentComment}
        onReply={onReply}
        onDelete={onDelete}
        onEdit={onEdit}
        isReply={false}
      />
      
      {/* Child Comments (Replies) */}
      {replies.length > 0 && (
        <div className={styles.repliesContainer}>
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onDelete={onDelete}
              onEdit={onEdit}
              isReply={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentThread;
