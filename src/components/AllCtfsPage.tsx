import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCtfs } from '../services/api';
import { ArrowLeft } from 'lucide-react';

interface Ctf {
  id: number;
  slug: string;
  event_name: string;
  event_date: string;
  team_name: string;
  rank_score: string;
  proof_link: string;
}

const AllCtfsPage: React.FC = () => {
  const [allCtfs, setAllCtfs] = useState<Ctf[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCtfs()
      .then((data: Ctf[]) => {
        setAllCtfs(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  if (loading) return <div className="text-center py-20">Loading CTF Log...</div>;

  return (
    <section className="py-24 px-6 bg-[#191a23]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Competition & Challenge Log
          </h1>
          <p className="text-lg text-gray-400">A complete log of all CTF events and challenges I've participated in.</p>
        </div>

        <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-900/50 text-xs text-gray-400 uppercase tracking-wider">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Event Name</th>
                <th className="p-4">Team Name</th>
                <th className="p-4">Rank / Score</th>
                <th className="p-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {allCtfs.map(ctf => (
                <tr key={ctf.id} className="hover:bg-gray-800/70">
                  <td className="p-4 font-medium whitespace-nowrap">{new Date(ctf.event_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</td>
                  <td className="p-4 font-bold text-white">{ctf.event_name}</td>
                  <td className="p-4 text-gray-300">{ctf.team_name || 'N/A (Individual)'}</td>
                  <td className="p-4 text-gray-300">{ctf.rank_score}</td>
                  <td className="p-4">
                    <Link to={`/ctf/${ctf.slug}`} className="font-semibold text-purple-400 hover:underline">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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

export default AllCtfsPage;