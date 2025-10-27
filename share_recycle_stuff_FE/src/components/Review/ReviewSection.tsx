import { useEffect, useState } from 'react';
import { Modal, App } from 'antd';
import Icon from '@ant-design/icons';
import StarIcon from '../icons/StarIcon';
import type { UserInfo } from '../../types/schema';
import styles from './ReviewSection.module.css';
import ReviewInput from './ReviewInput.tsx';
import { useParams } from 'react-router-dom';
import { deleteData, getData, putData } from '../../api/api'; 
import { useMessage } from '../../context/MessageProvider.tsx';
import ReviewCreationModal from './ReviewCreationModal.tsx';

interface DataResponse {
  code: number;
  message: string;
  result: {
    totalElements: number;
    totalPages: number;
    size: number;
    content: Review[];
  };
}

interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: number[];
  updatedAt: number[];
  reviewer: {
    id: number;
    reviewerAvatarUrl: string;
    fullName: string;
  };
}

interface ReviewSectionProps {
  user: UserInfo;
}

const ReviewSection = ({ user }: ReviewSectionProps) => {
  const {showMessage} = useMessage();

  const params = useParams();
  const userInfo = localStorage.getItem('userInfo');
  const me = userInfo ? JSON.parse(userInfo) : null;

  const userId = params.userId ? Number(params.userId) : me?.accountId;
  const notMyProfile = params.userId && Number(params.userId) !== me?.accountId;

  const [reviews, setReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);


  const toggleMenu = (id: number) => {
    setActiveMenuId((prev) => (prev === id ? null : id));
  };


  const fetchReviews = async (pageNum: number) => {
    try {
      setLoading(true);
      const data = await getData<DataResponse>(
        `/api/reviews/user/${userId}`,
        { page: pageNum, size: 5 }
      );

      setReviews(data.result.content);
      setTotalPages(data.result.totalPages);
    } catch (error) {
      console.error('Lỗi khi tải đánh giá:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setEditModalOpen(true);
    setActiveMenuId(null);
  };

  const handleUpdate = async (rating: number, comment: string) => {
    if (!editingReview) return;
    try {
      await putData(`/api/reviews/${editingReview.id}`, {
        reviewedUserId: Number(params.userId), // hoặc userId nếu API yêu cầu user được review
        rating,
        comment,
      });
      showMessage({ type: 'success', message: 'Cập nhật đánh giá thành công' });
      fetchReviews(page);
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      showMessage({ type: 'error', message: 'Cập nhật thất bại' });
    } finally {
      setEditModalOpen(false);
      setEditingReview(null);
    }
  };




 const { modal } = App.useApp();

const handleDelete = (reviewId: number) => {
  modal.confirm({
    title: 'Xác nhận xóa đánh giá',
    content: 'Bạn có chắc chắn muốn xóa đánh giá này không?',
    okText: 'Xóa',
    okType: 'danger',
    cancelText: 'Hủy',
    centered: true,
    async onOk() {
      try {
        await deleteData(`/api/reviews/${reviewId}`);
        showMessage({ type: 'success', message: 'Đã xóa đánh giá thành công' });
        fetchReviews(page);
      } catch (error: any) {
        console.error('Lỗi khi xóa:', error);
        showMessage({ type: 'error', message: 'Xóa thất bại' });
      } finally {
        setActiveMenuId(null);
      }
    },
    onCancel() {
      setActiveMenuId(null);
    },
  });
};


  useEffect(() => {
    if (userId) fetchReviews(page);
  }, [userId, page]);

  return (
    <div className={styles.reviewSection}>
      {notMyProfile && <ReviewInput 
          user={user} 
          reviewedUserId={userId} 
          onReviewSuccess={() => fetchReviews(page)} 
        />}

      <div className={styles.reviewsList}>
        {loading ? (
          <p>Đang tải đánh giá...</p>
        ) : reviews.length > 0 ? (
          reviews.map((review) => {
            const isMyReview = review.reviewer.id === me?.accountId;
            return (
              <div key={review.id} className={styles.reviewCard}>
                <img
                  src={review.reviewer.reviewerAvatarUrl || '/default-avatar.png'}
                  alt={review.reviewer.fullName}
                  className={styles.reviewerAvatar}
                />
                <div className={styles.reviewerInfo}>
                  <div className={styles.reviewerHeader}>
                    <h3 className={styles.reviewerName}>{review.reviewer.fullName}</h3>

                    {isMyReview && (
                      <div className={styles.menuWrapper}>
                        <button
                          className={styles.menuButton}
                          onClick={() => toggleMenu(review.id)}
                        >
                          <span className={styles.dot}></span>
                          <span className={styles.dot}></span>
                          <span className={styles.dot}></span>
                        </button>

                        {activeMenuId === review.id && (
                          <div className={styles.menuDropdown}>
                            <button onClick={() => handleEdit(review)}>Chỉnh sửa</button>
                            <button onClick={() => handleDelete(review.id)}>Xóa</button>
                          </div>
                        )}
                      </div>

                    )}
                  </div>

                  <p className={styles.reviewComment}>{review.comment}</p>
                  <div className={styles.reviewRating}>
                    <span className={styles.ratingText}>{review.rating}/5</span>
                    <Icon component={StarIcon} className={styles.starIcon} />
                  </div>
                </div>
              </div>
            );
          })

        ) : (
          <div className={styles.emptyState}>
            <p>Chưa có đánh giá nào</p>
          </div>
        )}
      </div>

        {/*Phân trang*/}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
          >
            Trang trước
          </button>
          <span>
            Trang {page + 1}/{totalPages}
          </span>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
          >
            Trang sau
          </button>
        </div>
      )}

      {editingReview && (
        <ReviewCreationModal
          user={user}
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSubmit={handleUpdate}
        />
      )}

    </div>
  );
};

export default ReviewSection;
