import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { fetchBlogPostBySlug } from '../services/api'; // Fetches one specific post

interface Blog {
  id: number;
  title: string;
  slug: string;
  content: string; // The backend provides this as ready-to-render HTML
  image: string;
  tags: { id: number; name: string }[];
  publication_date: string;
  read_time: number;
}

const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>(); // We use the 'slug' from the URL now
  const navigate = useNavigate();
  
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchBlogPostBySlug(slug)
        .then((data) => {
          setBlog(data as Blog);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [slug]);
  
  if (loading) {
    return <div className="min-h-screen pt-20 px-6 flex items-center justify-center">Loading post...</div>;
  }

  if (!blog) {
    return (
      <div className="min-h-screen pt-20 px-6 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Blog Not Found</h1>
          <button
            onClick={() => navigate('/')}
            className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:scale-105 transition-all duration-300"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#191a23] text-white">
      {/* Hero Section (now with dynamic data) */}
      <div className="relative pt-20">
        <div 
          className="h-64 md:h-80 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${blog.image})` }}
        >
          <div className="absolute inset-0 bg-[#191a23] bg-opacity-75"></div>
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-4xl mx-auto px-6 pb-8 w-full">
              <button
                onClick={() => navigate('/')}
                className="bg-white text-black px-4 py-2 rounded-full font-semibold text-sm mb-6 inline-flex items-center space-x-2 hover:scale-105 transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Blogs</span>
              </button>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {blog.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-3 py-1 text-xs font-medium bg-white text-black rounded-full"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                {blog.title}
              </h1>
              
              <div className="flex items-center space-x-4 text-sm text-gray-300">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(blog.publication_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{blog.read_time} min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content (now using dangerouslySetInnerHTML for rich text) */}
      <article className="max-w-4xl mx-auto px-6 py-12">
        <div 
          className="prose prose-invert lg:prose-xl max-w-none text-gray-300"
          dangerouslySetInnerHTML={{ __html: blog.content }} 
        />
        
        <div className="mt-12 pt-8 border-t border-gray-800">
          <button
            onClick={() => navigate('/')}
            className="bg-white text-black px-6 py-3 rounded-full font-semibold inline-flex items-center space-x-2 hover:scale-105 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Blogs</span>
          </button>
        </div>
      </article>
    </div>
  );
};

export default BlogDetailPage;