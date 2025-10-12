import { useState } from 'react';
import type { User } from '../../types/schema';
import type { PostPurpose } from '../../types/enums';
import styles from './PostCreation.module.css';
import CreationPostModal from './CreationPostModal'; // Modal tạo bài viết

interface PostCreationProps {
  user: User;
  onCreatePost?: (postData: {
    title: string;
    content: string;
    price: number;
    category: string;
    purpose: PostPurpose;
    images: string[];
  }) => void;
}

const PostCreation = ({ user, onCreatePost }: PostCreationProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInputClick = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  const handleSubmit = (postData: {
    title: string;
    content: string;
    price: number;
    category: string;
    purpose: PostPurpose;
    images: string[];
    createdAt?: Date;
  }) => {
    console.log('Bài viết mới:', postData);
    
    // Call parent callback to add post to state
    if (onCreatePost) {
      onCreatePost(postData);
    }
    
    // TODO: Gửi bài viết lên backend
  };

  return (
    <>
      {/* --- Ô tạo bài viết --- */}
      <div
        className={styles.postCreation}
        onClick={handleInputClick}
        style={{ cursor: 'pointer' }}
      >
        <div className={styles.inputSection}>
          <img
            src={user.avatar_url}
            alt={user.full_name}
            className={styles.userAvatar}
          />
          <input
            type="text"
            placeholder="Bạn đang nghĩ gì?"
            className={styles.postInput}
            readOnly
          />
        </div>
        <div className={styles.divider}></div>
      </div>

      {/* --- Modal tạo bài viết --- */}
      <CreationPostModal
        user={user}
        open={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default PostCreation;
