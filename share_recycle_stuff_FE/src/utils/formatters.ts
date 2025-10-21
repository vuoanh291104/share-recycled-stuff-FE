export const formatLikes = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M likes`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K likes`;
  }
  return `${count.toLocaleString()} likes`;
};

export const formatViews = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M views`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K views`;
  }
  return `${count} views`;
};

export const formatTimeAgo = (timestamp: Date): string => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d`;
};

export const formatPrice = (price: number): string => {
  return `${price.toLocaleString()}VNĐ`;
};

export function formatCommentTime(timestamp: string | Date | number[]): string {
  if (!timestamp) return '';

  let date: Date;

  if (Array.isArray(timestamp)) {
    // Java LocalDateTime -> [year, month, day, hour, minute, second, nano]
    const [y, m, d, h = 0, min = 0, s = 0] = timestamp;
    date = new Date(y, m - 1, d, h, min, s);
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else {
    date = new Date(timestamp);
  }

  if (isNaN(date.getTime())) return '';

  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Vừa xong';
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  return `${days} ngày trước`;
}


export const formatReplyCount = (count: number): string => {
  if (count === 0) return '';
  if (count === 1) return '1 reply';
  return `${count} replies`;
};

// Convert UserProfileResponse from backend to frontend User format
export const convertUserProfileToUser = (profile: any): any => {
  return {
    id: profile.userId?.toString() || profile.accountId?.toString() || '',
    account_id: profile.accountId || profile.userId || 0,
    full_name: profile.fullName || '',
    phone: profile.phoneNumber || '',
    address: profile.address || '',
    ward: profile.ward || '',
    district: profile.district || '',
    city: profile.city || '',
    id_card: profile.idCard || '',
    avatar_url: profile.avatarUrl || '',
    bio: profile.bio || '',
    rating_average: profile.ratingAverage || 0,
    total_ratings: profile.totalRatings || 0,
    created_at: profile.createdAt ? new Date(profile.createdAt) : new Date(),
    updated_at: profile.updatedAt ? new Date(profile.updatedAt) : new Date()
  };
};

// Convert frontend User to backend UserProfileResponse format
export const convertUserToUserProfile = (user: any): any => {
  return {
    accountId: user.account_id || 0,
    userId: parseInt(user.id) || user.account_id || 0,
    email: user.email || '',
    fullName: user.full_name || '',
    phoneNumber: user.phone || '',
    address: user.address || '',
    ward: user.ward || '',
    district: user.district || '',
    city: user.city || '',
    idCard: user.id_card || '',
    avatarUrl: user.avatar_url || '',
    bio: user.bio || '',
    ratingAverage: user.rating_average || 0,
    totalRatings: user.total_ratings || 0,
    roles: user.roles || [],
    reviews: user.reviews || [],
    createdAt: user.created_at ? user.created_at.toISOString() : new Date().toISOString(),
    updatedAt: user.updated_at ? user.updated_at.toISOString() : new Date().toISOString()
  };
};

export const formatDate = (arr?: number[] | string): string => {
  if (!arr) return '';
  
  let year, month, day;

  if (Array.isArray(arr)) {
    [year, month, day] = arr;
  } else if (typeof arr === 'string') {
    // Tách bằng dấu '-' hoặc '/'
    const parts = arr.split(/[-/]/).map(Number);
    [year, month, day] = parts;
  } else {
    return '';
  }

  if (!year || !month || !day) return '';

  return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
};
