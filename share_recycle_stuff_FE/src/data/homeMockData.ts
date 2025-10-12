import { PostPurposeValues, PostStatusValues, RoleValues, type PostPurpose, type PostStatus, type Role } from '../types/enums';
import type { Post, User } from '../types/schema';

// Data passed as props to the root component
export const mockRootProps = {
  currentUser: {
    id: "user_1",
    account_id: 1,
    email: "oanh.vtk@example.com",
    full_name: "Vũ Trần Kim Oanh",
    avatar_url: "/avatars/user-avatar-1.jpg",
    phone: "0123456789",
    address: "123 Đường A",
    ward: "Phường B",
    district: "Quận C",
    city: "TP.HCM",
    id_card: "123456789",
    bio: "Leader nhóm tui, siêu dễ tính, thích treo bọn tui lên cây.Leader nhóm tui, siêu dễ tính, thích treo bọn tui lên cây",
    rating_average: 4.8,
    total_ratings: 32,
    roles: [RoleValues.CUSTOMER as Role],
    reviews: [],
    created_at: new Date(),
    updated_at: new Date()
  } as User,
  posts: [
    {
      id: 1,
      accountId: {
        id: "user_12",
        account_id: 12,
        email: "duong.vt@example.com",
        full_name: "Vũ Thành Dươngaa",
        avatar_url: "/avatars/user-avatar-1.jpg",
        phone: "0123456789",
        address: "123 Đường A",
        ward: "Phường B",
        district: "Quận C",
        city: "TP.HCM",
        id_card: "123456789",
        bio: "Người yêu môi trường",
        rating_average: 4.8,
        total_ratings: 32,
        roles: [RoleValues.CUSTOMER as Role],
        created_at: new Date(),
        updated_at: new Date()
      } as User,
      createdAt: new Date(Date.now() - 3600000), // 1 hour ago
      updatedAt: new Date(),
      images: [
        {
          id: 1,
          imageUrl: "/images/post-background.jpg",
          displayOrder: 0
        }
      ],
      currentImageIndex: 0,
      likeCount: 100909,
      viewCount: 300,
      title: "Tiêu đề:",
      purpose: PostPurposeValues.FOR_SALE as PostPurpose,
      status: PostStatusValues.ACTIVE as PostStatus,
      category: "Gấu",
      price: 3000,
      content: "Đi mưa gặp gấu bắt về nuôi",
      hasMoreImages: true
    } as Post,
    {
      id: 2,
      accountId: {
        id: "user_1",
        account_id: 1,
        email: "duong.vt2@example.com",
        full_name: "Vũ Thành Dương",
        phone: "0123456789",
        address: "123 Đường A",
        ward: "Phường B",
        district: "Quận C",
        city: "TP.HCM",
        id_card: "123456789",
        avatar_url: "/avatars/u1.jpg",
        bio: "Người yêu môi trường",
        rating_average: 4.8,
        total_ratings: 32,
        roles: [RoleValues.CUSTOMER as Role],
        created_at: new Date(),
        updated_at: new Date()
      } as User,
      createdAt: new Date(Date.now() - 3600000), // 1 hour ago
      updatedAt: new Date(),
      images: [
        {
          id: 2,
          imageUrl: "/images/post-background.jpg",
          displayOrder: 0
        }
      ],
      currentImageIndex: 0,
      likeCount: 100909,
      viewCount: 29,
      title: "OKOK",
      purpose: PostPurposeValues.FREE_GIVEAWAY as PostPurpose,
      category: "Ô",
      price: 0,
      status: PostStatusValues.ACTIVE as PostStatus,
      content: "Con gấu này nó ngoo...more",
      hasMoreImages: false
    } as Post,
    {
      id: 3,
      accountId: {
        id: "user_1",
        account_id: 1,
        email: "duong.vt3@example.com",
        full_name: "Vũ Thành Dương",
        phone: "0123456789",
        address: "123 Đường A",
        ward: "Phường B",
        district: "Quận C",
        city: "TP.HCM",
        id_card: "123456789",
        avatar_url: "/avatars/user-avatar-1.jpg",
        bio: "Người yêu môi trường",
        rating_average: 4.8,
        total_ratings: 32,
        roles: [RoleValues.CUSTOMER as Role],
        created_at: new Date(),
        updated_at: new Date()
      } as User,
      createdAt: new Date(Date.now() - 3600000), // 1 hour ago
      updatedAt: new Date(),
      images: [
        {
          id: 3,
          imageUrl: "/images/post-background.jpg",
          displayOrder: 0
        }
      ],
      currentImageIndex: 0,
      likeCount: 100909,
      viewCount: 29,
      title: "",
      purpose: PostPurposeValues.FREE_GIVEAWAY as PostPurpose,
      category: "",
      status: PostStatusValues.ACTIVE as PostStatus,
      price: 0,
      content: "Ô màu hồng che mưa rất ổn, anh em cần mua ib mình.",
      hasMoreImages: true
    } as Post
  ]
};
