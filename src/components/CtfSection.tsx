import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCtfs } from '../services/api';
// --- IMPORT THE HELPER ---
import { getImageUrl } from '../utils/imageUrl'; 

interface Ctf {
  id: number;
  slug: string;
  event_name: string;
  rank_score: string;
  logo: string;
  is_featured: boolean;
}

const CtfSection: React.FC = () => {
  const [featuredCtfs, setFeaturedCtfs] = useState<Ctf[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCtfs()
      .then((data: Ctf[]) => {
        setFeaturedCtfs(data.filter(ctf => ctf.is_featured));
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  if (loading || featuredCtfs.length === 0) {
    return null; 
  }
  
  return (
    <section id="ctfs" className="py-16 px-6 bg-[#191a23]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            CTF <span className="text-purple-400">Cabinet</span>
          </h2>
          <p className="text-lg text-gray-400">A log of featured competitions and achievements.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredCtfs.map((ctf) => (
            <Link 
              to={`/ctf/${ctf.slug}`} 
              key={ctf.id} 
              className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 text-center transition-all duration-300 card-glow group hover:border-purple-400/50"
            >
              <img 
                // --- APPLY THE FIX HERE ---
                src={getImageUrl(ctf.logo)} 
                alt={`${ctf.event_name} logo`} 
                className="w-24 h-24 rounded-full mx-auto mb-5 border-4 border-gray-700/50 transition-transform duration-300 group-hover:scale-110" 
              />
              <h3 className="font-bold text-white text-xl mb-2 group-hover:text-purple-400 transition-colors">{ctf.event_name}</h3>
              <p className="font-semibold text-purple-400 text-base">{ctf.rank_score}</p>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/ctfs" className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-black transition-colors">
            View Full Log
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CtfSection;