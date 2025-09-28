
import {PostPurposeValues, type PostPurpose } from '../types/enums';
// Data passed as props to the root component
export const mockRootProps = {
  currentUser: {
    id: "user_1",
    name: "Vũ Trần Kim Oanh",
    avatar: "/avatars/user-avatar-1.jpg"
  },
  posts: [
    {
      id: "post_1",
      account_id: {
        id: "user_2",
        name: "Vũ Thành Dương",
        avatar: "/avatars/user-avatar-1.jpg"
      },
      create_at: new Date(Date.now() - 3600000), // 1 hour ago
      images: [
        "/images/post-background.jpg"
      ],
      currentImageIndex: 0,
      like_count: 100909,
      view_count: 300,
      title: "Tiêu đề:",
      purpose: PostPurposeValues.SELL as PostPurpose,
      status:"Approved",
      admin_review_comment: "",
      category: "Gấu",
      price: 3000,
      content: "Đi mưa gặp gấu bắt về nuôi",
      hasMoreImages: true,
      update_at: new Date(),
      delete_at: null
    },
    {
      id: "post_2", 
      account_id: {
        id: "user_2",
        name: "Vũ Thành Dương",
        avatar: "/avatars/user-avatar-1.jpg"
      },
      create_at: new Date(Date.now() - 3600000), // 1 hour ago
      images: [
        "/images/post-background.jpg"
      ],
      currentImageIndex: 0,
      like_count: 100909,
      view_count: 29,
      title: "OKOK",
      purpose: PostPurposeValues.GIVE_AWAY as PostPurpose,
      category: "Ô",
      price: 0,
      content: "Con gấu này nó ngoo...more",
      hasMoreImages: false,
      update_at: new Date(),
      delete_at: null
    },
    {
      id: "post_3",
      account_id: {
        id: "user_2", 
        name: "Vũ Thành Dương",
        avatar: "/avatars/user-avatar-1.jpg"
      },
      create_at: new Date(Date.now() - 3600000), // 1 hour ago
      images: [
        "/images/post-background.jpg"
      ],
      currentImageIndex: 0,
      like_count: 100909,
      view_count: 29,
      title: "",
      purpose: PostPurposeValues.GIVE_AWAY as PostPurpose,
      category: "",
      price: 0,
      content: "Ô màu hồng che mưa rất ổn, anh em cần mua ib mình.",
      hasMoreImages: true,
      update_at: new Date(),
      delete_at: null
    }
  ]
};
