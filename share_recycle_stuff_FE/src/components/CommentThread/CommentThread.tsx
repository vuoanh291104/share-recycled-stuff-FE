import { useState } from 'react';
import CommentItem from '../CommentItem/CommentItem';
import type { Comment } from '../../types/schema';
import styles from './CommentThread.module.css';
import { getData } from '../../api/api';

interface CommentThreadProps {
  parentComment: Comment;
  onReply: (
    parentCommentId: string,
    content: string,
    onSuccess?: (newReply: Comment) => void
  ) => void;
  onDelete: (commentId: string) => void;
  onEdit: (commentId: string, newContent: string) => void;
}

interface RepliesResponse {
  code: number;
  message: string;
  result: {
    content: Comment[];
    totalElements: number;
    totalPages: number;
    number: number;
    last: boolean;
  };
}

const CommentThread = ({
  parentComment,
  onReply,
  onDelete,
  onEdit,
}: CommentThreadProps) => {
  const [replies, setReplies] = useState<Comment[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Lấy danh sách cmt rep theo page
  const fetchReplies = async (pageNum: number) => {
    try {
      setLoading(true);
      const res = await getData<RepliesResponse>(
        `/api/comment/${parentComment.id}/replies`,
        { page: pageNum, size: 5 }
      );

      if (res.code === 200 && res.result) {
        const data = res.result;
        if (pageNum === 0) {
          setReplies(data.content || []);
        } else {
          setReplies((prev) => [...prev, ...(data.content || [])]);
        }
        setTotalPages(data.totalPages ?? 1);
      }
    } catch (err) {
      console.error('Lỗi khi lấy replies:', err);
    } finally {
      setLoading(false);
    }
  };

  // Khi reply mới được thêm
  const handleReply = (parentId: string, content: string) => {
    onReply(parentId, content, (newReply) => {
      setReplies((prev) => [newReply, ...prev]);
    });
  };

  // Đóng mở cmt rep
  const handleToggleReplies = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      fetchReplies(0);
    } else {
      setIsExpanded(false);
      setReplies([]);
      setPage(0);
    }
  };

  return (
    <div className={styles.commentThread}>
      {/* Bình luận cha */}
      <CommentItem
        comment={parentComment}
        onReply={handleReply}
        onDelete={onDelete}
        onEdit={onEdit}
        isReply={false}
      />

      {/* Nút xem/ẩn cmt rep */}
      <div className={styles.toggleReplies}>
        {(!isExpanded || replies.length > 0) && (
          <button
            className={styles.toggleBtn}
            onClick={handleToggleReplies}
            disabled={loading}
          >
            {isExpanded
              ? `Ẩn phản hồi${replies.length > 0 ? ` (${replies.length})` : ''}`
              : `Xem phản hồi${replies.length > 0 ? ` (${replies.length})` : ''}`}
          </button>
        )}
      </div>

      {loading && isExpanded && (
        <p className={styles.loading}>Đang tải phản hồi...</p>
      )}

      {isExpanded && replies.length === 0 && !loading && (
        <p className={styles.noReplies}>Chưa có phản hồi nào.</p>
      )}

      {/* Danh sách replies */}
      {isExpanded && replies.length > 0 && (
        <div className={styles.repliesContainer}>
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={handleReply}
              onDelete={onDelete}
              onEdit={onEdit}
              isReply={true}
            />
          ))}

          {/* Nút phân trang "Xem thêm phản hồi" */}
          {page < totalPages - 1 && (
            <button
              className={styles.loadMoreBtn}
              onClick={() => {
                const nextPage = page + 1;
                setPage(nextPage);
                fetchReplies(nextPage);
              }}
              disabled={loading}
            >
              {loading ? 'Đang tải...' : 'Xem thêm phản hồi'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentThread;
