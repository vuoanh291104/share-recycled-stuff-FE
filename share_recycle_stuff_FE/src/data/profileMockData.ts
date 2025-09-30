import { PostPurposeValues, type PostPurpose } from '../types/enums';
import type { User} from '../types/schema';

export const profileUser: User = {
  id: "user_1",
  account_id: 1,
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
  created_at: new Date('2024-01-01'),
  updated_at: new Date()
};

export const profileData = {
  user: profileUser,
  posts: [
    {
      id: "post_profile_1",
      account_id: profileUser,
      create_at: new Date(Date.now() - 3600000), // 1 hour ago
      images: [
        "/images/totoro-rain-scene.jpg"
      ],
      currentImageIndex: 0,
      like_count: 100909,
      view_count: 300,
      title: "Nhu cầu: Bán.",
      purpose: PostPurposeValues.SALE as PostPurpose,
      status: "Approved",
      admin_review_comment: "",
      category: "Ô",
      price: 0,
      content: "Ô màu hồng che mưa rất ổn, anh em cần mua ib mình.",
      hasMoreImages: false,
      update_at: new Date(),
      delete_at: null
    },
    {
      id: "post_profile_2",
      account_id: profileUser,
      create_at: new Date(Date.now() - 7200000), // 2 hours ago
      images: [
        "/images/totoro-rain-scene.jpg"
      ],
      currentImageIndex: 0,
      like_count: 50000,
      view_count: 150,
      title: "",
      purpose: PostPurposeValues.FREE as PostPurpose,
      status: "Approved",
      admin_review_comment: "",
      category: "Gấu",
      price: 0,
      content: "Con gấu này nó ngoo...more",
      hasMoreImages: false,
      update_at: new Date(),
      delete_at: null
    }
  ]
};
