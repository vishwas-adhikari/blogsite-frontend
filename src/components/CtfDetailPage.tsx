import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCtfBySlug } from '../services/api';
import { ArrowLeft } from 'lucide-react';

interface Ctf {
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
        {/* --- This top part of your component is perfect, no changes needed --- */}
        <img src={ctf.logo} alt={`${ctf.event_name} logo`} className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-gray-700" />
        <h1 className="text-4xl font-bold text-center text-white mb-8">{ctf.event_name}</h1>
        <div className="prose prose-invert lg:prose-xl max-w-none text-gray-300 mb-8"
             dangerouslySetInnerHTML={{ __html: ctf.description }} />
        
        {ctf.proof_link && (
            <div className="text-center mb-12">
                <a href={ctf.proof_link} target="_blank" rel="noopener noreferrer" className="bg-purple-600 text-white font-bold py-3 px-8 rounded-full hover:bg-purple-700 transition-colors">
                    View Proof (Certificate/Scoreboard)
                </a>
            </div>
        )}
        {/* --- End of unchanged section --- */}

        {/* --- THIS IS THE NEW, CORRECTED NAVIGATION SECTION --- */}
        <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col sm:flex-row justify-center items-center gap-4">
          
          {/* Button 1: Back to Homepage */}
          <Link 
            to="/" 
            className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-black transition-colors w-full sm:w-auto text-center inline-flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Homepage
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