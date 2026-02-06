import React, { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { supabase } from '../services/supabase';
import { MyCustomUploadAdapterPlugin } from '../utils/cloudinaryAdapter';
import { Upload, Tag as TagIcon, LogOut, Loader2, Trophy, BookOpen, Layout, Plus, Edit3, XCircle, RotateCcw } from 'lucide-react';
import { getDatePath } from '../utils/imageUrl';

interface Tag {
  id: number;
  name: string;
}

interface ListItem {
  id: number;
  title?: string;       // For Blogs/Projects
  event_name?: string;  // For CTFs
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

  // --- EDITING STATE ---
  const [editingId, setEditingId] = useState<number | null>(null);
  const [existingItems, setExistingItems] = useState<ListItem[]>([]);

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
    fetchExistingItems();
  }, [activeTab]); // Refetch list when tab changes

  const fetchTags = async () => {
    const { data } = await supabase.from('Tag').select('*').order('name');
    if (data) setAvailableTags(data);
  };

  // --- FETCH ITEMS FOR DROPDOWN ---
  const fetchExistingItems = async () => {
    let table = 'BlogPost';
    let select = 'id, title';
    let order = 'publication_date';

    if (activeTab === 'project') { table = 'Project'; select = 'id, title'; order = 'created_at'; }
    if (activeTab === 'ctf') { table = 'Ctf'; select = 'id, event_name'; order = 'event_date'; }

    const { data } = await supabase.from(table).select(select).order(order, { ascending: false });
    if (data) setExistingItems(data);
  };

  // --- LOAD DATA FOR EDITING ---
  const handleSelectForEdit = async (id: number) => {
    if (!id) { resetForm(); return; }
    setEditingId(id);
    
    if (activeTab === 'blog') {
        const { data } = await supabase.from('BlogPost').select(`*, tags:BlogPost_Tag(tag_id)`).eq('id', id).single();
        if (data) {
            setTitle(data.title);
            setBlogSlug(data.slug);
            setBlogContent(data.content);
            setReadTime(data.read_time);
            setBlogImageUrl(data.image);
            setSelectedTagIds(data.tags ? data.tags.map((t: any) => t.tag_id) : []);
        }
    } else if (activeTab === 'project') {
        const { data } = await supabase.from('Project').select(`*, tags:Project_Tag(tag_id)`).eq('id', id).single();
        if (data) {
            setProjTitle(data.title);
            setProjDesc(data.description);
            setProjImg(data.image);
            setProjGithub(data.github_link);
            setIsProjFeatured(data.is_featured);
            setSelectedTagIds(data.tags ? data.tags.map((t: any) => t.tag_id) : []);
        }
    } else if (activeTab === 'ctf') {
        const { data } = await supabase.from('Ctf').select('*').eq('id', id).single();
        if (data) {
            setEventName(data.event_name);
            setCtfSlug(data.slug);
            setCtfDate(data.event_date);
            setTeamName(data.team_name);
            setRankScore(data.rank_score);
            setCtfDescription(data.description);
            setCtfLogoUrl(data.logo);
            setProofLink(data.proof_link);
            setIsFeatured(data.is_featured);
        }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle(''); setBlogSlug(''); setBlogContent(''); setReadTime(5); setBlogImageUrl('');
    setProjTitle(''); setProjDesc(''); setProjImg(''); setProjGithub(''); setIsProjFeatured(false);
    setEventName(''); setCtfSlug(''); setCtfDate(''); setTeamName(''); setRankScore(''); setCtfDescription(''); setCtfLogoUrl(''); setProofLink(''); setIsFeatured(false);
    setSelectedTagIds([]);
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
    
    const folderMapping = { blog: 'blog_images', ctf: 'ctf_logos', project: 'project_images' };
    setUploadingImage(true);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'blog_unsigned_preset'); 
    
    // Dynamic date pathing logic
    const targetFolder = folderMapping[target];
    formData.append('folder', getDatePath(targetFolder)); 

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/daoqvaxeq/image/upload`, { method: 'POST', body: formData });
      const data = await res.json();
      if (target === 'blog') setBlogImageUrl(data.secure_url);
      else if (target === 'ctf') setCtfLogoUrl(data.secure_url);
      else setProjImg(data.secure_url);
    } catch (err) { alert("Upload failed"); } finally { setUploadingImage(false); }
  };

  // --- UNIVERSAL PUBLISH/UPDATE HANDLER ---
  const handlePublish = async () => {
    setPublishing(true);
    let error;
    let newId = editingId;

    // 1. BLOG LOGIC
    if (activeTab === 'blog') {
        const payload = { title, slug: blogSlug, content: blogContent, read_time: readTime, image: blogImageUrl, publication_date: new Date().toISOString() };
        
        if (editingId) {
            const { error: err } = await supabase.from('BlogPost').update(payload).eq('id', editingId);
            error = err;
        } else {
            const { data, error: err } = await supabase.from('BlogPost').insert([payload]).select();
            error = err;
            if (data) newId = data[0].id;
        }
        
        // Handle Tags (Delete old connections, insert new ones)
        if (!error && newId) {
            await supabase.from('BlogPost_Tag').delete().eq('blogpost_id', newId);
            if (selectedTagIds.length > 0) {
                await supabase.from('BlogPost_Tag').insert(selectedTagIds.map(tId => ({ blogpost_id: newId, tag_id: tId })));
            }
        }
    }

    // 2. PROJECT LOGIC
    else if (activeTab === 'project') {
        const payload = { title: projTitle, description: projDesc, image: projImg, github_link: projGithub, is_featured: isProjFeatured, created_at: new Date().toISOString() };
        
        if (editingId) {
            const { error: err } = await supabase.from('Project').update(payload).eq('id', editingId);
            error = err;
        } else {
            const { data, error: err } = await supabase.from('Project').insert([payload]).select();
            error = err;
            if (data) newId = data[0].id;
        }

        if (!error && newId) {
            await supabase.from('Project_Tag').delete().eq('project_id', newId);
            if (selectedTagIds.length > 0) {
                await supabase.from('Project_Tag').insert(selectedTagIds.map(tId => ({ project_id: newId, tag_id: tId })));
            }
        }
    }

    // 3. CTF LOGIC
    else if (activeTab === 'ctf') {
        const payload = { event_name: eventName, slug: ctfSlug, event_date: ctfDate, team_name: teamName, rank_score: rankScore, description: ctfDescription, logo: ctfLogoUrl, proof_link: proofLink, is_featured: isFeatured };
        
        if (editingId) {
            const { error: err } = await supabase.from('Ctf').update(payload).eq('id', editingId);
            error = err;
        } else {
            const { error: err } = await supabase.from('Ctf').insert([payload]);
            error = err;
        }
    }

    setPublishing(false);
    if (!error) {
        alert(editingId ? "Update Successful! 📝" : "Published Live! 🚀");
        window.location.reload();
    } else {
        alert("Error: " + error.message);
    }
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
    <div className="min-h-screen bg-[#121212] pt-32 pb-20 p-4 md:p-8 text-gray-200">
      <div className="max-w-6xl mx-auto bg-[#1e1e1e] rounded-3xl shadow-2xl overflow-hidden border border-gray-800">
        
        {/* Navigation Bar */}
        <div className="bg-black p-6 flex justify-between items-center border-b border-gray-800">
          <div className="flex gap-4 overflow-x-auto">
            <button onClick={() => {setActiveTab('blog'); resetForm();}} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'blog' ? 'bg-white text-black' : 'text-gray-500 hover:text-white hover:bg-gray-900'}`}><BookOpen size={18} /> BLOG</button>
            <button onClick={() => {setActiveTab('project'); resetForm();}} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'project' ? 'bg-white text-black' : 'text-gray-500 hover:text-white hover:bg-gray-900'}`}><Layout size={18} /> PROJECT</button>
            <button onClick={() => {setActiveTab('ctf'); resetForm();}} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'ctf' ? 'bg-white text-black' : 'text-gray-500 hover:text-white hover:bg-gray-900'}`}><Trophy size={18} /> CTF</button>
          </div>
          <button onClick={() => supabase.auth.signOut()} className="text-red-500 font-bold hover:text-red-400 transition-colors flex items-center gap-2"><LogOut size={18} /> LOGOUT</button>
        </div>

        <div className="p-8">
          {/* --- NEW: EDIT SELECTION DROPDOWN (DARK MODE) --- */}
          <div className="mb-8 p-4 bg-[#121212] rounded-2xl border border-gray-800 flex items-center gap-4">
             <div className="flex-grow">
                 <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">
                    {editingId ? `EDITING: ${activeTab.toUpperCase()}` : `CREATE NEW ${activeTab.toUpperCase()}`}
                 </label>
                 <select 
                    className="w-full bg-[#1e1e1e] text-white p-3 rounded-xl border border-gray-700 outline-none focus:border-green-500"
                    onChange={(e) => handleSelectForEdit(parseInt(e.target.value))}
                    value={editingId || ''}
                 >
                    <option value="">-- Select an item to Edit (or select this to Create New) --</option>
                    {existingItems.map(item => (
                        <option key={item.id} value={item.id}>
                            {item.title || item.event_name}
                        </option>
                    ))}
                 </select>
             </div>
             {editingId && (
                <button onClick={resetForm} className="bg-red-500/10 text-red-400 p-3 rounded-xl hover:bg-red-500/20 transition-colors" title="Cancel Edit">
                    <RotateCcw size={20} />
                </button>
             )}
             <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                {editingId ? <Edit3 className="text-yellow-400" size={20} /> : <Plus className="text-green-400" size={20} />}
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* LEFT COLUMN: Main Editors */}
            <div className="lg:col-span-2 space-y-6">
              {activeTab === 'blog' && (
                <>
                  <input value={title} placeholder="Enter Blog Title..." className="w-full text-3xl font-black p-4 bg-transparent border-b-2 border-gray-700 outline-none focus:border-green-500 transition-all text-white placeholder-gray-600" onChange={(e) => setTitle(e.target.value)} />
                  <div className="rounded-xl overflow-hidden text-black bg-white border border-gray-700">
                    <CKEditor editor={ClassicEditor} data={blogContent} config={{ extraPlugins: [MyCustomUploadAdapterPlugin as any] }} onChange={(_, editor) => setBlogContent(editor.getData())} />
                  </div>
                </>
              )}
              {activeTab === 'project' && (
                <>
                  <input value={projTitle} placeholder="Project Name..." className="w-full text-3xl font-black p-4 bg-transparent border-b-2 border-gray-700 outline-none focus:border-blue-500 transition-all text-white placeholder-gray-600" onChange={(e) => setProjTitle(e.target.value)} />
                  <textarea value={projDesc} placeholder="Describe the project mission..." className="w-full p-4 bg-[#2a2a2a] border border-gray-700 rounded-2xl h-40 text-white outline-none focus:border-blue-500 placeholder-gray-500" onChange={(e) => setProjDesc(e.target.value)} />
                  <input value={projGithub} placeholder="GitHub Repository URL" className="w-full p-4 bg-[#2a2a2a] border border-gray-700 rounded-2xl text-white outline-none focus:border-blue-500 placeholder-gray-500" onChange={(e) => setProjGithub(e.target.value)} />
                </>
              )}
              {activeTab === 'ctf' && (
                <>
                  <input value={eventName} placeholder="CTF Event Name..." className="w-full text-3xl font-black p-4 bg-transparent border-b-2 border-gray-700 outline-none focus:border-purple-500 transition-all text-white placeholder-gray-600" onChange={(e) => setEventName(e.target.value)} />
                  <div className="rounded-xl overflow-hidden text-black bg-white border border-gray-700">
                    <CKEditor editor={ClassicEditor} data={ctfDescription} config={{ extraPlugins: [MyCustomUploadAdapterPlugin as any] }} onChange={(_, editor) => setCtfDescription(editor.getData())} />
                  </div>
                </>
              )}
            </div>

            {/* RIGHT COLUMN: Sidebar Settings */}
            <div className="space-y-8 bg-[#252525] p-6 rounded-[2rem] border border-gray-700 shadow-xl">
              
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] flex items-center gap-2">Visual Asset</label>
                <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-600 rounded-2xl cursor-pointer bg-[#2a2a2a] hover:border-green-500 transition-all overflow-hidden group">
                    {(activeTab === 'blog' ? blogImageUrl : activeTab === 'project' ? projImg : ctfLogoUrl) ? 
                      <img src={(activeTab === 'blog' ? blogImageUrl : activeTab === 'project' ? projImg : ctfLogoUrl)} className="h-full w-full object-cover group-hover:opacity-80 transition-opacity" /> 
                      : <div className="text-center text-gray-500 group-hover:text-green-400 transition-colors"><Upload className="mx-auto mb-2" /> <span className="text-xs font-bold">{uploadingImage ? "SYNCING..." : "UPLOAD"}</span></div>}
                    <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, activeTab)} />
                </label>
              </div>

              {(activeTab === 'blog' || activeTab === 'project') && (
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] flex items-center gap-2"><TagIcon size={12} /> Metadata Tags</label>
                  <div className="flex gap-2">
                    <input value={newTagName} placeholder="Create..." className="flex-grow p-3 bg-[#2a2a2a] border border-gray-600 rounded-xl text-sm text-white outline-none focus:border-green-500 placeholder-gray-500" onChange={(e) => setNewTagName(e.target.value)} />
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
                    <input type="date" value={ctfDate} className="w-full p-3 bg-[#2a2a2a] border border-gray-600 rounded-xl text-white outline-none focus:border-purple-500" onChange={(e) => setCtfDate(e.target.value)} />
                    <input value={teamName} placeholder="Team Name (Optional)" className="w-full p-3 bg-[#2a2a2a] border border-gray-600 rounded-xl text-white outline-none focus:border-purple-500 placeholder-gray-500" onChange={(e) => setTeamName(e.target.value)} />
                    <input value={rankScore} placeholder="Rank (e.g. Top 10%)" className="w-full p-3 bg-[#2a2a2a] border border-gray-600 rounded-xl text-white outline-none focus:border-purple-500 placeholder-gray-500" onChange={(e) => setRankScore(e.target.value)} />
                    <input value={proofLink} placeholder="Proof Link" className="w-full p-3 bg-[#2a2a2a] border border-gray-600 rounded-xl text-white outline-none focus:border-purple-500 placeholder-gray-500" onChange={(e) => setProofLink(e.target.value)} />
                    <label className="flex items-center gap-2 font-bold text-xs text-gray-300 hover:text-white cursor-pointer"><input type="checkbox" className="accent-purple-500 h-4 w-4 rounded" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} /> FEATURE ON HOMEPAGE</label>
                  </>
                )}
                {activeTab === 'project' && (
                  <label className="flex items-center gap-2 font-bold text-xs text-gray-300 hover:text-white cursor-pointer"><input type="checkbox" className="accent-blue-500 h-4 w-4 rounded" checked={isProjFeatured} onChange={(e) => setIsProjFeatured(e.target.checked)} /> FEATURE ON HOMEPAGE</label>
                )}
                
                <input value={activeTab === 'blog' ? blogSlug : activeTab === 'ctf' ? ctfSlug : ''} placeholder="URL Slug" className="w-full p-3 bg-[#2a2a2a] border border-gray-600 rounded-xl text-white outline-none focus:border-white placeholder-gray-500" onChange={(e) => {
                  if (activeTab === 'blog') setBlogSlug(e.target.value);
                  else if (activeTab === 'ctf') setCtfSlug(e.target.value);
                }} />
              </div>

              <button disabled={publishing} onClick={handlePublish} 
                className={`w-full text-white py-5 rounded-2xl font-black text-lg shadow-lg transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                    editingId ? 'bg-yellow-600 hover:bg-yellow-500' :
                    activeTab === 'blog' ? 'bg-green-600 hover:bg-green-500 shadow-green-900/20' : 
                    activeTab === 'project' ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20' : 
                    'bg-purple-600 hover:bg-purple-500 shadow-purple-900/20'
                }`}>
                {publishing ? <Loader2 className="animate-spin" /> : (editingId ? "UPDATE CONTENT" : "PUBLISH TO LIVE")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;