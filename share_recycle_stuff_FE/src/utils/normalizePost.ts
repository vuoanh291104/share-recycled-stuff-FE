import type { Post, PostResponse } from '../types/schema';
import { getPurposeDescription } from '../constant/PostPurpose';

export const normalizePost = (p: PostResponse): Post => ({
  id: p.id,
  title: p.title,
  content: p.content,
  category: p.category,
  price: p.price,
  purpose: typeof p.purpose === 'string' ? getPurposeDescription(p.purpose) : p.purpose.description,
  status: p.status,
  viewCount: p.viewCount,
  createdAt: new Date(...p.createdAt),
  updatedAt: new Date(...p.updatedAt),
  author: p.author,
  images: p.images || [],
  currentImageIndex: 0,
  hasMoreImages: (p.images?.length || 0) > 1,
  likeCount: 0,
});

export const normalizePosts = (posts: PostResponse[]): Post[] => {
  return posts.map(normalizePost);
};
