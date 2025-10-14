export type PostPurpose = "FREE_GIVEAWAY" | "FOR_SALE" | "NEWS_INFORMATION";

export const PostPurposeValues = {
  FREE_GIVEAWAY: "Cho tặng miễn phí" as const,
  FOR_SALE: "Bán" as const,
  NEWS_INFORMATION: "Tin tức, thông t in" as const
} as const;

export type PostStatus = "ACTIVE" | "EDIT" |"DELETED";

export const PostStatusValues = {
  ACTIVE: "ACTIVE" as const,
  EDIT: "EDIT" as const,
  DELETED: "DELETED" as const
} as const;

export const PostStatusText: Record<PostStatus, string> = {
  ACTIVE: "Hỏat động",
  EDIT: "Yêu cầu chỉnh sửa",
  DELETED: "Đã xóa"
};

// Navigation menu items
export type NavigationItem = 
  | "Trang chủ"
  | "Thông báo" 
  | "Quản lí bài đăng"
  | "Quản lí giao dịch"
  | "Ủy thác"
  | "Profile"
  | "Khiếu nại & Báo cáo"
  | "Ngôn ngữ"
  | "Đăng xuất";

export const NavigationItemValues = {
  HOME: "Trang chủ" as const,
  NOTIFICATIONS: "Thông báo" as const,
  POST_MANAGEMENT: "Quản lí bài đăng" as const,
  TRANSACTION_MANAGEMENT: "Quản lí giao dịch" as const,
  DELEGATION: "Ủy thác" as const,
  PROFILE: "Profile" as const,
  COMPLAINTS_REPORTS: "Khiếu nại & Báo cáo" as const,
  LANGUAGE: "Ngôn ngữ" as const,
  LOGOUT: "Đăng xuất" as const
} as const;

// Comment interaction types
export type CommentAction ="reply" | "edit" | "delete" | "report";

export const CommentActionValues = {
  REPLY: "reply" as const,
  EDIT: "edit" as const,
  DELETE: "delete" as const,
  REPORT: "report" as const
} as const;

// Modal states
export type ModalState = "open" | "closed" | "loading";

export const ModalStateValues = {
  OPEN: "open" as const,
  CLOSED: "closed" as const,
  LOADING: "loading" as const
} as const

export type RequestProxyStatus = "APPROVED" | "REJECTED" | "PENDING";

export const RequestProxyStatusText: Record<RequestProxyStatus, string> = {
  APPROVED: "Đã duyệt",
  REJECTED: "Bị từ chối",
  PENDING: "Đang xét duyệt",
};

// User roles
export type Role = "CUSTOMER" | "PROXY_SELLER" | "ADMIN";

export const RoleValues = {
  CUSTOMER: "CUSTOMER" as const,
  PROXY_SELLER: "PROXY_SELLER" as const,
  ADMIN: "ADMIN" as const
} as const;

export const RoleText: Record<Role, string> = {
  CUSTOMER: "Khách hàng",
  PROXY_SELLER: "Người bán ủy thác",
  ADMIN: "Quản trị viên"
};

// User account status
export type UserStatus = "ACTIVE" | "INACTIVE" | "LOCKED" | "DELETED";

export const UserStatusValues = {
  ACTIVE: "ACTIVE" as const,
  INACTIVE: "INACTIVE" as const,
  LOCKED: "LOCKED" as const,
  DELETED: "DELETED" as const
} as const;

export const UserStatusText: Record<UserStatus, string> = {
  ACTIVE: "Hoạt động",
  INACTIVE: "Không hoạt động",
  LOCKED: "Bị khóa",
  DELETED: "Đã xóa"
};
