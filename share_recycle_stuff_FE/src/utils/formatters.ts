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