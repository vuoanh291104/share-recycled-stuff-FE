import { PostPurposeValues, PostStatusValues, RoleValues, type PostPurpose, type PostStatus, type Role } from '../types/enums';
import type { User, Post } from '../types/schema';

export const profileUser: User = {
  id: "user_1",
  account_id: 1,
  email: "oanh.vtk@example.com",
  full_name: "Vũ Trần Kim Oanh",
  phone: "33757005467",
  address: "234 Nguyễn Trác",
  ward: "Yên Nghĩa",
  district: "Hà Đông",
  city: "Hà Nội",
  id_card: "123456789012",
  avatar_url: "/images/tiger-avatar.jpg",
  bio: "Leader nhóm tui, siêu dễ tính, thích treo bọn tui lên cây",
  rating_average: 5.0,
  total_ratings: 29,
  roles: [RoleValues.CUSTOMER as Role],
  reviews: [],
  created_at: new Date('2024-01-01'),
  updated_at: new Date()
};

export const profileData = {
  user: profileUser,
  posts: [
    {
      id: 1,
      accountId: profileUser,
      createdAt: new Date(Date.now() - 3600000), // 1 hour ago
      updatedAt: new Date(),
      images: [
        {
          id: 1,
          imageUrl: "/images/totoro-rain-scene.jpg",
          displayOrder: 0
        }
      ],
      currentImageIndex: 0,
      likeCount: 100909,
      viewCount: 300,
      title: "Nhu cầu: Bán.",
      purpose: PostPurposeValues.FOR_SALE as PostPurpose,
      status: PostStatusValues.ACTIVE as PostStatus,
      category: "Ô",
      price: 0,
      content: "Ô màu hồng che mưa rất ổn, anh em cần mua ib mình.",
      hasMoreImages: false
    } as Post,
    {
      id: 2,
      accountId: profileUser,
      createdAt: new Date(Date.now() - 7200000), // 2 hours ago
      updatedAt: new Date(),
      images: [
        {
          id: 2,
          imageUrl: "/images/totoro-rain-scene.jpg",
          displayOrder: 0
        }
      ],
      currentImageIndex: 0,
      likeCount: 50000,
      viewCount: 150,
      title: "",
      purpose: PostPurposeValues.FREE_GIVEAWAY as PostPurpose,
      status: PostStatusValues.ACTIVE as PostStatus,
      category: "Gấu",
      price: 0,
      content: "Con gấu này nó ngoo...more",
      hasMoreImages: false
    } as Post
  ]
};
