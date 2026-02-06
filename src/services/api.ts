import { supabase } from './supabase';

// --- Types to help with data transformation ---
// These ensure we format the data exactly how your components expect it
interface TagResponse {
  Tag: {
    id: number;
    name: string;
  } | null; // It can be null if the link is broken, though unlikely
}

// --- Helper function to flatten tags ---
// Turns Supabase's nested "BlogPost_Tag -> Tag" structure into a simple "Tag[]" array
const transformTags = (data: any[]) => {
  return data.map((item: any) => ({
    ...item,
    tags: item.tags ? item.tags.map((t: TagResponse) => t.Tag).filter(Boolean) : []
  }));
};

/**
 * Fetch all Blog Posts
 */
export const fetchBlogPosts = async () => {
  // We select the blog post, and "join" the tags table
  const { data, error } = await supabase
    .from('BlogPost')
    .select(`
      *,
      tags:BlogPost_Tag (
        Tag (id, name)
      )
    `)
    .order('publication_date', { ascending: false });

  if (error) throw error;
  
  // Transform the nested Supabase data to match your component's expected format
  return transformTags(data);
};

/**
 * Fetch a Single Blog Post by Slug
 */
export const fetchBlogPostBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('BlogPost')
    .select(`
      *,
      tags:BlogPost_Tag (
        Tag (id, name)
      )
    `)
    .eq('slug', slug)
    .single();

  if (error) throw error;

  // Transform the single object
  const transformed = transformTags([data]);
  return transformed[0];
};

/**
 * Fetch all Projects
 */
export const fetchProjects = async () => {
  const { data, error } = await supabase
    .from('Project')
    .select(`
      *,
      tags:Project_Tag (
        Tag (id, name)
      )
    `)
    // --- THIS IS THE FIX ---
    // Change 'true' to 'false' to show the highest ID (most recent) first
    .order('created_at', { ascending: false }); 

  if (error) throw error;
  return transformTags(data);
};

/**
 * Fetch all CTFs
 */
export const fetchCtfs = async () => {
  // CTFs don't have tags in your model, so this is a simple query
  const { data, error } = await supabase
    .from('Ctf')
    .select('*')
    .order('event_date', { ascending: false });

  if (error) throw error;
  return data;
};

/**
 * Fetch a Single CTF by Slug
 */
export const fetchCtfBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('Ctf')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data;
};

/**
 * Fetch About Info
 */
export const fetchAboutInfo = async () => {
  // 1. Fetch the main About Info
  const { data: aboutData, error: aboutError } = await supabase
    .from('AboutInfo')
    .select('*')
    .single(); // Assuming there is only 1 row

  if (aboutError) throw aboutError;

  // 2. Fetch the related Social Links
  const { data: socialData, error: socialError } = await supabase
    .from('SocialLink')
    .select('*')
    .eq('about_info_id', aboutData.id);

  if (socialError) throw socialError;

  // Combine them to match the structure your component expects
  return {
    ...aboutData,
    socials: socialData
  };
};

// Note: The newsletter subscription function (subscribeToNewsletter) 
// will need to be handled differently (e.g., Supabase Edge Functions)
// or removed for now, as Supabase is a database, not a backend logic server.


export const fetchCategories = async () => {
  const { data, error } = await supabase
    .from('Tag')
    .select('*')
    .eq('is_category', true) // <-- This is the filter you just created
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
};