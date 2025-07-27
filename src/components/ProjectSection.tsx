import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Used for internal navigation
import { Github } from 'lucide-react'; // GitHub icon component
import { fetchProjects } from '../services/api'; // API call to fetch project data

// Define the shape of a project object
interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: { id: number; name: string }[];
  github_link: string;
}

const ProjectSection: React.FC = () => {
  // State to hold fetched projects
  const [projects, setProjects] = useState<Project[]>([]);
  // State to indicate loading status
  const [loading, setLoading] = useState(true);
  // State to capture any error during fetch
  const [error, setError] = useState('');

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects()
      .then((data: Project[]) => {
        // Only display first 6 projects for homepage preview
        setProjects(data.slice(0, 3)); // <-- LIMIT TO 3 FOR HOMEPAGE
        // Set loading to false after data is fetched
        setLoading(false);
      })
      .catch((err: unknown) => {
        console.error("Failed to fetch projects:", err);
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
        setError(`Could not load projects: ${errorMessage}`);
        setLoading(false);
      });
  }, []);

  // Loading and error states
  if (loading) return <div className="text-center py-20">Loading projects...</div>;
  if (error) return <div className="text-center text-red-500 py-20">{error}</div>;

  return (
    <section id="projects" className="py-16 px-6 bg-gradient-to-b from-[#191a23] to-[#1a1b25] relative">
      <div className="max-w-7xl mx-auto">

        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Featured <span className="text-blue-400">Projects</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Open-source security tools, CTF platforms, and innovative solutions built with cutting-edge technology.
          </p>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-gray-800/30 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl border border-gray-700/50 transition-all duration-500 card-glow group"
            >
              {/* Project Image Section */}
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Dark overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                {/* Display first tag on top-right */}
                <div className="absolute top-3 right-3">
                  {project.tags.length > 0 && (
                    <span className="bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
                      {project.tags[0].name}
                    </span>
                  )}
                </div>
              </div>

              {/* Project Info Section */}
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-blue-400 transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-400 mb-4 leading-relaxed flex-grow">
                  {project.description}
                </p>

                {/* Display all tags */}
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

                {/* GitHub Button */}
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

        {/* View All Projects Button */}
        <div className="text-center mt-12">
          <Link 
            to="/projects" 
            className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-black transition-colors"
          >
            Explore All Projects
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProjectSection;
