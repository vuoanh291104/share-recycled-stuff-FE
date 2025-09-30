import {PostPurposeValues, type PostPurpose } from '../types/enums';
// Data passed as props to the root component
export const mockRootProps = {
  currentUser: {
    id: "user_1",
    account_id: 1,
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
    created_at: new Date(),
    updated_at: new Date()
  },
  posts: [
    {
      id: "post_1",
      account_id: {
        id: "user_1",
        account_id: 1,
        full_name: "Vũ Thành Dương",
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
        created_at: new Date(),
        updated_at: new Date()
        },
      create_at: new Date(Date.now() - 3600000), // 1 hour ago
      images: [
        "/images/post-background.jpg"
      ],
      currentImageIndex: 0,
      like_count: 100909,
      view_count: 300,
      title: "Tiêu đề:",
      purpose: PostPurposeValues.SALE as PostPurpose,
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
        id: "user_1",
        account_id: 1,
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
        created_at: new Date(),
        updated_at: new Date()
      },
      create_at: new Date(Date.now() - 3600000), // 1 hour ago
      images: [
        "/images/post-background.jpg"
      ],
      currentImageIndex: 0,
      like_count: 100909,
      view_count: 29,
      title: "OKOK",
      admin_review_comment: "",
      purpose: PostPurposeValues.FREE as PostPurpose,
      category: "Ô",
      price: 0,
      status:"Approved",
      content: "Con gấu này nó ngoo...more",
      hasMoreImages: false,
      update_at: new Date(),
      delete_at: null
    },
    {
      id: "post_3",
      account_id: {
        id: "user_1",
        account_id: 1,
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
        created_at: new Date(),
        updated_at: new Date()
      },
      create_at: new Date(Date.now() - 3600000), // 1 hour ago
      images: [
        "/images/post-background.jpg"
      ],
      currentImageIndex: 0,
      like_count: 100909,
      view_count: 29,
      title: "",
      purpose: PostPurposeValues.FREE as PostPurpose,
      category: "",
      status:"Approved",
      admin_review_comment: "",
      price: 0,
      content: "Ô màu hồng che mưa rất ổn, anh em cần mua ib mình.",
      hasMoreImages: true,
      update_at: new Date(),
      delete_at: null
    }
  ]
};
