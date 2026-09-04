export const optimizeCloudinaryUrl = (url, width = 800) => {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('cloudinary.com')) return url;
  
  // A typical cloudinary URL:
  // https://res.cloudinary.com/cloud_name/image/upload/v12345/image.jpg
  // We want to insert 'q_auto,f_auto,w_{width}' after 'upload/'
  
  if (url.includes('/upload/') && !url.includes('q_auto')) {
    return url.replace('/upload/', `/upload/q_auto,f_auto,w_${width}/`);
  }
  
  return url;
};
