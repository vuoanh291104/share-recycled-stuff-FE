import { useNavigate } from 'react-router-dom';
import { formatTimeAgo, formatPrice } from '../../utils/formatters';
import styles from './SearchResultCard.module.css';

interface AuthorSummary {
  id: number;
  displayName: string;
  avatarUrl: string;
}

interface SearchResult {
  id: number;
  title: string;
  price: number;
  thumbnailUrl: string;
  location: string;
  categoryName: string;
  purposeName: string;
  createdAt: string;
  viewCount: number;
  reactionCount: number;
  commentCount: number;
  author: AuthorSummary;
}

interface SearchResultCardProps {
  result: SearchResult;
}

const SearchResultCard = ({ result }: SearchResultCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/post/${result.id}`);
  };

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/profile/${result.author.id}`);
  };

  return (
    <article className={styles.card} onClick={handleClick}>
      <div className={styles.imageContainer}>
        <img
          src={result.thumbnailUrl || '/images/placeholder.png'}
          alt={result.title}
          className={styles.thumbnail}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.authorInfo} onClick={handleAuthorClick}>
            <img
              src={result.author.avatarUrl || '/avatars/default.png'}
              alt={result.author.displayName}
              className={styles.authorAvatar}
            />
            <div>
              <span className={styles.authorName}>{result.author.displayName}</span>
              <span className={styles.timestamp}>{formatTimeAgo(new Date(result.createdAt))}</span>
            </div>
          </div>

          <div className={styles.badges}>
            <span className={styles.categoryBadge}>{result.categoryName}</span>
            <span className={styles.purposeBadge}>{result.purposeName}</span>
          </div>
        </div>

        <h3 className={styles.title}>{result.title}</h3>

        <div className={styles.details}>
          <div className={styles.price}>{formatPrice(result.price)}</div>
          <div className={styles.location}>📍 {result.location}</div>
        </div>

        <div className={styles.stats}>
          <span className={styles.stat}>
            👁 {result.viewCount || 0} lượt xem
          </span>
          <span className={styles.stat}>
            ❤️ {result.reactionCount || 0} thích
          </span>
          <span className={styles.stat}>
            💬 {result.commentCount || 0} bình luận
          </span>
        </div>
      </div>
    </article>
  );
};

export default SearchResultCard;
