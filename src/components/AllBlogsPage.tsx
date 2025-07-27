import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ExternalLink, Search, Filter, ArrowLeft } from 'lucide-react';
import { fetchBlogPosts } from '../services/api';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string; // This can be removed if not used for searching
  image: string;
  tags: { id: number; name: string }[];
  publication_date: string;
  read_time: number;
  excerpt: string; // We'll use the excerpt from the API
}

const AllBlogsPage: React.FC = () => {
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [allTags, setAllTags] = useState<string[]>(['All']);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch ALL posts, no .slice()
    fetchBlogPosts()
      .then((data: BlogPost[]) => {
        setAllPosts(data);
        const uniqueTags = new Set(data.flatMap((post) => post.tags.map(tag => tag.name)));
        setAllTags(['All', ...Array.from(uniqueTags)]);
        setLoading(false);
      })
      .catch((err: unknown) => {
        console.error("Failed to fetch blog posts:", err);
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
        setError(`Could not load articles: ${errorMessage}`);
        setLoading(false);
      });
  }, []);

  const filteredPosts = allPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === 'All' || post.tags.some(tag => tag.name === selectedTag);
    return matchesSearch && matchesTag;
  });

  if (loading) return <div className="text-center py-20">Loading articles...</div>;
  if (error) return <div className="text-center text-red-500 py-20">{error}</div>;

  return (
    <section id="all-blogs" className="py-20 px-6 bg-[#191a23]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            All <span className="text-green-400">Articles</span>
          </h1>
          <p className="text-lg text-gray-400">Browse the full archive of technical writeups.</p>
        </div>

        {/* --- THIS IS THE MISSING JSX FOR SEARCH AND FILTER --- */}
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
        {/* --- END OF MISSING JSX --- */}

        {/* --- THIS IS THE MISSING JSX FOR THE BLOG GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-gray-800/50 rounded-xl overflow-hidden shadow-xl border border-gray-700/50 transition-all duration-500 card-glow group"
            >
              <div className="relative overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              <div className="p-4">
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
                <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-green-400 transition-colors duration-300">{post.title}</h3>
                <p className="text-sm text-gray-400 mb-4 leading-relaxed line-clamp-3">{post.excerpt}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {post.tags.map((tag) => (
                    <span key={tag.id} className="px-2 py-1 text-xs font-medium bg-gray-700 text-gray-300 rounded-full">{tag.name}</span>
                  ))}
                </div>
                <Link to={`/blog/${post.slug}`} className="w-full bg-white text-black py-2 px-4 rounded-full font-semibold text-sm hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2">
                  <span>Read Fully</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </article>
          ))}
        </div>
        {/* --- END OF MISSING JSX --- */}

        {/* --- THIS IS THE MISSING JSX FOR THE "NO ARTICLES" MESSAGE --- */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <Filter className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-lg text-gray-400">No articles found matching your criteria.</p>
          </div>
        )}
        {/* --- END OF MISSING JSX --- */}
        
        <div className="text-center mt-12">
            <Link to="/" className="bg-white text-black px-6 py-3 rounded-full font-semibold inline-flex items-center space-x-2 hover:scale-105 transition-all duration-300">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
            </Link>
        </div>
      </div>
    </section>
  );
};

export default AllBlogsPage;