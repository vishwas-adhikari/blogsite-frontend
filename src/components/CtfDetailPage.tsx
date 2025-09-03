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

        <div className="text-center">
            <Link to="/ctfs" className="text-gray-400 hover:text-white inline-flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Full Log
            </Link>
        </div>
      </div>
    </section>
  );
};

export default CtfDetailPage;