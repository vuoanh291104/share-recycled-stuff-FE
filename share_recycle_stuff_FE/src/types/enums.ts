export type PostPurpose = "Free GiveAway" | "For Sale" | "News/Information";

export const PostPurposeValues = {
  FREE: "Free GiveAway" as const,
  SALE: "For Sale" as const,
  NEWS: "News/Information" as const
} as const;

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
