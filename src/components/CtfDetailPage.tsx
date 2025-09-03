import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCtfBySlug } from '../services/api';
import { ArrowLeft } from 'lucide-react';

interface Ctf {
  // Define all fields for the detail view
  event_name: string;
  description: string;
  logo: string;
  proof_link: string;
}

const CtfDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [ctf, setCtf] = useState<Ctf | null>(null);

  useEffect(() => {
    if (slug) {
      fetchCtfBySlug(slug).then(setCtf).catch(console.error);
    }
  }, [slug]);

  if (!ctf) return <div className="text-center py-20">Loading Details...</div>;

  return (
    <section className="py-24 px-6 bg-[#191a23]">
      <div className="max-w-3xl mx-auto">
        {/* ... (Your existing logo, title, description, and proof link are all perfect) ... */}
        
        {/* --- THIS IS THE UPDATED NAVIGATION SECTION AT THE BOTTOM --- */}
        <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col sm:flex-row justify-center items-center gap-4">
          {/* Button 1: Back to Home */}
          <Link 
            to="/" 
            className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-black transition-colors w-full sm:w-auto text-center"
          >
            &larr; Back to Homepage
          </Link>
          
          {/* Button 2: View Full Log */}
          <Link 
            to="/ctfs" 
            className="bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition-colors w-full sm:w-auto text-center"
          >
            View Full Log &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CtfDetailPage;