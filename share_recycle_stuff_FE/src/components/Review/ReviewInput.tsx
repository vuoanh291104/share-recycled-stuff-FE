import { useState } from 'react';
import type { User } from '../../types/schema';
import styles from '../Profile/PostCreation.module.css';
import ReviewCreationModal from './ReviewCreationModal';

interface ReviewInputProps {
  user: User;
}

const ReviewInput = ({ user }: ReviewInputProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInputClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (rating: number, comment: string) => {
    console.log('New review:', { rating, comment });
    // TODO: Handle review submission
  };

  return (
    <>
      <div className={styles.postCreation} onClick={handleInputClick} style={{ cursor: 'pointer' }}>
        <div className={styles.inputSection}>
          <img
            src={user.avatar_url}
            alt={user.full_name}
            className={styles.userAvatar}
          />
          <input
            type="text"
            placeholder="Hãy viết gì đó cho Oanh..."
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
