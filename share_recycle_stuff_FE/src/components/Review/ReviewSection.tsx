import Icon from '@ant-design/icons';
import StarIcon from '../icons/StarIcon';
import type { User } from '../../types/schema';
import styles from './ReviewSection.module.css';
import ReviewInput from './ReviewInput.tsx';

interface Review {
  id: string;
  reviewer: {
    name: string;
    avatar_url: string;
  };
  rating: number;
  comment: string;
}

interface ReviewSectionProps {
  user: User;
}

const ReviewSection = ({ user }: ReviewSectionProps) => {
  // Mock reviews data
  const reviews: Review[] = [
    {
      id: '1',
      reviewer: {
        name: 'Mạc Đức Dũng',
        avatar_url: 'https://i.pravatar.cc/150?img=1'
      },
      rating: 5,
      comment: 'Đây là nội dung đánh giá của tôi.'
    },
    {
      id: '2',
      reviewer: {
        name: 'Vũ Thanh Dương',
        avatar_url: 'https://i.pravatar.cc/150?img=2'
      },
      rating: 5,
      comment: 'Đây là nội dung đánh giá của tôi.'
    },
    {
      id: '3',
      reviewer: {
        name: 'Phạm Văn Thắn',
        avatar_url: 'https://i.pravatar.cc/150?img=3'
      },
      rating: 5,
      comment: 'Đây là nội dung đánh giá của tôi.'
    }
  ];

  return (
    <div className={styles.reviewSection}>
      <ReviewInput user={user} />
      
      <div className={styles.reviewsList}>
        {reviews.map((review) => (
            <div key={review.id} className={styles.reviewCard}>
            <img
                src={review.reviewer.avatar_url}
                alt={review.reviewer.name}
                className={styles.reviewerAvatar}
            />
            <div className={styles.reviewerInfo}>
                <h3 className={styles.reviewerName}>{review.reviewer.name}</h3>
                <p className={styles.reviewComment}>{review.comment}</p>
                <div className={styles.reviewRating}>
                <span className={styles.ratingText}>{review.rating}/5</span>
                <Icon 
                    component={StarIcon} 
                    className={styles.starIcon}
                />
                </div>
            </div>
            </div>
        ))}
        </div>

      {reviews.length === 0 && (
        <div className={styles.emptyState}>
          <p>Chưa có đánh giá nào</p>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
