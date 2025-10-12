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

export const formatCommentTime = (timestamp: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds}s`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d`;
  }
  
  return timestamp.toLocaleDateString('vi-VN');
};

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
