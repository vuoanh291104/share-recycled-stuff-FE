import type { PostPurpose } from './enums';

// Props types (data passed to components)
export interface User {
  id: string;
  name: string;
  avatar: string;

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
