'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { IPost, ICategory, ITag } from '@/models/Post';
import CreatableSelect from 'react-select/creatable';
import { MultiValue } from 'react-select';
import { OutputData } from '@editorjs/editorjs';
import { EditorJsMethods } from '@/components/EditorJsComponent';
import '../create-post/editorjs-custom.css';

interface SelectOption { value: string; label: string; }

const LoadingSpinner = () => <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>;
const FeaturedImageUploader = dynamic(() => import('@/components/FeaturedImageUploader'), { ssr: false });
const EditorJsComponent = dynamic(() => import('@/components/EditorJsComponent'), { ssr: false, loading: () => <div className="bg-gray-700 rounded-md p-4 min-h-[300px] text-gray-400">Loading Editor...</div> });

const EditorJsPreviewRenderer = ({ data }: { data: OutputData }) => {
  if (!data || !Array.isArray(data.blocks) || data.blocks.length === 0) {
    return <div className="p-4 text-gray-400 italic">Start typing in the editor to see a live preview...</div>;
  }
  return (
    <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-white prose-a:text-blue-400 hover:prose-a:text-blue-300 transition-colors">
      {data.blocks.map((block: any) => {
        switch (block.type) {
          case 'header':
            const { level, text } = block.data;
            if (!level || !text) return null;
            if (level === 1) return <h1 key={block.id} className="text-4xl font-extrabold mb-4">{text}</h1>;
            if (level === 2) return <h2 key={block.id} className="text-3xl font-bold mt-8 mb-4 border-b border-gray-700 pb-2">{text}</h2>;
            if (level === 3) return <h3 key={block.id} className="text-2xl font-semibold mt-6 mb-3">{text}</h3>;
            return null;
          case 'paragraph':
            return <div key={block.id} className="text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: block.data.text }} />;
          case 'image':
            return (<figure key={block.id} className="my-6"><img src={block.data.file.url} alt={block.data.caption || 'Content image'} className="rounded-lg w-full h-auto object-cover" /><figcaption className="text-center text-sm text-gray-400 mt-2">{block.data.caption}</figcaption></figure>);
          case 'list':
            const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
            const listStyle = block.data.style === 'ordered' ? 'list-decimal' : 'list-disc';
            return (<ListTag key={block.id} className={`${listStyle} pl-5 space-y-2`}>{block.data.items.map((item: any, index: number) => { const content = typeof item === 'object' && item.content ? item.content : item; return (<li key={index} className="text-lg" dangerouslySetInnerHTML={{ __html: content }} />);})}</ListTag>);
          case 'table':
            return (
              <div key={block.id} className="my-6 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <tbody>
                    {block.data.withHeadings && (
                      <thead>
                        <tr className="bg-gray-700">
                          {block.data.content[0].map((cellContent: string, cellIndex: number) => (
                            <th key={cellIndex} className="p-3 border border-gray-600 font-semibold" dangerouslySetInnerHTML={{ __html: cellContent }} />
                          ))}
                        </tr>
                      </thead>
                    )}
                    {(block.data.withHeadings ? block.data.content.slice(1) : block.data.content).map((row: string[], rowIndex: number) => (
                      <tr key={rowIndex} className="bg-gray-800 even:bg-gray-700/50">
                        {row.map((cellContent: string, cellIndex: number) => (
                          <td key={cellIndex} className="p-3 border border-gray-600" dangerouslySetInnerHTML={{ __html: cellContent }} />
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

const PublishedPostsTable = ({ posts, isLoading, onEdit, onDelete }: { posts: IPost[], isLoading: boolean, onEdit: (post: IPost) => void, onDelete: (id: string) => void }) => (
    <div className="mt-12 p-4 bg-gray-800 rounded-lg"><h2 className="text-2xl font-bold mb-4">Published Posts</h2><div className="overflow-x-auto relative">{isLoading && <div className="absolute inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-10"><LoadingSpinner /></div>}<table className="w-full text-sm text-left text-gray-400"><thead className="text-xs text-gray-300 uppercase bg-gray-700"><tr><th scope="col" className="px-6 py-3">Title</th><th scope="col" className="px-6 py-3">Date</th><th scope="col" className="px-6 py-3 text-right">Actions</th></tr></thead><tbody>{posts.length === 0 && !isLoading ? (<tr><td colSpan={3} className="px-6 py-10 text-center text-gray-500">No posts found.</td></tr>) : (posts.map((post) => (<tr key={post._id.toString()} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-600"><th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{post.title}</th><td className="px-6 py-4">{new Date(post.createdAt).toLocaleDateString()}</td><td className="px-6 py-4 text-right space-x-4"><button onClick={() => onEdit(post)} className="font-medium text-blue-500 hover:underline" disabled={isLoading}>Edit</button><button onClick={() => onDelete(post._id.toString())} className="font-medium text-red-500 hover:underline" disabled={isLoading}>Delete</button></td></tr>)))}</tbody></table></div></div>
);

const LoginForm = ({ onAuthenticated }: { onAuthenticated: () => void }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setError(''); const correctPassword = process.env.NEXT_PUBLIC_CMS_PASSWORD; if (!correctPassword) { setError('CMS password not configured.'); return; } if (password === correctPassword) { onAuthenticated(); } else { setError('Incorrect password.'); } };
    return (<div className="min-h-screen flex items-center justify-center bg-gray-900"><div className="w-full max-w-sm"><form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-lg"><h1 className="text-white text-2xl mb-6 text-center font-bold">CMS Access</h1>{error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}<div className="mb-4"><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 rounded bg-gray-700" placeholder="Password" autoFocus /></div><button type="submit" className="w-full mt-4 bg-blue-600 text-white p-2 rounded">Login</button></form></div></div>);
};

const CreatePostPage = () => {
    const editorComponentRef = useRef<EditorJsMethods>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [posts, setPosts] = useState<IPost[]>([]);
    const [isPostsLoading, setIsPostsLoading] = useState(true);
    const [editingPostId, setEditingPostId] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const [allCategories, setAllCategories] = useState<SelectOption[]>([]);
    const [allTags, setAllTags] = useState<SelectOption[]>([]);
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [keywords, setKeywords] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<MultiValue<SelectOption>>([]);
    const [selectedTags, setSelectedTags] = useState<MultiValue<SelectOption>>([]);
    const [featuredImageUrl, setFeaturedImageUrl] = useState('');
    const [content, setContent] = useState<OutputData>({ time: Date.now(), blocks: [], version: "2.28.2" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [editorKey, setEditorKey] = useState(Date.now());

    const fetchInitialData = useCallback(async () => {
        setIsPostsLoading(true);
        try {
            const [postsRes, catRes, tagRes] = await Promise.all([fetch('/api/posts'), fetch('/api/categories'), fetch('/api/tags')]);
            if (postsRes.ok) setPosts(await postsRes.json());
            if (catRes.ok) setAllCategories((await catRes.json()).map((c: ICategory) => ({ value: c._id.toString(), label: c.name })));
            if (tagRes.ok) setAllTags((await tagRes.json()).map((t: ITag) => ({ value: t._id.toString(), label: t.name })));
        } catch (error) { setFormError("Failed to load CMS data.");
        } finally { setIsPostsLoading(false); }
    }, []);
    
    useEffect(() => { setIsMounted(true); }, []);
    useEffect(() => { if (isAuthenticated) { fetchInitialData(); } }, [isAuthenticated, fetchInitialData]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
        setSlug(e.target.value.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-'));
    };
    
    const resetForm = () => {
        setEditingPostId(null); setTitle(''); setSlug(''); setAuthor(''); setDescription(''); setKeywords('');
        setFeaturedImageUrl('');
        setContent({ time: Date.now(), blocks: [], version: "2.28.2" });
        setEditorKey(Date.now());
        setSelectedCategories([]); setSelectedTags([]); setFormError(null); window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleLoadPostForEdit = (post: IPost) => {
        setEditingPostId(post._id.toString()); setTitle(post.title); setSlug(post.slug); setAuthor(post.author);
        setDescription(post.description || '');
        setKeywords(Array.isArray(post.keywords) ? post.keywords.join(', ') : '');
        setFeaturedImageUrl(post.featuredImageUrl || '');
        setContent(post.content as OutputData);
        setEditorKey(Date.now());
        const postCategoryIds = (post.categories as any[]).map(c => typeof c === 'string' ? c : c._id.toString());
        const postTagIds = (post.tags as any[]).map(t => typeof t === 'string' ? t : t._id.toString());
        setSelectedCategories(allCategories.filter(opt => postCategoryIds.includes(opt.value)));
        setSelectedTags(allTags.filter(opt => postTagIds.includes(opt.value)));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCreateOption = async (inputValue: string, type: 'categories' | 'tags') => {
        setIsCreating(true);
        try {
            const response = await fetch(`/api/${type}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: inputValue }) });
            const newData = await response.json();
            if (response.ok || response.status === 409) {
                const newOption = { value: newData._id.toString(), label: newData.name };
                if (type === 'categories') {
                    if (!allCategories.some(c => c.value === newOption.value)) setAllCategories(p => [...p, newOption]);
                    setSelectedCategories(p => [...p.filter(c => c.value !== newOption.value), newOption]);
                } else {
                    if (!allTags.some(t => t.value === newOption.value)) setAllTags(p => [...p, newOption]);
                    setSelectedTags(p => [...p.filter(t => t.value !== newOption.value), newOption]);
                }
            } else { setFormError(`Error creating ${type.slice(0, -1)}: ${newData.message}`); }
        } catch (err) { setFormError(`Network error creating ${type.slice(0, -1)}.`);
        } finally { setIsCreating(false); }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setIsSubmitting(true); setFormError(null);
        if (!content.blocks || content.blocks.length === 0) { setFormError("Content cannot be empty."); setIsSubmitting(false); return; }
        
        const keywordsArray = keywords.split(',').map(k => k.trim()).filter(k => k);
        
        const body = { title, slug, author, description, keywords: keywordsArray, featuredImageUrl, content, categories: selectedCategories.map(c => c.value), tags: selectedTags.map(t => t.value) };
        const url = editingPostId ? `/api/posts/${editingPostId}` : '/api/posts';
        const method = editingPostId ? 'PUT' : 'POST';
        
        try {
            const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            if (response.ok) {
                alert(`Post successfully ${editingPostId ? 'updated' : 'published'}!`);
                if (!editingPostId) resetForm();
                await fetchInitialData();
            } else { const data = await response.json(); setFormError(data.message || 'An error occurred.'); }
        } catch (error) { setFormError('A network error occurred.');
        } finally { setIsSubmitting(false); }
    };

    const handleDelete = async (postId: string) => {
        if (!window.confirm("Are you sure?")) return;
        try { 
            const response = await fetch(`/api/posts/${postId}`, { method: 'DELETE' }); 
            if (response.ok) {
                alert("Post deleted.");
                if (editingPostId === postId) resetForm();
                await fetchInitialData();
            } else { const data = await response.json(); setFormError(data.message || "Failed to delete post."); }
        } catch(e){ setFormError("Error deleting post."); }
    };
    
    if (!isMounted) return null;
    if (!isAuthenticated) return <LoginForm onAuthenticated={() => setIsAuthenticated(true)} />;

    const selectStyles = { control: (s:any) => ({...s, backgroundColor: '#4a5568', border: '1px solid #718096'}), multiValue: (s:any) => ({...s, backgroundColor: '#2d3748'}), multiValueLabel: (s:any) => ({...s, color: '#e2e8f0'}), multiValueRemove: (s:any) => ({...s, color: '#cbd5e0', ':hover': { backgroundColor: '#e53e3e', color: 'white'}}), option: (s:any, {isFocused}:any) => ({...s, backgroundColor: isFocused ? '#2d3748' : '#4a5568', color: '#e2e8f0'}), menu: (s:any) => ({...s, backgroundColor: '#4a5568'}) };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-12">
                <div>
                    <div className="flex justify-between items-center mb-6"><h1 className="text-3xl font-bold">{editingPostId ? 'Edit Post' : 'Create New Post'}</h1>{editingPostId && (<button onClick={resetForm} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded">New Post</button>)}</div>
                    {formError && <div className="mb-4 p-3 rounded bg-red-800 text-white"><p className="font-bold">Error</p><p>{formError}</p></div>}
                    <div className="lg:grid lg:grid-cols-2 lg:gap-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="p-4 bg-gray-800 rounded-lg space-y-4">
                                <h2 className="text-xl font-semibold">Post Details</h2>
                                <div><label className="block text-sm mb-1">Title</label><input type="text" value={title} onChange={handleTitleChange} required className="w-full p-2 rounded bg-gray-700 border-gray-600" /></div>
                                <div><label className="block text-sm mb-1">Meta Description</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full p-2 rounded bg-gray-700 border border-gray-600"></textarea></div>
                                <div><label className="block text-sm mb-1">Keywords</label><textarea value={keywords} onChange={(e) => setKeywords(e.target.value)} rows={2} className="w-full p-2 rounded bg-gray-700 border border-gray-600" placeholder="e.g., sports, football, premier league"></textarea></div>
                                <div><label className="block text-sm mb-1">Featured Image</label><FeaturedImageUploader value={featuredImageUrl} onChange={setFeaturedImageUrl} setFormError={setFormError} /></div>
                                <div><label className="block text-sm mb-1">Slug</label><input type="text" value={slug} onChange={e => setSlug(e.target.value)} required className="w-full p-2 rounded bg-gray-700" /></div>
                                <div><label className="block text-sm mb-1">Author</label><input type="text" value={author} onChange={e => setAuthor(e.target.value)} required className="w-full p-2 rounded bg-gray-700" /></div>
                                <div><label className="block text-sm mb-1">Categories</label><CreatableSelect instanceId="categories-select" isMulti options={allCategories} value={selectedCategories} onChange={(v) => setSelectedCategories(v as MultiValue<SelectOption>)} onCreateOption={(val) => handleCreateOption(val, 'categories')} styles={selectStyles} className="text-black" /></div>
                                <div><label className="block text-sm mb-1">Tags</label><CreatableSelect instanceId="tags-select" isMulti options={allTags} value={selectedTags} onChange={(v) => setSelectedTags(v as MultiValue<SelectOption>)} onCreateOption={(val) => handleCreateOption(val, 'tags')} styles={selectStyles} className="text-black" /></div>
                            </div>
                            <div className="p-4 bg-gray-800 rounded-lg">
                                <h2 className="text-xl font-semibold mb-4">Content Editor</h2>
                                <EditorJsComponent key={editorKey} data={content} onChange={setContent} />
                            </div>
                            <button type="submit" disabled={isSubmitting} className="w-full bg-green-600 hover:bg-green-700 font-bold py-3 rounded text-lg disabled:bg-gray-500">{isSubmitting ? 'Saving...' : (editingPostId ? 'Update Post' : 'Publish Post')}</button>
                        </form>
                        <div className="p-4 bg-gray-800 rounded-lg mt-8 lg:mt-0">
                            <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
                            <div className="p-4 border border-gray-700 rounded-md min-h-[200px]"><EditorJsPreviewRenderer data={content} /></div>
                        </div>
                    </div>
                </div>
                <PublishedPostsTable posts={posts} isLoading={isPostsLoading} onEdit={handleLoadPostForEdit} onDelete={handleDelete} />
            </div>
        </div>
    );
};
export default CreatePostPage;