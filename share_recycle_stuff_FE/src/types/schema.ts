import type { PostPurpose, RequestProxyStatus } from './enums';

// Props types (data passed to components)
export interface User {
  id: string;
  account_id: number;
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
  created_at: Date;
  updated_at: Date;
}

export interface Post {
  id: string;
  account_id: User;
  title: string;
  content: string;
  category: string;
  price: number;
  purpose: PostPurpose;
  status: string;
  admin_review_comment: string;
  view_count: number;
  like_count: number;
  create_at: Date;
  update_at: Date;
  delete_at: Date| null;
  images: string[];
  currentImageIndex: number;
  hasMoreImages: boolean;
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

