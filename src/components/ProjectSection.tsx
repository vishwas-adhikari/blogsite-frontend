import React, { useEffect, useState } from 'react';
import { Github } from 'lucide-react'; // Removed unused icons
import { fetchProjects } from '../services/api'; // Import the specific fetch function for projects

// The interface is updated to match the data coming from your Django Project model
interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: { id: number; name: string }[]; // In Django, these are your 'tags'
  github_link: string; // The field name in your Django model
}

const ProjectSection: React.FC = () => {
  // --- STATE MANAGEMENT ---
  // State to hold the project list from the backend
  const [projects, setProjects] = useState<Project[]>([]);
  // State for loading and error handling
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // --- DATA FETCHING ---
  // This useEffect hook runs once when the component loads
  useEffect(() => {
    fetchProjects()
      // We tell TypeScript that 'data' will be an array of Project objects
      .then((data: Project[]) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        console.error("Failed to fetch projects:", err);
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
        setError(`Could not load projects: ${errorMessage}`);
        setLoading(false);
      });
  }, []); // The empty array ensures this runs only once on mount

  // --- RENDER LOGIC ---
  if (loading) {
    return <div className="text-center py-20">Loading projects...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-20">{error}</div>;
  }

  return (
    <section id="projects" className="py-16 px-6 bg-gradient-to-b from-[#191a23] to-[#1a1b25] relative">
      <div className="max-w-7xl mx-auto">
        {/* Your existing Section Header - no changes needed */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Featured <span className="text-blue-400">Projects</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Open-source security tools, CTF platforms, and innovative solutions built with cutting-edge technology.
          </p>
        </div>

        {/* Your existing Projects Grid, now populated with live data from Django */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-gray-800/30 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl border border-gray-700/50 transition-all duration-500 card-glow group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={project.image} // field name is the same
                  alt={project.title}
                  className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                {/* Note: The "category" field is part of the tags in your Django model */}
                {/* You could feature the first tag here if you like */}
                <div className="absolute top-3 right-3">
                  {project.tags.length > 0 && (
                    <span className="bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
                      {project.tags[0].name}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-blue-400 transition-colors duration-300">
                  {project.title}
                </h3>

                <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {/* Mapping over the 'tags' array from the backend */}
                  {project.tags.map((tag) => (
                    <span
                      key={tag.id} // Use the tag's unique ID as the key
                      className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 rounded-full border border-blue-500/30"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>

                <a
                  href={project.github_link} // Using the 'github_link' field from the backend
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-white text-black py-2 px-3 rounded-full font-semibold text-sm flex items-center justify-center space-x-1"
                >
                  <Github className="w-3 h-3" />
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectSection;