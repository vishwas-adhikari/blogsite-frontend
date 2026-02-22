import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ExternalLink, Search, Filter } from 'lucide-react';
import { fetchBlogPosts, fetchCategories } from '../services/api'; // Added fetchCategories
import { getImageUrl, createExcerpt } from '../utils/imageUrl';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  image: string;
  tags: { id: number; name: string }[];
  publication_date: string;
  read_time: number;
  excerpt: string | null;
}

const BlogSection: React.FC = () => {
  const [fullPostList, setFullPostList] = useState<BlogPost[]>([]);
  const [allTags, setAllTags] = useState<string[]>(['All']);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // 1. Fetch Blog Posts
    const getBlogs = fetchBlogPosts().then((data: BlogPost[]) => {
      setFullPostList(data);
    });

    // 2. Fetch Curated Categories for the Filter Bar
    const getCategories = fetchCategories().then((tags: any[]) => {
      setAllTags(['All', ...tags.map((t) => t.name)]);
    });

    // Run both, then stop loading
    Promise.all([getBlogs, getCategories])
      .then(() => setLoading(false))
      .catch((err: unknown) => {
        console.error('Failed to fetch data:', err);
        setError('Could not load content. Check backend connection.');
        setLoading(false);
      });
  }, []);

  const filteredPosts = fullPostList.filter((post) => {
    const searchStr = searchTerm.toLowerCase();

    const matchesSearch =
      post.title.toLowerCase().includes(searchStr) ||
      (post.excerpt?.toLowerCase() || '').includes(searchStr) ||
      (post.content?.toLowerCase() || '').includes(searchStr);

    const matchesTag =
      selectedTag === 'All' ||
      post.tags.some((tag) => tag.name === selectedTag);

    return matchesSearch && matchesTag;
  });

  if (loading) return <div className="text-center py-20 text-gray-400 font-mono">INITIALIZING_FEED...</div>;
  if (error) return <div className="text-center text-red-500 py-20">{error}</div>;

  return (
    <section id="blogs" className="py-16 px-6 bg-[#191a23] relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Latest <span className="text-green-400">Blogs</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Deep dives into cybersecurity, CTF writeups, and technical insights.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-full border border-gray-700 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 outline-none transition-all duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-full font-medium text-xs transition-all duration-300 ${
                  selectedTag === tag
                    ? 'bg-white text-black shadow-2xl'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.slice(0, 9).map((post) => (
            <article
              key={post.id}
              className="bg-gray-800/50 rounded-xl overflow-hidden shadow-xl border border-gray-700/50 transition-all duration-500 group flex flex-col"
            >
              <div className="relative overflow-hidden">
                <img
                  src={getImageUrl(post.image)}
                  alt={post.title}
                  className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>

              <div className="p-4 flex flex-col flex-grow">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(post.publication_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{post.read_time} min</span>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-green-400 transition-colors flex-grow">
                  {post.title}
                </h3>

                <p className="text-sm text-gray-400 mb-4 leading-relaxed line-clamp-3">
                  {post.excerpt || createExcerpt(post.content)}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {post.tags.map((tag) => (
                    <span key={tag.id} className="px-2 py-1 text-[10px] uppercase font-bold bg-gray-700 text-gray-300 rounded-full">
                      {tag.name}
                    </span>
                  ))}
                </div>

                <Link
                  to={`/blog/${post.slug}`}
                  className="w-full mt-auto bg-white text-black py-2.5 px-4 rounded-full font-bold text-sm hover:scale-105 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Read more</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {filteredPosts.length === 0 && !loading && (
          <div className="text-center py-12">
            <Filter className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-lg text-gray-400">No matching intel found.</p>
          </div>
        )}

        <div className="text-center mt-12">
          <Link to="/blogs" className="border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-black transition">
            Explore All Articles
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
