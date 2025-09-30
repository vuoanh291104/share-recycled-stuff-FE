import type { User } from '../../types/schema';
import styles from './PostCreation.module.css';

interface PostCreationProps {
  user: User;
}

const PostCreation = ({ user }: PostCreationProps) => {
  return (
    <div className={styles.postCreation}>
      <div className={styles.inputSection}>
        <img
          src={user.avatar_url}
          alt={user.full_name}
          className={styles.userAvatar}
        />
        <input
          type="text"
          placeholder="Bạn đang nghĩ gì ?"
          className={styles.postInput}
        />
      </div>
      <div className={styles.divider}></div>
    </div>
  );
};

export default PostCreation;
