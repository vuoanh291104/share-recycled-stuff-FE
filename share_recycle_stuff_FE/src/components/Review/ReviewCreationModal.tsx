import { useState } from 'react';
import { Modal, Button } from 'antd';
import type { User } from '../../types/schema';
import { MinusIcon, PlusIcon, CloseSquareIcon } from '../icons/CountIcon';
import styles from './ReviewCreationModal.module.css';

interface ReviewCreationModalProps {
  user: User;
  open: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
}

const ReviewCreationModal = ({ user, open, onClose, onSubmit }: ReviewCreationModalProps) => {
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState('');

  const handleIncrement = () => {
    if (rating < 5) setRating(rating + 1);
  };

  const handleDecrement = () => {
    if (rating > 1) setRating(rating - 1);
  };

  const handleSubmit = () => {
    onSubmit(rating, comment);
    setComment('');
    setRating(1);
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closeIcon={null}
      width={702}
      centered
      className={styles.modalWrapper}
    >
      <div className={styles.reviewCreation}>
        <div className={styles.header}>
          <div className={styles.userInfo}>
            <img
              src={user.avatar_url}
              alt={user.full_name}
              className={styles.avatar}
            />
            <h3 className={styles.userName}>{user.full_name}</h3>
          </div>
          <button className={styles.closeButton} onClick={onClose} type="button">
            <CloseSquareIcon />
          </button>
        </div>

        <div className={styles.content}>
          <textarea
            className={styles.textarea}
            placeholder="Nội dung:"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={5}
          />

          <div className={styles.ratingSection}>
            <span className={styles.ratingLabel}>Số điểm:</span>
            <div className={styles.ratingControls}>
              <button 
                className={styles.controlButton}
                onClick={handleDecrement}
                disabled={rating <= 1}
                type="button"
              >
                <MinusIcon />
              </button>
              <span className={styles.ratingValue}>{rating}</span>
              <button 
                className={styles.controlButton}
                onClick={handleIncrement}
                disabled={rating >= 5}
                type="button"
              >
                <PlusIcon />
              </button>
            </div>
          </div>
        </div>

        <Button
          type="primary"
          className={styles.postButton}
          onClick={handleSubmit}
          size="large"
        >
          Post
        </Button>
      </div>
    </Modal>
  );
};

export default ReviewCreationModal;
