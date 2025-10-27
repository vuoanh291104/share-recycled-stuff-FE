import { useState } from 'react';
import type { User, UserInfo } from '../../types/schema';
import styles from '../Profile/PostCreation.module.css';
import ReviewCreationModal from './ReviewCreationModal';
import { postData } from '../../api/api';
import type { ErrorResponse } from '../../api/api';
import { useMessage } from '../../context/MessageProvider';

interface ReviewInputProps {
  user: UserInfo;
  reviewedUserId : number;
  onReviewSuccess: () => void;
}

const ReviewInput = ({ user, reviewedUserId, onReviewSuccess  }: ReviewInputProps) => {

  const {showMessage} = useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInputClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (rating: number, comment: string) => {
    console.log('New review:', { rating, comment });

    const payload = {
      reviewedUserId: reviewedUserId,
      rating: rating,
      comment:comment
    }

    try {
      const res = await postData<{message : string}>('/api/reviews', payload);
      showMessage ({type:"success", message: res.message})
      onReviewSuccess();
      handleModalClose();
    } catch (error : any) {
      const errData : ErrorResponse = error
      showMessage({type: "error", message : errData.message, code: errData.status})
    }
  };

  return (
    <>
      <div className={styles.postCreation} onClick={handleInputClick} style={{ cursor: 'pointer' }}>
        <div className={styles.inputSection}>
          <img
            src={user.avatarUrl || 'example'}
            alt={user.fullName}
            className={styles.userAvatar}
          />
          <input
            type="text"
            placeholder="Viết đánh giá ..."
            className={styles.postInput}
            readOnly
          />
        </div>
        <div className={styles.divider}></div>
      </div>

      <ReviewCreationModal
        user={user}
        open={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default ReviewInput;
