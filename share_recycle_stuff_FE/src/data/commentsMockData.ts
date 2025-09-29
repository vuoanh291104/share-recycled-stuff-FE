import type { Comment } from '../types/schema';
import { mockRootProps } from './homeMockData';


// Mock comments data for the comment modal
export const mockCommentsData = {
  comments: [
    {
      id: "comment_1",
      post_id: "post_1",
      account_id: {
        id: "user_3",
        name: "Nguyễn Văn A",
        avatar: "/avatars/user-avatar-1.jpg"
      },
      parent_comment_id: null,
      content: "Gấu này dễ thương quá! Bán bao nhiêu vậy bạn?",
      is_edited: false,
      created_at: new Date(Date.now() - 1800000), // 30 minutes ago
      updated_at: new Date(Date.now() - 1800000),
      deleted_at: null
    },
    {
      id: "reply_1",
      post_id: "post_1",
      account_id: {
        id: "user_2",
        name: "Vũ Thành Dương",
        avatar: "/avatars/user-avatar-1.png"
      },
      parent_comment_id: "comment_1",
      content: "3000 VNĐ nhé bạn, còn mới 100%",
      is_edited: false,
      created_at: new Date(Date.now() - 1500000), // 25 minutes ago
      updated_at: new Date(Date.now() - 1500000),
      deleted_at: null
    },
    {
      id: "comment_2",
      post_id: "post_1",
      account_id: {
        id: "user_4",
        name: "Trần Thị B",
        avatar: "/avatars/user-avatar-1.jpg"
      },
      parent_comment_id: null,
      content: "Mình có thể đến xem trực tiếp được không?",
      is_edited: false,
      created_at: new Date(Date.now() - 900000),
      updated_at: new Date(Date.now() - 900000),
      deleted_at: null
    },
    {
      id: "comment_3",
      post_id: "post_1",
      account_id: {
        id: "user_5",
        name: "Lê Văn C",
        avatar: "/avatars/user-avatar-1.png"
      },
      parent_comment_id: null,
      content: "Totoro! Nhớ tuổi thơ quá 😍",
      is_edited: false,
      created_at: new Date(Date.now() - 300000),
      updated_at: new Date(Date.now() - 300000),
      deleted_at: null
    }
  ]
};

// Comment API functions
export const commentAPI = {
  fetchComments: async (postId: string): Promise<Comment[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Lọc theo post_id nếu cần
    return mockCommentsData.comments.filter(c => c.post_id === postId);
  },
  addComment: async (postId: string, content: string, parentCommentId: string | null = null): Promise<Comment> => {
    const currentUser = mockRootProps.currentUser;
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id: `comment_${Date.now()}`,
      post_id: postId,
      account_id: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar
      },
      parent_comment_id: parentCommentId,
      content,
      is_edited: false,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null
    };
  }
};
