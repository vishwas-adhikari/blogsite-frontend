// frontend/src/utils/imageUrl.ts

// Your Cloudinary Cloud Name from the working link you provided
const CLOUD_NAME = 'daoqvaxeq'; 
const BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/`;

export const getImageUrl = (imagePath: string | undefined | null) => {
  if (!imagePath) return ''; // Return empty if no image

  // 1. If the path is ALREADY a full URL (starts with http), use it as is.
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // 2. If it's a relative path (like 'blog_images/pic.jpg'), add the Cloudinary domain.
  // We ensure we don't double up slashes if the path already starts with one.
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  
  return `${BASE_URL}${cleanPath}`;
};


/**
 * Removes HTML tags from a string and shortens it.
 * Used as a fallback when excerpt is missing (Supabase migration case)
 */
export const createExcerpt = (html: string, maxLength: number = 150) => {
  if (!html) return '';
  const plainText = html.replace(/<[^>]*>?/gm, '');
  return plainText.length > maxLength
    ? plainText.substring(0, maxLength) + '...'
    : plainText;
};


/**
 * Generates a folder path string based on the current date.
 * Example: "uploads/2026/02/06"
 */
export const getDatePath = (baseFolder: string) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Adds leading zero
  const day = String(now.getDate()).padStart(2, '0');
  
  return `${baseFolder}/${year}/${month}/${day}`;
};