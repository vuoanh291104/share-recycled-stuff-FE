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
  status: string
  admin_review_comment: string
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
