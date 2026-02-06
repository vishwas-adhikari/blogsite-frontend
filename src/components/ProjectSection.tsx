import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Github } from 'lucide-react';
import { fetchProjects } from '../services/api';
import { getImageUrl } from '../utils/imageUrl'; 

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: { id: number; name: string }[];
  github_link: string;
  is_featured: boolean; // Add this to the interface
}

const ProjectSection: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects()
      .then((data: Project[]) => {
        // --- THIS IS THE CRITICAL FIX ---
        // We filter for only featured projects, then take the top 6 (or whatever fits your grid)
        const featured = data.filter(p => p.is_featured === true);
        setProjects(featured.slice(0, 6)); 
        setLoading(false);
      })
      .catch((err: unknown) => {
        console.error("Failed to fetch projects:", err);
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
        setError(`Could not load projects: ${errorMessage}`);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-20 text-gray-500 font-mono">ACCESSING_REPOS...</div>;
  if (error) return <div className="text-center text-red-500 py-20">{error}</div>;

  return (
    <section id="projects" className="py-16 px-6 bg-gradient-to-b from-[#191a23] to-[#1a1b25] relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Featured <span className="text-blue-400">Projects</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Open-source security tools and technical implementations from the research lab.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-gray-800/30 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl border border-gray-700/50 transition-all duration-500 card-glow group flex flex-col"
            >
              <div className="relative overflow-hidden">
                <img
                  src={getImageUrl(project.image)}
                  alt={project.title}
                  className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>

              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-blue-400 transition-colors duration-300">
                  {project.title}
                </h3>

                <p className="text-sm text-gray-400 mb-4 leading-relaxed flex-grow">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-2 py-1 text-[10px] font-bold bg-blue-500/10 text-blue-300 rounded-full border border-blue-500/20 uppercase tracking-tighter"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>

                <a
                  href={project.github_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-auto bg-white text-black py-2.5 px-3 rounded-full font-bold text-sm flex items-center justify-center space-x-2 hover:bg-gray-200 transition-all"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link 
            to="/projects" 
            className="bg-transparent border-2 border-white text-white font-bold py-3 px-10 rounded-full hover:bg-white hover:text-black transition-all active:scale-95"
          >
            Explore All Projects
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProjectSection;