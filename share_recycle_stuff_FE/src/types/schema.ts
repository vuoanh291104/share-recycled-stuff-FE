import type { PostPurpose, PostStatus, RequestProxyStatus, Role, UserStatus } from './enums';

// User review response from backend
export interface UserReviewResponse {
  reviewId: number;
  reviewerAccountId: number;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

// User profile response from backend (detailed profile with reviews)
export interface UserProfileResponse {
  accountId: number;
  userId: number;
  email: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  ward: string;
  district: string;
  city: string;
  idCard: string;
  avatarUrl: string;
  bio: string;
  ratingAverage: number;
  totalRatings: number;
  roles: Role[];
  reviews: UserReviewResponse[];
  createdAt: string;
  updatedAt: string;
}

// User detail response from backend (admin view)
export interface UserDetailResponse {
  userId: number;
  email: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  avatarUrl: string;
  status: UserStatus;
  roles: Role[];
  isLocked: boolean;
  lockReason?: string;
  lockedAt?: string;
  lockedBy?: string;
  createdAt: string;
  updatedAt: string;
}

// Frontend User type (for compatibility with existing components)
export interface User {
  id: string;
  account_id: number;
  email?: string;
  full_name: string;
  phone: string;
  address: string;
  ward: string;
  district: string;
  city: string;
  id_card?: string;
  avatar_url: string;
  bio: string;
  rating_average: number;
  total_ratings: number;
  roles?: Role[];
  reviews?: UserReviewResponse[];
  created_at: Date;
  updated_at: Date;
}

// Post image response from backend
export interface PostImageResponse {
  id: number;
  imageUrl: string;
  displayOrder: number;
}

// User info in post detail response
export interface UserInfo {
  id: number;
  fullName: string;
  avatarUrl: string;
  email: string;
}

// Basic post response from backend
export interface PostResponse {
  id: number;
  accountId: number;
  title: string;
  content: string;
  category: string;
  price: number;
  purpose: PostPurpose;
  status: PostStatus;
  images: PostImageResponse[];
}

// Detailed post response from backend
export interface PostDetailResponse {
  id: number;
  title: string;
  content: string;
  category: string;
  price: number;
  purpose: PostPurpose;
  status: PostStatus;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  author: UserInfo;
  images: PostImageResponse[];
}

export interface Post {
  id: number;
  accountId: number | User; 
  title: string;
  content: string;
  category: string;
  price: number;
  purpose: PostPurpose;
  status: PostStatus;
  viewCount: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  images: PostImageResponse[];
  currentImageIndex?: number;
  hasMoreImages?: boolean;
  likeCount?: number;
}

export type HomePageProps = {
  currentUser: User;
  posts: Post[];
}
export type ProfilePageProps = {
  currentUser: User;
  posts: Post[];
}
export interface Comment {
  id: string;
  post_id: string
  account_id: User;
  parent_comment_id: string | null;
  content: string;
  is_edited: boolean;
  created_at: Date;
  updated_at: Date | null;
  deleted_at: Date | null;
}

// Comment modal props
export interface CommentModalProps {
  isOpen: boolean;
  post: Post;
  comments: Comment[];
  currentUser: User;
  onClose: () => void;
  onAddComment: (content: string) => void;
  onReplyToComment: (commentId: string, content: string) => void;
  onDeleteComment: (commentId: string) => void;
  onEditComment: (commentId: string, newContent: string) => void;
}

// Comment item props
export interface CommentItemProps {
  comment: Comment;
  onReply: (parentCommentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
  onEdit: (commentId: string, newContent: string) => void;
  isReply?: boolean;
}

// Request Upgrade to become Proxy Seller
export interface RequestProxySellerItemProps {
  id?: number;         //Tạm để ? đây, sau bao giờ sửa API thì bỏ đi
  createDate?: string;
  status: RequestProxyStatus;
  processedDate?: string;
  listCCCDImages?: string[];
  reasonReject?: string;
}

//Admin see Upgrade Request
export interface RequestUpgradeDataProps {
  requestId: number;
  fullName: string;
  email: string;
  idCard: string;
  cardFront?: string;
  cardBack?: string;
  addressDetail: string;
  status: string;
  createdAt: number[];
}

