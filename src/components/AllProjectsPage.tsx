import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Github, Search, Filter, ArrowLeft } from 'lucide-react';
import { fetchProjects } from '../services/api';

// This interface matches your Django Project model
interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: { id: number; name: string }[];
  github_link: string;
}

const AllProjectsPage: React.FC = () => {
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [allTags, setAllTags] = useState<string[]>(['All']);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch ALL projects, with no .slice() limit
    fetchProjects()
      .then((data: Project[]) => {
        setAllProjects(data);
        // Dynamically create the list of unique tags from the fetched projects
        const uniqueTags = new Set(data.flatMap((project) => project.tags.map(tag => tag.name)));
        setAllTags(['All', ...Array.from(uniqueTags)]);
        setLoading(false);
      })
      .catch((err: unknown) => {
        console.error("Failed to fetch projects:", err);
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
        setError(`Could not load projects: ${errorMessage}`);
        setLoading(false);
      });
  }, []);

  // Filter logic for projects based on search and selected tag
  const filteredProjects = allProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === 'All' || project.tags.some(tag => tag.name === selectedTag);
    return matchesSearch && matchesTag;
  });

  if (loading) return <div className="text-center py-20">Loading projects...</div>;
  if (error) return <div className="text-center text-red-500 py-20">{error}</div>;

  return (
    <section id="all-projects" className="py-20 px-6 bg-[#191a23]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            All <span className="text-blue-400">Projects</span>
          </h1>
          <p className="text-lg text-gray-400">A collection of my open-source tools and applications.</p>
        </div>

        {/* Search and Filter Bar (reused from blogs page) */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-full border border-gray-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all duration-300"
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

        {/* Projects Grid (using your original ProjectSection card design) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-gray-800/30 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl border border-gray-700/50 transition-all duration-500 card-glow group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-blue-400 transition-colors duration-300">{project.title}</h3>
                <p className="text-sm text-gray-400 mb-4 leading-relaxed flex-grow">{project.description}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 rounded-full border border-blue-500/30"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
                <a
                  href={project.github_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-auto bg-white text-black py-2 px-3 rounded-full font-semibold text-sm flex items-center justify-center space-x-1"
                >
                  <Github className="w-3 h-3" />
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* "No projects found" message */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <Filter className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-lg text-gray-400">No projects found matching your criteria.</p>
          </div>
        )}
        
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

export default AllProjectsPage;