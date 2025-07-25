// No need for axios if we use fetch consistently
// import axios from 'axios'; 

// frontend/src/services/api.ts

const API_BASE_URL = 'https://vishwas-blogsite.onrender.com/api';

export const fetchBlogPosts = async () => {
  const response = await fetch(`${API_BASE_URL}/blog-posts/`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

/**
 * Fetches a single blog post by its unique URL slug.
 */
export const fetchBlogPostBySlug = async (slug: string) => {
  // THE FIX: Changed '/blogs/' to '/blog-posts/' and switched to fetch
  const response = await fetch(`${API_BASE_URL}/blog-posts/${slug}/`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const fetchProjects = async () => {
  const response = await fetch(`${API_BASE_URL}/projects/`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const fetchAboutInfo = async () => {
  const response = await fetch(`${API_BASE_URL}/about/`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data[0]; 
};