import React, { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { supabase } from '../services/supabase';
import { MyCustomUploadAdapterPlugin } from '../utils/cloudinaryAdapter';
import { Upload, CheckCircle, Tag as TagIcon, LogOut, Loader2, Trophy, BookOpen, Layout, Plus } from 'lucide-react';

interface Tag {
  id: number;
  name: string;
}

const AdminPortal: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'blog' | 'ctf' | 'project'>('blog');
  const [publishing, setPublishing] = useState(false);
  
  // Auth State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Common State
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // --- BLOG STATE ---
  const [title, setTitle] = useState('');
  const [blogSlug, setBlogSlug] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [readTime, setReadTime] = useState(5);
  const [blogImageUrl, setBlogImageUrl] = useState('');

  // --- CTF STATE ---
  const [eventName, setEventName] = useState('');
  const [ctfSlug, setCtfSlug] = useState('');
  const [ctfDate, setCtfDate] = useState('');
  const [teamName, setTeamName] = useState('');
  const [rankScore, setRankScore] = useState('');
  const [ctfDescription, setCtfDescription] = useState('');
  const [ctfLogoUrl, setCtfLogoUrl] = useState('');
  const [proofLink, setProofLink] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  // --- PROJECT STATE ---
  const [projTitle, setProjTitle] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projImg, setProjImg] = useState('');
  const [projGithub, setProjGithub] = useState('');
  const [isProjFeatured, setIsProjFeatured] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });
    fetchTags();
  }, []);

  const fetchTags = async () => {
    const { data } = await supabase.from('Tag').select('*').order('name');
    if (data) setAvailableTags(data);
  };

  const handleAddTag = async () => {
    if (!newTagName) return;
    const { error } = await supabase.from('Tag').insert([{ name: newTagName.toLowerCase() }]);
    if (error) alert(error.message);
    else { setNewTagName(''); fetchTags(); }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword });
    if (error) alert(error.message);
    else setUser(data.user);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'blog' | 'ctf' | 'project') => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Set folder mapping for organization
    const folderMapping = {
        blog: 'blog_images',
        ctf: 'ctf_logos',
        project: 'project_images'
    };

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'blog_unsigned_preset'); 
    
    // Use dynamic date pathing logic if your adapter supports it, or simple folders
    formData.append('folder', folderMapping[target]);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/daoqvaxeq/image/upload`, { method: 'POST', body: formData });
      const data = await res.json();
      if (target === 'blog') setBlogImageUrl(data.secure_url);
      else if (target === 'ctf') setCtfLogoUrl(data.secure_url);
      else setProjImg(data.secure_url);
    } catch (err) { alert("Upload failed"); } finally { setUploadingImage(false); }
  };

  const handlePublishBlog = async () => {
    setPublishing(true);
    const { data, error } = await supabase.from('BlogPost').insert([{
      title, slug: blogSlug, content: blogContent, read_time: readTime, image: blogImageUrl, publication_date: new Date().toISOString()
    }]).select();
    if (!error && selectedTagIds.length > 0) {
      await supabase.from('BlogPost_Tag').insert(selectedTagIds.map(tId => ({ blogpost_id: data[0].id, tag_id: tId })));
    }
    setPublishing(false);
    if (!error) window.location.reload();
    else alert(error.message);
  };

  const handlePublishProject = async () => {
    setPublishing(true);
    const { data, error } = await supabase.from('Project').insert([{
      title: projTitle, 
      description: projDesc, 
      image: projImg, 
      github_link: projGithub, 
      is_featured: isProjFeatured,
      created_at: new Date().toISOString() // Ensures correct sorting on homepage
    }]).select();
    if (!error && selectedTagIds.length > 0) {
      await supabase.from('Project_Tag').insert(selectedTagIds.map(tId => ({ project_id: data[0].id, tag_id: tId })));
    }
    setPublishing(false);
    if (!error) window.location.reload();
    else alert(error.message);
  };

  const handlePublishCtf = async () => {
    setPublishing(true);
    const { error } = await supabase.from('Ctf').insert([{
      event_name: eventName, slug: ctfSlug, event_date: ctfDate, team_name: teamName, rank_score: rankScore, description: ctfDescription, logo: ctfLogoUrl, proof_link: proofLink, is_featured: isFeatured
    }]);
    setPublishing(false);
    if (!error) window.location.reload();
    else alert(error.message);
  };

  if (authLoading) return <div className="min-h-screen bg-[#121212] flex items-center justify-center text-gray-400 font-mono tracking-tighter">LOADING...</div>;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212] p-4">
        <form onSubmit={handleLogin} className="bg-[#1e1e1e] p-10 rounded-3xl shadow-2xl w-full max-w-sm border border-gray-800">
          <h2 className="text-3xl font-black mb-8 text-gray-200 text-center italic tracking-tighter">RESTRICTED AREA</h2>
          <div className="space-y-4">
            <input type="email" placeholder="Email" className="w-full p-4 bg-[#2a2a2a] border border-gray-700 rounded-xl text-white outline-none focus:border-green-500 transition-all placeholder-gray-500" onChange={(e) => setLoginEmail(e.target.value)} />
            <input type="password" placeholder="Password" className="w-full p-4 bg-[#2a2a2a] border border-gray-700 rounded-xl text-white outline-none focus:border-green-500 transition-all placeholder-gray-500" onChange={(e) => setLoginPassword(e.target.value)} />
            <button className="w-full bg-green-600 text-white font-black py-4 rounded-xl hover:bg-green-500 transition-all shadow-lg">AUTHENTICATE</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    // Background updated to soft dark grey (#121212)
    <div className="min-h-screen bg-[#121212] pt-32 pb-20 p-4 md:p-8 text-gray-200">
      <div className="max-w-6xl mx-auto bg-[#1e1e1e] rounded-3xl shadow-2xl overflow-hidden border border-gray-800">
        
        {/* Navigation Bar */}
        <div className="bg-black p-6 flex justify-between items-center border-b border-gray-800">
          <div className="flex gap-4 overflow-x-auto">
            <button onClick={() => {setActiveTab('blog'); setSelectedTagIds([])}} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'blog' ? 'bg-white text-black' : 'text-gray-500 hover:text-white hover:bg-gray-900'}`}><BookOpen size={18} /> BLOG</button>
            <button onClick={() => {setActiveTab('project'); setSelectedTagIds([])}} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'project' ? 'bg-white text-black' : 'text-gray-500 hover:text-white hover:bg-gray-900'}`}><Layout size={18} /> PROJECT</button>
            <button onClick={() => setActiveTab('ctf')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'ctf' ? 'bg-white text-black' : 'text-gray-500 hover:text-white hover:bg-gray-900'}`}><Trophy size={18} /> CTF</button>
          </div>
          <button onClick={() => supabase.auth.signOut()} className="text-red-500 font-bold hover:text-red-400 transition-colors flex items-center gap-2"><LogOut size={18} /> LOGOUT</button>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* LEFT COLUMN: Main Editors */}
            <div className="lg:col-span-2 space-y-6">
              {activeTab === 'blog' && (
                <>
                  <input placeholder="Enter Blog Title..." className="w-full text-3xl font-black p-4 bg-transparent border-b-2 border-gray-700 outline-none focus:border-green-500 transition-all text-white placeholder-gray-600" onChange={(e) => setTitle(e.target.value)} />
                  <div className="rounded-xl overflow-hidden text-black bg-white border border-gray-700">
                    <CKEditor editor={ClassicEditor} config={{ extraPlugins: [MyCustomUploadAdapterPlugin as any] }} onChange={(_, editor) => setBlogContent(editor.getData())} />
                  </div>
                </>
              )}
              {activeTab === 'project' && (
                <>
                  <input placeholder="Project Name..." className="w-full text-3xl font-black p-4 bg-transparent border-b-2 border-gray-700 outline-none focus:border-blue-500 transition-all text-white placeholder-gray-600" onChange={(e) => setProjTitle(e.target.value)} />
                  <textarea placeholder="Describe the project mission..." className="w-full p-4 bg-[#2a2a2a] border border-gray-700 rounded-2xl h-40 text-white outline-none focus:border-blue-500 placeholder-gray-500" onChange={(e) => setProjDesc(e.target.value)} />
                  <input placeholder="GitHub Repository URL" className="w-full p-4 bg-[#2a2a2a] border border-gray-700 rounded-2xl text-white outline-none focus:border-blue-500 placeholder-gray-500" onChange={(e) => setProjGithub(e.target.value)} />
                </>
              )}
              {activeTab === 'ctf' && (
                <>
                  <input placeholder="CTF Event Name..." className="w-full text-3xl font-black p-4 bg-transparent border-b-2 border-gray-700 outline-none focus:border-purple-500 transition-all text-white placeholder-gray-600" onChange={(e) => setEventName(e.target.value)} />
                  <div className="rounded-xl overflow-hidden text-black bg-white border border-gray-700">
                    <CKEditor editor={ClassicEditor} config={{ extraPlugins: [MyCustomUploadAdapterPlugin as any] }} onChange={(_, editor) => setCtfDescription(editor.getData())} />
                  </div>
                </>
              )}
            </div>

            {/* RIGHT COLUMN: Sidebar Settings */}
            <div className="space-y-8 bg-[#252525] p-6 rounded-[2rem] border border-gray-700 shadow-xl">
              
              {/* Image Upload */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] flex items-center gap-2">Visual Asset</label>
                <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-600 rounded-2xl cursor-pointer bg-[#2a2a2a] hover:border-green-500 transition-all overflow-hidden group">
                    {(activeTab === 'blog' ? blogImageUrl : activeTab === 'project' ? projImg : ctfLogoUrl) ? 
                      <img src={(activeTab === 'blog' ? blogImageUrl : activeTab === 'project' ? projImg : ctfLogoUrl)} className="h-full w-full object-cover group-hover:opacity-80 transition-opacity" /> 
                      : <div className="text-center text-gray-500 group-hover:text-green-400 transition-colors"><Upload className="mx-auto mb-2" /> <span className="text-xs font-bold">{uploadingImage ? "SYNCING..." : "UPLOAD"}</span></div>}
                    <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, activeTab)} />
                </label>
              </div>

              {/* Tags (Blog/Project) */}
              {(activeTab === 'blog' || activeTab === 'project') && (
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] flex items-center gap-2"><TagIcon size={12} /> Metadata Tags</label>
                  <div className="flex gap-2">
                    <input value={newTagName} placeholder="Create tag..." className="flex-grow p-3 bg-[#2a2a2a] border border-gray-600 rounded-xl text-sm text-white outline-none focus:border-green-500" onChange={(e) => setNewTagName(e.target.value)} />
                    <button onClick={handleAddTag} className="bg-white text-black p-3 rounded-xl hover:bg-green-500 transition-colors"><Plus size={18}/></button>
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {availableTags.map(tag => (
                      <button key={tag.id} onClick={() => selectedTagIds.includes(tag.id) ? setSelectedTagIds(selectedTagIds.filter(id => id !== tag.id)) : setSelectedTagIds([...selectedTagIds, tag.id])} 
                        className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all border ${selectedTagIds.includes(tag.id) ? 'bg-green-500 text-black border-green-500' : 'bg-transparent text-gray-400 border-gray-600 hover:border-white'}`}>{tag.name}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Deployment Options */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Deploy Options</label>
                
                {activeTab === 'blog' && (
                    <div className="space-y-1">
                      <span className="text-xs text-gray-400 font-bold">Read Time (min)</span>
                      <input type="number" value={readTime} className="w-full p-3 bg-[#2a2a2a] border border-gray-600 rounded-xl text-white outline-none focus:border-green-500" onChange={(e) => setReadTime(parseInt(e.target.value) || 0)} />
                    </div>
                )} 

                {activeTab === 'ctf' && (
                  <>
                    <input type="date" className="w-full p-3 bg-[#2a2a2a] border border-gray-600 rounded-xl text-white outline-none focus:border-purple-500" onChange={(e) => setCtfDate(e.target.value)} />
                    <input placeholder="Rank (e.g. Top 10%)" className="w-full p-3 bg-[#2a2a2a] border border-gray-600 rounded-xl text-white outline-none focus:border-purple-500" onChange={(e) => setRankScore(e.target.value)} />
                    <label className="flex items-center gap-2 font-bold text-xs text-gray-300 hover:text-white cursor-pointer"><input type="checkbox" className="accent-purple-500 h-4 w-4 rounded" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} /> FEATURE ON HOMEPAGE</label>
                  </>
                )}
                
                {activeTab === 'project' && (
                  <label className="flex items-center gap-2 font-bold text-xs text-gray-300 hover:text-white cursor-pointer"><input type="checkbox" className="accent-blue-500 h-4 w-4 rounded" checked={isProjFeatured} onChange={(e) => setIsProjFeatured(e.target.checked)} /> FEATURE ON HOMEPAGE</label>
                )}
                
                <input placeholder="URL Slug" className="w-full p-3 bg-[#2a2a2a] border border-gray-600 rounded-xl text-white outline-none focus:border-white" onChange={(e) => {
                  if (activeTab === 'blog') setBlogSlug(e.target.value);
                  else if (activeTab === 'ctf') setCtfSlug(e.target.value);
                }} />
              </div>

              {/* Publish Button */}
              <button disabled={publishing} onClick={activeTab === 'blog' ? handlePublishBlog : activeTab === 'project' ? handlePublishProject : handlePublishCtf} 
                className={`w-full text-white py-5 rounded-2xl font-black text-lg shadow-lg transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                    activeTab === 'blog' ? 'bg-green-600 hover:bg-green-500 shadow-green-900/20' : 
                    activeTab === 'project' ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20' : 
                    'bg-purple-600 hover:bg-purple-500 shadow-purple-900/20'
                }`}>
                {publishing ? <Loader2 className="animate-spin" /> : "PUBLISH TO LIVE"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;