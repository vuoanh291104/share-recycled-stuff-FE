import type { Post, PostResponse } from '../types/schema';
import { getPurposeDescription } from '../constant/PostPurpose';

export const normalizePost = (p: PostResponse): Post => {
  const formatDate = (arr: number[]): string => {
    const [year, month, day] = arr;
    return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
  };

  return {
    id: p.id,
    title: p.title,
    content: p.content,
    category: p.category,
    price: p.price,
    purpose:
      typeof p.purpose === 'string'
        ? getPurposeDescription(p.purpose)
        : p.purpose.description,
    status: p.status,
    viewCount: p.viewCount,
    createdAt: formatDate(p.createdAt),
    updatedAt: formatDate(p.updatedAt),
    author: p.author,
    images: p.images || [],
    currentImageIndex: 0,
    hasMoreImages: (p.images?.length || 0) > 1,
    likeCount: 0,
  };
};

export const normalizePosts = (posts: PostResponse[]): Post[] => {
  return posts.map(normalizePost);
};
