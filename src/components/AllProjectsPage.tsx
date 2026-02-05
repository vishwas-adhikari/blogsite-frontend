import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Github, Search, ArrowLeft } from 'lucide-react';
import { fetchProjects } from '../services/api';
// --- 1. IMPORT THE HELPER ---
import { getImageUrl } from '../utils/imageUrl'; 

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
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects().then((data: Project[]) => {
      setAllProjects(data);
      setLoading(false);
    }).catch(console.error);
  }, []);

  const filteredProjects = allProjects.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center py-20 text-white font-mono">Loading archive...</div>;

  return (
    <section className="py-20 px-6 bg-[#191a23]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-12">All Projects</h1>
        
        <div className="relative w-full md:w-80 mx-auto mb-12">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-full border border-gray-700 outline-none focus:border-blue-400 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-gray-800/30 rounded-xl overflow-hidden border border-gray-700/50 flex flex-col">
              <img 
                // --- 2. APPLY THE IMAGE FIX HERE ---
                src={getImageUrl(project.image)} 
                alt={project.title} 
                className="w-full h-48 object-cover" 
              />
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                <p className="text-gray-400 text-sm mb-4 flex-grow">{project.description}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.tags.map((tag) => (
                    <span key={tag.id} className="px-2 py-0.5 text-[10px] font-medium bg-blue-500/10 text-blue-300 rounded-full border border-blue-500/20">
                      {tag.name}
                    </span>
                  ))}
                </div>
                <a 
                  href={project.github_link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center text-blue-400 hover:text-white transition-colors mt-auto font-semibold"
                >
                  <Github className="w-4 h-4 mr-2" /> View Code
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
            <Link to="/" className="bg-white text-black px-6 py-3 rounded-full font-semibold inline-flex items-center gap-2 hover:scale-105 transition-transform duration-300">
                <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
        </div>
      </div>
    </section>
  );
};

export default AllProjectsPage;