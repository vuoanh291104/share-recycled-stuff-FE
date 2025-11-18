import { useState, useEffect, useRef } from 'react';
import Icon from '@ant-design/icons';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { App, Modal } from 'antd';
import HeartIcon from '../icons/HeartIcon';
import CommentIcon from '../icons/CommentIcon';
import ImageCarousel from '../ImageCarousel/ImageCarousel';
import { formatLikes, formatViews, formatTimeAgo, formatPrice } from '../../utils/formatters';
import type { Post, User, UserInfo } from '../../types/schema';
import styles from './PostCard.module.css';
import CommentModal from '../CommentModal/CommentModal';
import EditPostModal from '../Profile/EditPostModal';
import { deleteData, postData, putData } from '../../api/api';
import type { ErrorResponse } from '../../api/api';
import { useMessage } from '../../context/MessageProvider';
import ReportModal from '../Report/ReportModal';
import { useNavigate } from 'react-router-dom';

interface PostCardProps {
  post: Post;
  currentUser: any,
  onActionSuccess?: () => void;
}

const PostCard = ({ post, currentUser, onActionSuccess }: PostCardProps) => {
  const navigate = useNavigate();

  const {showMessage} = useMessage();
  const { modal, message } = App.useApp();
  const [isLiked, setIsLiked] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [resetKey, setResetKey] = useState(0);

  const [likeCount, setLikeCount] = useState(post.likeCount || 0);

  const likeRef = useRef<boolean>(false);
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    const currentUser = userInfo ? JSON.parse(userInfo) : null;

    const likedIds = post.likedUserIDs || [];
    const liked = currentUser ? likedIds.includes(currentUser.accountId) : false;

    setIsLiked(liked);
    setLikeCount(post.likeCount || 0);
    likeRef.current = liked; // lưu trạng thái hiện tại
  }, [post.id, post.likedUserIDs]);


const handleLike = (postID: number) => {
  const newLiked = !likeRef.current;
  likeRef.current = newLiked;

  // cập nhật UI ngay
  setIsLiked(newLiked);
  setLikeCount((prev) => prev + (newLiked ? 1 : -1));

  // gọi API và rollback nếu lỗi
  void updateLike(postID, newLiked);
};

const updateLike = async (postID: number, newLiked: boolean) => {
  try {
    const res = await postData<{ code: number; message: string }>(
      `/api/reactions/post/${postID}`,
      {}
    );

    if (res.code !== 200) {
      throw new Error(res.message);
    }
  } catch (error) {
    console.error("Update like failed:", error);
    // rollback UI
    setIsLiked((prev) => !prev);
    setLikeCount((prev) => prev + (newLiked ? -1 : 1));
    likeRef.current = !newLiked;
  }
};



  const handleMoreMenuToggle = () => {
    setShowMoreMenu(!showMoreMenu);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMoreMenu(false);
      }
    };

    if (showMoreMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMoreMenu]);

  const userInfo = localStorage.getItem("userInfo");
  currentUser = userInfo? JSON.parse(userInfo) : null;

  const author = (post as any).author || null;

  // Check if current user is the post owner
  const isOwner = !!currentUser && !!author && Number(currentUser.accountId) === Number(author.id);

  const handleEdit = () => {
    setShowEditModal(true);
  };

  // Này xóa bài
  const handleDelete = () => {
    modal.confirm({
      title: 'Xóa bài viết',
      content: 'Bạn có chắc chắn muốn xóa bài viết này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deleteData(`/api/post/${post.id}`);
          message.success('Xóa bài viết thành công!');
          if (onActionSuccess) {
            onActionSuccess();
          }
        } catch (error: any) {
          const errData : ErrorResponse = error;
          showMessage({type: "error", message: errData.message, code: errData.status})
        }
      }
    });
  };

  // này report bài

  const [modalReport, setModalReport] = useState (false);

  const openModalReport = () => {
    setModalReport (true);
  }

  const reportOK = () => {
    setModalReport (false);
  }

  const cancelReport = () => {
    setModalReport (false);
  }

  const handleReport = () => {
    setShowMoreMenu(false);
    openModalReport();
    // TODO: Implement report functionality
    console.log('Report post:', post.id);
  };

  // này update bài
  const handleEditSubmit = async (postId: number, updatedData: Partial<Post>) => {
    try {
      await putData(`/api/post/${postId}`, updatedData);
      message.success('Cập nhật bài viết thành công!');
      if (onActionSuccess) {
        onActionSuccess();
      }
    } catch (error :any) {
      const errData : ErrorResponse = error;
      showMessage({type: "error", message: errData.message, code: errData.status})
    } finally {
      setShowEditModal(false);
    }
  };

  const handleDescriptionToggle = () => {
    setShowFullDescription(!showFullDescription);
  };

  const handleOpenComments = () => {
    setShowCommentModal(true);
  };

  const handleCloseComments = () => {
    setShowCommentModal(false);
  };


  const truncatedDescription = post.content.length > 50 
    ? `${post.content.substring(0, 50)}...`
    : post.content;

  return (
    <article className={styles.postCard}>
      {/* Post Header */}
      <div className={styles.postHeader}>
        <div className={styles.authorInfo}>
          {author && (
            <>
              <div 
                className={styles.authorAvatarWrapper}
                onClick={() => navigate(isOwner ? '/profile' : `/profile/${author.id}`)}
              >
                <img
                  src={author.avatarUrl || '/default-avatar.png'}
                  alt={author.fullName}
                  className={styles.authorAvatar}
                />

                {/* Tooltip hiển thị khi hover */}
                <div className={styles.authorTooltip}>
                  <img src={author.avatarUrl || '/default-avatar.png'} alt={author.fullName} />
                  <p>{author.fullName}</p>
                </div>
              </div>

              <div className={styles.authorDetails}>
                <h3 className={styles.authorName}>{author.fullName}</h3>
                <div className={styles.timeIndicator}>
                  <div className={styles.timeDot}></div>
                </div>
              </div>
            </>
          )}
          <span className={styles.timestamp}>
            {post.createdAt }
          </span>
        </div>
        
        <button 
          className={styles.moreButton}
          onClick={handleMoreMenuToggle}
        >
          <BsThreeDotsVertical size={20} />
        </button>

        {showMoreMenu && (
          <div className={styles.moreMenu} ref={menuRef}>
            {isOwner && (
              <>
                <button className={styles.menuItem} onClick={handleEdit}>
                  Chỉnh sửa
                </button>
                <button className={styles.menuItem} onClick={handleDelete}>
                  Xóa
                </button>
              </>
            )}
            {!isOwner && (
              <button className={styles.menuItem} onClick={handleReport}>
                Báo cáo
              </button>
            )}
          </div>
        )}
      </div>

      {/* Post Image */}
      <div className={styles.imageSection}>
        <ImageCarousel
          images={post.images}
          currentIndex={post.currentImageIndex || 0}
          hasMoreImages={post.hasMoreImages || false}
        />
      </div>

      {/* Post Actions */}
      <div className={styles.postActions}>
        <button 
          className={`${styles.actionButton} ${isLiked ? styles.liked : ''}`}
          onClick={() => { void handleLike(post.id); }}
        >
          <Icon 
            component={HeartIcon} 
            className={styles.actionIcon}
          />
        </button>
        
        <button className={styles.actionButton} onClick={handleOpenComments}>
          <Icon 
            component={CommentIcon} 
            className={styles.actionIcon}
          />
        </button>
      </div>

      {/* Post Stats */}
      <div className={styles.postStats}>
        {post.likeCount !== undefined && (
          <span className={styles.statsText}>
            {formatLikes(likeCount ?? 0)}
          </span>
        )}
        {/* <span className={styles.statsText}>
          {formatViews(post.viewCount ?? 0)}
        </span> */}
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
              {showFullDescription ? 'Thu gọn' : 'Xem thêm'}
            </button>
          )}
        </p>
      </div>
        {/* View Comments */}
        <button className={styles.viewCommentsButton} onClick={handleOpenComments}>
        Xem tất cả bình luận
      </button>
      {/* Comment Modal */}
      <CommentModal
        isOpen={showCommentModal}
        post={post}
        onClose={handleCloseComments}
      />

      {/* Edit Modal */}
      {currentUser && isOwner && (
        <EditPostModal
          user={currentUser}
          post={post}
          open={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleEditSubmit}
        />
      )}

      {/*Report Modal*/}
      {
        currentUser &&
        <Modal
          title="Báo cáo "
          closable={{ 'aria-label': 'Custom Close Button' }}
          open={modalReport}
          onCancel={cancelReport}
          footer = {false}
          afterClose={() => setResetKey(k => k + 1)}
        >
          <ReportModal 
            key={resetKey}
            reportOK={reportOK}
            cancelReport={cancelReport}
            reportTypeCode = {2}
            postID={post.id}
          />
        </Modal>
      }

    </article>
  );
};

export default PostCard;
