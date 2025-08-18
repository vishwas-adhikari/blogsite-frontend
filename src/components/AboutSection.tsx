import React, { useEffect, useState } from 'react';
import { Download, Github, Linkedin, Mail, Award, Users, Calendar, Target } from 'lucide-react';
import { fetchAboutInfo } from '../services/api';

// Define the shape of the data coming from your API
interface AboutData {
  full_name: string;
  bio: string;
  profile_image: string;
  resume: string;
  experience_years: number;
  vulnerabilities_found: number;
  certifications: string;
  ctf_teams: string;
  socials: { id: number; platform_name: string; url: string }[];
}

const AboutSection: React.FC = () => {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);

  useEffect(() => {
    fetchAboutInfo()
      .then((data: AboutData) => setAboutData(data))
      .catch(console.error);
  }, []);

  // Show a loading/empty state until the data arrives
  if (!aboutData) {
    return <section id="about" className="py-16 px-6"></section>;
  }

  // Create the achievements array dynamically from the fetched data
  const achievements = [
    { icon: <Award className="w-6 h-6" />, label: "Certifications", value: aboutData.certifications },
    { icon: <Users className="w-6 h-6" />, label: "CTF Teams", value: aboutData.ctf_teams },
    { icon: <Calendar className="w-6 h-6" />, label: "Experience", value: `${aboutData.experience_years}+ Years` },
    { icon: <Target className="w-6 h-6" />, label: "CTF's Participated", value: `${aboutData.vulnerabilities_found}+ Found` }
  ];

  // Helper to find a specific social link
  const getSocialUrl = (platform: string) => {
    const social = aboutData.socials.find(s => s.platform_name.toLowerCase() === platform.toLowerCase());
    return social ? social.url : '#';
  };

  return (
    <section id="about" className="py-16 px-6 bg-[#191a23] relative overflow-hidden">
      <div className="absolute inset-0 matrix-bg opacity-5"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            About <span className="text-purple-400">Me</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content (Now powered by API data) */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                Who I Am
              </h3>
              {/* Splitting the bio text into paragraphs */}
              <div className="space-y-4 text-base text-gray-300 leading-relaxed">
                {aboutData.bio.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Achievements Grid (Now dynamic) */}
            <div className="grid grid-cols-2 gap-3">
              {achievements.map((achievement, index) => (
                <div key={index} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50 hover:bg-gray-800/70 transition-all duration-300">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="text-purple-400">{achievement.icon}</div>
                    <span className="text-xs font-medium text-gray-400">{achievement.label}</span>
                  </div>
                  <div className="text-base font-bold text-white">{achievement.value}</div>
                </div>
              ))}
            </div>

            {/* Social Links (Now dynamic) */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a 
                href={aboutData.resume} 
                download
                className="bg-white text-black px-6 py-3 rounded-full font-bold text-sm flex items-center justify-center space-x-2 shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <Download className="w-4 h-4" />
                <span>Download CV</span>
              </a>
              
              <div className="flex gap-3">
                <a href={getSocialUrl('github')} target="_blank" rel="noopener noreferrer" className="bg-gray-800 text-white p-3 rounded-full hover:bg-white hover:text-black transition-all duration-300 border border-gray-700 hover:shadow-2xl">
                  <Github className="w-5 h-5" />
                </a>
                <a href={getSocialUrl('linkedin')} target="_blank" rel="noopener noreferrer" className="bg-gray-800 text-white p-3 rounded-full hover:bg-white hover:text-black transition-all duration-300 border border-gray-700 hover:shadow-2xl">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href={getSocialUrl('email')} className="bg-gray-800 text-white p-3 rounded-full hover:bg-white hover:text-black transition-all duration-300 border border-gray-700 hover:shadow-2xl">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Side - Profile Image (Now dynamic) */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden border-4 border-white/10 shadow-2xl glow-purple">
                <img
                  src={aboutData.profile_image}
                  alt={aboutData.full_name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-3 -right-3 bg-green-400 text-black p-2 rounded-full shadow-2xl">
                <Award className="w-5 h-5" />
              </div>
              <div className="absolute -bottom-3 -left-3 bg-blue-400 text-black p-2 rounded-full shadow-2xl">
                <Target className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;