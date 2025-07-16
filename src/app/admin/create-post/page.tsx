'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { IPost, ICategory, ITag } from '@/models/Post';
import CreatableSelect from 'react-select/creatable';
import { MultiValue } from 'react-select';
import { OutputData } from '@editorjs/editorjs';

// --- Type Definitions ---
interface SelectOption { value: string; label: string; }
type BlockType = 'h1' | 'h2' | 'h3' | 'p' | 'image' | 'ctaButton';
interface ContentBlock { id: string; type: BlockType; value: any; } 

// --- UI Components ---
const LoadingSpinner = () => <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>;

// FIX: Corrected dynamic import for EditorJsRenderer
const EditorJsRenderer = dynamic(() => import('@/components/EditorJsRenderer'), { ssr: false, loading: () => <div className="w-full min-h-[480px] bg-gray-800 rounded-lg p-4">Loading Editor...</div> });

const SuccessModal = ({ isOpen, onClose, message }: { isOpen: boolean, onClose: () => void, message: string }) => { if (!isOpen) return null; return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}><div className="bg-gray-800 p-8 rounded-lg shadow-xl text-center" onClick={e => e.stopPropagation()}><h2 className="text-2xl font-bold text-green-400 mb-4">Success!</h2><p className="text-white mb-6">{message}</p><button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded">Close</button></div></div>); };

const FeaturedImageUploader = dynamic(() => import('@/components/FeaturedImageUploader'), { ssr: false, loading: () => <p className="text-sm text-gray-400">Loading featured image uploader...</p> });

// ImageUploader for in-body images (now correctly defined, was missing in prior versions)
const ImageUploader = ({ value, onUpdate, setFormError }: { value: { url?: string, caption?: string }, onUpdate: (newValues: object) => void, setFormError: (msg: string | null) => void }) => { 
    const [isUploading, setIsUploading] = useState(false); 
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => { 
        const file = e.target.files?.[0]; if (!file) return; 
        setIsUploading(true); setFormError(null); 
        const formData = new FormData(); formData.append('file', file); 
        try { 
            const response = await fetch('/api/upload', { method: 'POST', body: formData }); 
            const data = await response.json(); 
            if (data.success) { onUpdate({ url: data.url }); }
            else { setFormError(`Image upload failed: ${data.message || 'Unknown error'}`); }
        } catch (error) { setFormError('An unexpected error occurred during upload.'); 
        } finally { setIsUploading(false); } 
    }; 
    return (<div className="space-y-2">{value.url && <img src={value.url} alt={value.caption || 'Uploaded image'} className="max-w-full h-auto rounded-md" />}<input type="file" accept="image/png, image:jpeg, image:webp, image:gif" onChange={handleFileUpload} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />{isUploading && <p className="text-sm text-gray-400">Uploading...</p>}<input type="text" placeholder="Image Caption (used as Alt Text)..." value={value.caption || ''} onChange={(e) => onUpdate({ caption: e.target.value })} className="w-full p-2 rounded bg-gray-600 border border-gray-500 text-sm italic" /></div>); 
};

// SortableBlock (and all DND-Kit related functions) are completely removed from this file.
// They are not used when Editor.js is the content builder.

const PublishedPostsTable = ({ posts, isLoading, onEdit, onDelete }: { posts: IPost[], isLoading: boolean, onEdit: (post: IPost) => void, onDelete: (id: string) => void }) => (
    <div className="mt-12 lg:mt-0 p-4 bg-gray-800 rounded-lg"><h2 className="text-2xl font-bold mb-4">Published Posts</h2><div className="overflow-x-auto relative">{isLoading && <div className="absolute inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-10"><LoadingSpinner /></div>}<table className="w-full text-sm text-left text-gray-400"><thead className="text-xs text-gray-300 uppercase bg-gray-700"><tr><th scope="col" className="px-6 py-3">Title</th><th scope="col" className="px-6 py-3">Date Published</th><th scope="col" className="px-6 py-3 text-right">Actions</th></tr></thead><tbody>{posts.length === 0 && !isLoading ? (<tr><td colSpan={3} className="px-6 py-10 text-center text-gray-500">No posts found.</td></tr>) : (posts.map((post) => (<tr key={post._id.toString()} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-600"><th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{post.title}</th><td className="px-6 py-4">{new Date(post.createdAt).toLocaleDateString()}</td><td className="px-6 py-4 text-right space-x-4"><button onClick={() => onEdit(post)} className="font-medium text-blue-500 hover:underline disabled:text-gray-500" disabled={isLoading}>Edit</button><button onClick={() => onDelete(post._id.toString())} className="font-medium text-red-500 hover:underline disabled:text-gray-500" disabled={isLoading}>Delete</button></td></tr>)))}</tbody></table></div></div>
);

const CreatePostPage = () => {
    // --- State Management ---
    const [isMounted, setIsMounted] = useState(false);
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [posts, setPosts] = useState<IPost[]>([]);
    const [isPostsLoading, setIsPostsLoading] = useState(false);
    const [editingPostId, setEditingPostId] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const [allCategories, setAllCategories] = useState<SelectOption[]>([]);
    const [allTags, setAllTags] = useState<SelectOption[]>([]);

    // Form fields state (content is an OutputData object for Editor.js)
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<MultiValue<SelectOption>>([]);
    const [selectedTags, setSelectedTags] = useState<MultiValue<SelectOption>>([]);
    const [featuredImageUrl, setFeaturedImageUrl] = useState('');
    const [content, setContent] = useState<OutputData>({ time: Date.now(), blocks: [], version: "2.28.2" }); // Initial empty Editor.js data
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCreating, setIsCreating] = useState(false);


    // --- Data Fetching Logic ---
    const fetchInitialData = useCallback(async () => {
        setIsPostsLoading(true); setFormError(null);
        try {
            const [postsRes, catRes, tagRes] = await Promise.all([fetch('/api/posts'), fetch('/api/categories'), fetch('/api/tags')]);
            if (postsRes.ok) setPosts(await postsRes.json());
            if (catRes.ok) setAllCategories((await catRes.json()).map((c: ICategory) => ({ value: c._id.toString(), label: c.name })));
            if (tagRes.ok) setAllTags((await tagRes.json()).map((t: ITag) => ({ value: t._id.toString(), label: t.name })));
        } catch (error) { setFormError("Failed to load initial CMS data."); console.error("Fetch initial data error:", error);
        } finally { setIsPostsLoading(false); }
    }, []);
    
    // --- Effects ---
    useEffect(() => { setIsMounted(true); }, []);
    useEffect(() => { if (isAuthenticated) { fetchInitialData(); } }, [isAuthenticated, fetchInitialData]);

    // --- Form Handlers ---
    const handlePasswordSubmit = (e: React.FormEvent) => { e.preventDefault(); if (password === process.env.NEXT_PUBLIC_CMS_PASSWORD) setIsAuthenticated(true); else alert('Incorrect password'); };
    const generateSlug = (s:string) => s.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => { setTitle(e.target.value); setSlug(generateSlug(e.target.value)); };

    const handleCreateOption = async (inputValue: string, type: 'categories' | 'tags') => {
        setIsCreating(true); setFormError(null);
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
        } catch (err) { setFormError(`Network error creating ${type.slice(0, -1)}.`); console.error(`Error creating ${type.slice(0, -1)}:`, err);
        } finally { setIsCreating(false); }
    };
    
    const resetForm = () => {
        setEditingPostId(null); setTitle(''); setSlug(''); setAuthor(''); setDescription(''); setFeaturedImageUrl('');
        setContent({ time: Date.now(), blocks: [], version: "2.28.2" }); // Reset Editor.js data
        setSelectedCategories([]); setSelectedTags([]);
        setFormError(null); window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleLoadPostForEdit = (post: IPost) => {
        setEditingPostId(post._id.toString());
        setTitle(post.title); setSlug(post.slug); setAuthor(post.author);
        setDescription(post.description || ''); setFeaturedImageUrl(post.featuredImageUrl || '');
        // IMPORTANT: Editor.js expects `content` to be an object { blocks: [] }
        // Ensure that post.content is correctly casted to OutputData
        setContent(post.content as OutputData); // Cast from DB object to Editor.js OutputData
        const postCategoryIds = (post.categories as any[]).map(c => typeof c === 'string' ? c : c._id.toString());
        const postTagIds = (post.tags as any[]).map(t => typeof t === 'string' ? t : t._id.toString());
        setSelectedCategories(allCategories.filter(opt => postCategoryIds.includes(opt.value)));
        setSelectedTags(allTags.filter(opt => postTagIds.includes(opt.value)));
        setFormError(null); window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setIsSubmitting(true); setFormError(null);
        // Check if content has at least one block before submitting
        if (!content.blocks || content.blocks.length === 0) {
            setFormError("Content cannot be empty. Please add at least one block using Editor.js.");
            setIsSubmitting(false);
            return;
        }

        const body = { title, slug, author, description, featuredImageUrl, content, categories: selectedCategories.map(c => c.value), tags: selectedTags.map(t => t.value) };
        const isUpdating = !!editingPostId;
        const url = isUpdating ? `/api/posts/${editingPostId}` : '/api/posts';
        const method = isUpdating ? 'PUT' : 'POST';
        try {
            const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            const data = await response.json();
            if (response.ok) {
                alert(`Post successfully ${isUpdating ? 'updated' : 'published'}!`);
                if (!isUpdating) resetForm();
                await fetchInitialData();
            } else { setFormError(data.message || `An error occurred: ${response.statusText}`); }
        } catch (error) { setFormError('A network error occurred.'); console.error('Submit error:', error);
        } finally { setIsSubmitting(false); }
    };

    const handleDelete = async (postId: string) => {
        if (!window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) return;
        setFormError(null);
        try { 
            const response = await fetch(`/api/posts/${postId}`, { method: 'DELETE' }); 
            if (response.ok) {
                alert("Post deleted successfully.");
                if (editingPostId === postId) resetForm();
                await fetchInitialData();
            } else {
                const data = await response.json();
                setFormError(data.message || "Failed to delete post.");
            }
        } catch(e){ setFormError("Error deleting post."); console.error('Delete error:', e); }
    };
    
    if (!isMounted) return null;
    if (!isAuthenticated) return (<div className="min-h-screen flex items-center justify-center bg-gray-900"><form onSubmit={handlePasswordSubmit} className="bg-gray-800 p-8 rounded-lg w-full max-w-sm"><h1 className="text-white text-2xl mb-4 text-center">CMS Access</h1><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 rounded bg-gray-700" placeholder="Password" /><button type="submit" className="w-full mt-4 bg-blue-600 text-white p-2 rounded">Login</button></form></div>);

    const selectStyles = { control: (s:any) => ({...s, backgroundColor: '#4a5568', border: '1px solid #718096'}), multiValue: (s:any) => ({...s, backgroundColor: '#2d3748'}), multiValueLabel: (s:any) => ({...s, color: '#e2e8f0'}), multiValueRemove: (s:any) => ({...s, color: '#cbd5e0', ':hover': { backgroundColor: '#e53e3e', color: 'white'}}), option: (s:any, {isFocused}:any) => ({...s, backgroundColor: isFocused ? '#2d3748' : '#4a5568', color: '#e2e8f0'}), menu: (s:any) => ({...s, backgroundColor: '#4a5568'}) };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
            <div className="max-w-7xl mx-auto lg:grid lg:grid-cols-2 lg:gap-8">
                <div className="lg:col-span-1">
                    <div className="flex justify-between items-center mb-6"><h1 className="text-3xl font-bold">{editingPostId ? 'Edit Post' : 'Create New Post'}</h1>{editingPostId && (<button onClick={resetForm} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded">Reset Form</button>)}</div>
                    {formError && <div className="mb-4 p-3 rounded bg-red-800 text-white"><p className="font-bold">Error</p><p>{formError}</p></div>}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="p-4 bg-gray-800 rounded-lg space-y-4">
                            <h2 className="text-xl font-semibold">Post Details</h2>
                            <div><label className="block text-sm mb-1">Title</label><input type="text" value={title} onChange={handleTitleChange} required className="w-full p-2 rounded bg-gray-700 border-gray-600" /></div>
                            <div><label className="block text-sm mb-1">Meta Description</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full p-2 rounded bg-gray-700 border border-gray-600" placeholder="A short summary for SEO..."></textarea></div>
                            <div><label className="block text-sm mb-1">Featured Image</label><FeaturedImageUploader value={featuredImageUrl} onChange={setFeaturedImageUrl} setFormError={setFormError} /></div>
                            <div><label className="block text-sm mb-1">Slug</label><input type="text" value={slug} onChange={e => setSlug(e.target.value)} required className="w-full p-2 rounded bg-gray-700" /></div>
                            <div><label className="block text-sm mb-1">Author</label><input type="text" value={author} onChange={e => setAuthor(e.target.value)} required className="w-full p-2 rounded bg-gray-700" /></div>
                            <div><label className="block text-sm mb-1">Categories</label><CreatableSelect instanceId="categories-select" isMulti options={allCategories} value={selectedCategories} onChange={(v) => setSelectedCategories(v)} onCreateOption={(val) => handleCreateOption(val, 'categories')} isDisabled={isCreating || isPostsLoading} isLoading={isCreating} styles={selectStyles} className="text-black" /></div>
                            <div><label className="block text-sm mb-1">Tags</label><CreatableSelect instanceId="tags-select" isMulti options={allTags} value={selectedTags} onChange={(v) => setSelectedTags(v)} onCreateOption={(val) => handleCreateOption(val, 'tags')} isDisabled={isCreating || isPostsLoading} isLoading={isCreating} styles={selectStyles} className="text-black" /></div>
                        </div>
                        <div className="p-4 bg-gray-800 rounded-lg">
                            <h2 className="text-xl font-semibold mb-4">Content Builder</h2>
                            {/* The Editor.js renderer component */}
                            <EditorJsRenderer content={content} onChange={setContent} />
                        </div>
                        <button type="submit" disabled={isSubmitting || isPostsLoading} className="w-full bg-green-600 hover:bg-green-700 font-bold py-3 rounded text-lg disabled:bg-gray-500">{isSubmitting ? 'Saving...' : (editingPostId ? 'Update Post' : 'Publish Post')}</button>
                    </form>
                </div>
                <div className="lg:col-span-1"><PublishedPostsTable posts={posts} isLoading={isPostsLoading} onEdit={handleLoadPostForEdit} onDelete={handleDelete} /></div>
            </div>
        </div>
    );
};
export default CreatePostPage;