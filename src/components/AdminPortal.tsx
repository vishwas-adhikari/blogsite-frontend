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
  const [activeTab, setActiveTab] = useState<'blog' | 'ctf' | 'project'>('blog');
  const [publishing, setPublishing] = useState(false);
  
  // --- AUTH & TAGS ---
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [newTagName, setNewTagName] = useState('');

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

  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
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
    else {
      setNewTagName('');
      fetchTags();
    }
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
    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'blog_unsigned_preset'); 

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/daoqvaxeq/image/upload`, { method: 'POST', body: formData });
      const data = await res.json();
      if (target === 'blog') setBlogImageUrl(data.secure_url);
      else if (target === 'ctf') setCtfLogoUrl(data.secure_url);
      else setProjImg(data.secure_url);
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  // PUBLISH HANDLERS
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
  };

  const handlePublishProject = async () => {
    setPublishing(true);
    const { data, error } = await supabase.from('Project').insert([{
      title: projTitle, description: projDesc, image: projImg, github_link: projGithub
    }]).select();
    if (!error && selectedTagIds.length > 0) {
      await supabase.from('Project_Tag').insert(selectedTagIds.map(tId => ({ project_id: data[0].id, tag_id: tId })));
    }
    setPublishing(false);
    if (!error) window.location.reload();
  };

  const handlePublishCtf = async () => {
    setPublishing(true);
    const { error } = await supabase.from('Ctf').insert([{
      event_name: eventName, slug: ctfSlug, event_date: ctfDate, team_name: teamName, rank_score: rankScore, description: ctfDescription, logo: ctfLogoUrl, proof_link: proofLink, is_featured: isFeatured
    }]);
    setPublishing(false);
    if (!error) window.location.reload();
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f1020]">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm">
          <h2 className="text-3xl font-black mb-6 text-center italic uppercase">ADMIN_LOCK</h2>
          <input type="email" placeholder="Email" className="w-full p-4 border mb-2 rounded-xl" onChange={(e) => setLoginEmail(e.target.value)} />
          <input type="password" placeholder="Password" className="w-full p-4 border mb-4 rounded-xl" onChange={(e) => setLoginPassword(e.target.value)} />
          <button className="w-full bg-black text-white font-bold py-4 rounded-xl">AUTHENTICATE</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 text-black">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        
        {/* Navigation Bar */}
        <div className="bg-black p-6 flex justify-between items-center text-white">
          <div className="flex gap-4 overflow-x-auto">
            <button onClick={() => setActiveTab('blog')} className={`flex items-center gap-2 px-4 py-2 rounded-lg ${activeTab === 'blog' ? 'bg-white text-black' : 'text-gray-400'}`}><BookOpen size={18} /> Blog</button>
            <button onClick={() => setActiveTab('project')} className={`flex items-center gap-2 px-4 py-2 rounded-lg ${activeTab === 'project' ? 'bg-white text-black' : 'text-gray-400'}`}><Layout size={18} /> Project</button>
            <button onClick={() => setActiveTab('ctf')} className={`flex items-center gap-2 px-4 py-2 rounded-lg ${activeTab === 'ctf' ? 'bg-white text-black' : 'text-gray-400'}`}><Trophy size={18} /> CTF</button>
          </div>
          <button onClick={() => supabase.auth.signOut()} className="text-red-400 font-bold">Logout</button>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Content Areas */}
              {activeTab === 'blog' && (
                <>
                  <input placeholder="Blog Title..." className="w-full text-2xl font-bold p-4 border-b-2" onChange={(e) => setTitle(e.target.value)} />
                  <CKEditor editor={ClassicEditor} config={{ extraPlugins: [MyCustomUploadAdapterPlugin as any] }} onChange={(_, editor) => setBlogContent(editor.getData())} />
                </>
              )}
              {activeTab === 'project' && (
                <>
                  <input placeholder="Project Name..." className="w-full text-2xl font-bold p-4 border-b-2" onChange={(e) => setProjTitle(e.target.value)} />
                  <textarea placeholder="Short project description..." className="w-full p-4 border-2 rounded-xl h-32" onChange={(e) => setProjDesc(e.target.value)} />
                  <input placeholder="GitHub URL" className="w-full p-4 border-2 rounded-xl" onChange={(e) => setProjGithub(e.target.value)} />
                </>
              )}
              {activeTab === 'ctf' && (
                <>
                  <input placeholder="CTF Event Name..." className="w-full text-2xl font-bold p-4 border-b-2" onChange={(e) => setEventName(e.target.value)} />
                  <CKEditor editor={ClassicEditor} config={{ extraPlugins: [MyCustomUploadAdapterPlugin as any] }} onChange={(_, editor) => setCtfDescription(editor.getData())} />
                </>
              )}
            </div>

            {/* Sidebar Tools */}
            <div className="space-y-8 bg-gray-50 p-6 rounded-3xl border">
              
              {/* Image Upload Area */}
              <div className="space-y-3">
                <label className="text-xs font-black uppercase text-gray-400">Featured Image / Logo</label>
                <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-xl cursor-pointer bg-white overflow-hidden">
                    {(activeTab === 'blog' ? blogImageUrl : activeTab === 'project' ? projImg : ctfLogoUrl) ? 
                      <img src={(activeTab === 'blog' ? blogImageUrl : activeTab === 'project' ? projImg : ctfLogoUrl)} className="h-full w-full object-cover" /> 
                      : <Upload />}
                    <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, activeTab)} />
                </label>
              </div>

              {/* Tag Manager (For Blogs and Projects) */}
              {(activeTab === 'blog' || activeTab === 'project') && (
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase text-gray-400 flex items-center gap-2"><TagIcon size={14} /> Tag Manager</label>
                  <div className="flex gap-2">
                    <input value={newTagName} placeholder="New tag..." className="flex-grow p-2 border rounded-lg text-sm" onChange={(e) => setNewTagName(e.target.value)} />
                    <button onClick={handleAddTag} className="bg-black text-white p-2 rounded-lg"><Plus size={18}/></button>
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                    {availableTags.map(tag => (
                      <button key={tag.id} onClick={() => selectedTagIds.includes(tag.id) ? setSelectedTagIds(selectedTagIds.filter(id => id !== tag.id)) : setSelectedTagIds([...selectedTagIds, tag.id])} 
                        className={`px-3 py-1 rounded-full text-xs border ${selectedTagIds.includes(tag.id) ? 'bg-black text-white' : 'bg-white'}`}>{tag.name}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Meta Inputs for CTF */}
              {activeTab === 'ctf' && (
                <div className="space-y-4">
                  <input type="date" className="w-full p-3 border rounded-xl" onChange={(e) => setCtfDate(e.target.value)} />
                  <input placeholder="Rank (e.g. 5th/1000)" className="w-full p-3 border rounded-xl" onChange={(e) => setRankScore(e.target.value)} />
                  <input placeholder="Slug" className="w-full p-3 border rounded-xl" onChange={(e) => setCtfSlug(e.target.value)} />
                  <label className="flex items-center gap-2 font-bold text-xs"><input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} /> Featured?</label>
                </div>
              )}

              {/* Universal Metadata for Blog */}
              {activeTab === 'blog' && (
                <input placeholder="Slug" className="w-full p-3 border rounded-xl" onChange={(e) => setBlogSlug(e.target.value)} />
              )}

              <button disabled={publishing} onClick={activeTab === 'blog' ? handlePublishBlog : activeTab === 'project' ? handlePublishProject : handlePublishCtf} 
                className="w-full bg-green-500 text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-green-600 transition-all flex items-center justify-center gap-3">
                {publishing ? <Loader2 className="animate-spin" /> : "PUBLISH LIVE"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;