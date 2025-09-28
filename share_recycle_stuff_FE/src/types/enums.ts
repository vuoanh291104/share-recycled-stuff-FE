export type PostPurpose = "Bán" | "Tặng" | "Mua";

export const PostPurposeValues = {
  SELL: "Bán" as const,
  GIVE_AWAY: "Tặng" as const,
  BUY: "Mua" as const
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
