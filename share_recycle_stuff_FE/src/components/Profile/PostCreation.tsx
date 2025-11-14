import { useState } from 'react';
import type { UserInfo } from '../../types/schema';
import type { PostPurpose } from '../../types/enums';
import styles from './PostCreation.module.css';
import CreationPostModal from './CreationPostModal';

interface PostCreationProps {
  user: UserInfo;
  onCreatePost: (postData: {
    accountId: number;
    title: string;
    content: string;
    price: number;
    categoryId: number;
    purposeCode: number;
    images: { imageUrl: string; displayOrder: number }[];
  }) => void;
}

const PostCreation = ({ user, onCreatePost }: PostCreationProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInputClick = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

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
            src={user.avatarUrl || "/images/default-avatar.png"}
            alt={user.fullName}
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
        onSubmit={onCreatePost}
      />
    </>
  );
};

export default PostCreation;
