import type { Category } from '../constant/Category';
import type { PostPurpose } from '../constant/PostPurpose';
import type { PostStatus, RequestDelegationStatus, RequestProxyStatus, Role, UserStatus } from './enums';

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
  avatarUrl: string | null;
  email: string;
}

// Basic post response from backend
export interface PostResponse {
  id: number;
  title: string;
  content: string;
  category: string;
  price: number;
  purpose: string | PostPurpose;
  status: PostStatus;
  viewCount: number | null;
  createdAt: [number, number, number, number, number, number, number];
  updatedAt: [number, number, number, number, number, number, number];
  author: UserInfo;
  images: PostImageResponse[];
}

// Detailed post response from backend
export interface PostDetailResponse extends PostResponse {
  likeCount?: number | 0;
  commentCount?: number | 0;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  category: Category["description"];
  price: number;
  purpose: string;
  status: PostStatus;
  viewCount: number | null;
  createdAt:  string;
  updatedAt: string;
  author: UserInfo;
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
  postId: string;
  parentCommentId: string | null;
  content: string;
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  author : UserInfo;
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
  idCardFrontImage?: string;
  idCardBackImage?: string;
  addressDetail: string;
  status: string;
  createdAt: number[];
  processedAt : number[];
  rejectionReason: string;
}

// Delegation Request
export interface RequestDelegationItemProps {
  id: number;
  customerId: number;
  customerName: string;
  proxySellerName: string;
  proxySellerId: number;
  productDescription: string;
  expectPrice: number;
  bankAccountNumber: string;
  bankName: string;
  accountHolderName: string;
  status: RequestDelegationStatus;
  rejectionReason?: string;
  createdAt: number [];
  updatedAt: number [];
  imageUrls: string[];
  onRefresh?: () => void;
}
//Report Management
export interface reporter {
  id: number,
  fullName: string,
  email: string,
  phoneNumber: string,
}

export interface reportedPost {
  id: number,
  title: string,
  content: string,
  authorName: string,
  status: string,
  createdAt: number []
}

export interface reportedAccount {
  id: number,
  fullName: string,
  email: string,
  phoneNumber: string,
  isLocked: boolean,
  createdAt: number[]
}

export interface processedBy {
  id: number,
  fullName: string,
  email: string
}

export interface ReportItemProps {
  id: number,
  reportType: string,
  violationType: string,
  content: string,
  evidenceUrl: string,
  status: string,
  adminResponse: string,
  createdAt: number[],
  processedAt: number[],
  reporter: reporter,
  reportedPost: reportedPost,
  reportedAccount:reportedAccount,
  processedBy: processedBy
}

export interface ProfileInfo {
  accountId: number,
  userId: number,
  email: string,
  fullName: string,
  phoneNumber: string,
  address: string,
  ward: string,
  city: string,
  idCard: string,
  avatarUrl: string,
  bio: string,
  ratingAverage: number,
  totalRatings: number,
}

// Proxy Seller Revenue Management
export interface ProxySellerRevenueResponse {
  proxySellerId: number;
  year: number;
  month: number;
  name: string;
  totalRevenue: number;
  discountProfitPayable: number;
  paymentStatus: string;
}
