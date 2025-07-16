'use client';

import { useState, useEffect, useCallback } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import dynamic from 'next/dynamic';
import { IPost, ICategory, ITag } from '@/models/Post';
import CreatableSelect from 'react-select/creatable';
import { MultiValue } from 'react-select';

interface SelectOption { value: string; label: string; }
type BlockType = 'h1' | 'h2' | 'h3' | 'p' | 'image' | 'ctaButton';
interface ContentBlock { id: string; type: BlockType; value: any; }

const LoadingSpinner = () => <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>;
const RichParagraphEditor = dynamic(() => import('@/components/RichParagraphEditor'), { ssr: false, loading: () => <p className="p-2 bg-gray-700 rounded-md">Loading editor...</p> });

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
    return (<div className="space-y-2">{value.url && <img src={value.url} alt={value.caption || 'Uploaded image'} className="max-w-full h-auto rounded-md" />}<input type="file" accept="image/png, image/jpeg, image/webp, image/gif" onChange={handleFileUpload} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />{isUploading && <p className="text-sm text-gray-400">Uploading...</p>}<input type="text" placeholder="Image Caption (used as Alt Text)..." value={value.caption || ''} onChange={(e) => onUpdate({ caption: e.target.value })} className="w-full p-2 rounded bg-gray-600 border border-gray-500 text-sm italic" /></div>); 
};

function SortableBlock({ block, onUpdate, onDelete, setFormError }: { block: ContentBlock, onUpdate: (id: string, newValues: object) => void, onDelete: (id: string) => void, setFormError: (msg: string | null) => void }) { 
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: block.id }); 
    const style = { transform: CSS.Transform.toString(transform), transition }; 
    const renderBlockContent = () => { 
        switch (block.type) { 
            case 'image': return <ImageUploader value={block.value} onUpdate={(newValues) => onUpdate(block.id, newValues)} setFormError={setFormError} />; 
            case 'p': return <RichParagraphEditor value={block.value.html || ''} onChange={(html) => onUpdate(block.id, { html })} />; 
            case 'ctaButton': return (<div className="space-y-2 w-full"><input type="text" placeholder="Button Text..." value={block.value.text || ''} onChange={(e) => onUpdate(block.id, { text: e.target.value })} className="w-full p-2 rounded bg-gray-600 border border-gray-500" /><input type="text" placeholder="Button Link URL..." value={block.value.url || ''} onChange={(e) => onUpdate(block.id, { url: e.target.value })} className="w-full p-2 rounded bg-gray-600 border border-gray-500" /></div>); 
            default: return <input type="text" placeholder={`${block.type.toUpperCase()}...`} value={block.value.text || ''} onChange={(e) => onUpdate(block.id, { text: e.target.value })} className={`w-full p-2 rounded bg-gray-600 border-gray-500 ${block.type === 'h1' ? 'text-3xl font-bold' : block.type === 'h2' ? 'text-2xl font-semibold' : 'text-xl font-medium'}`} />; 
        } 
    }; 
    return (<div ref={setNodeRef} style={style} className="flex items-start gap-2 p-3 bg-gray-700 rounded-md"><button type="button" {...attributes} {...listeners} className="p-2 cursor-grab touch-none flex-shrink-0"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400"><path d="M10 5h4v4h-4zm0 6h4v4h-4zm0 6h4v4h-4z" /></svg></button><div className="flex-grow">{renderBlockContent()}</div><button type="button" onClick={() => onDelete(block.id)} className="p-2 bg-red-600 hover:bg-red-700 rounded-md text-white flex-shrink-0">Delete</button></div>); 
}

const PublishedPostsTable = ({ posts, isLoading, onEdit, onDelete }: { posts: IPost[], isLoading: boolean, onEdit: (post: IPost) => void, onDelete: (id: string) => void }) => (
    <div className="mt-12 lg:mt-0 p-4 bg-gray-800 rounded-lg"><h2 className="text-2xl font-bold mb-4">Published Posts</h2><div className="overflow-x-auto relative">{isLoading && <div className="absolute inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-10"><LoadingSpinner /></div>}<table className="w-full text-sm text-left text-gray-400"><thead className="text-xs text-gray-300 uppercase bg-gray-700"><tr><th scope="col" className="px-6 py-3">Title</th><th scope="col" className="px-6 py-3">Date Published</th><th scope="col" className="px-6 py-3 text-right">Actions</th></tr></thead><tbody>{posts.length === 0 && !isLoading ? (<tr><td colSpan={3} className="px-6 py-10 text-center text-gray-500">No posts found.</td></tr>) 
                    : (posts.map((post) => (<tr key={post._id.toString()} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-600"><th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{post.title}</th><td className="px-6 py-4">{new Date(post.createdAt).toLocaleDateString()}</td><td className="px-6 py-4 text-right space-x-4"><button onClick={() => onEdit(post)} className="font-medium text-blue-500 hover:underline disabled:text-gray-500" disabled={isLoading}>Edit</button><button onClick={() => onDelete(post._id.toString())} className="font-medium text-red-500 hover:underline disabled:text-gray-500" disabled={isLoading}>Delete</button></td></tr>)))}
                </tbody>
            </table>
        </div>
    </div>
);

const CreatePostPage = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [posts, setPosts] = useState<IPost[]>([]);
    const [isPostsLoading, setIsPostsLoading] = useState(false);
    const [editingPostId, setEditingPostId] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const [allCategories, setAllCategories] = useState<SelectOption[]>([]);
    const [allTags, setAllTags] = useState<SelectOption[]>([]);
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [author, setAuthor] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<MultiValue<SelectOption>>([]);
    const [selectedTags, setSelectedTags] = useState<MultiValue<SelectOption>>([]);
    const [featuredImageUrl, setFeaturedImageUrl] = useState('');
    const [content, setContent] = useState<ContentBlock[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    const fetchInitialData = useCallback(async () => {
        setIsPostsLoading(true);
        try {
            const [postsRes, catRes, tagRes] = await Promise.all([ fetch('/api/posts'), fetch('/api/categories'), fetch('/api/tags') ]);
            if (postsRes.ok) setPosts(await postsRes.json());
            if (catRes.ok) {
                const data: ICategory[] = await catRes.json();
                setAllCategories(data.map(c => ({ value: c._id.toString(), label: c.name })));
            }
            if (tagRes.ok) {
                const data: ITag[] = await tagRes.json();
                setAllTags(data.map(t => ({ value: t._id.toString(), label: t.name })));
            }
        } catch (error) { setFormError("Failed to load initial CMS data.");
        } finally { setIsPostsLoading(false); }
    }, []);
    
    useEffect(() => { setIsMounted(true); }, []);
    useEffect(() => { if (isAuthenticated) { fetchInitialData(); } }, [isAuthenticated, fetchInitialData]);

    const handleCreateOption = async (inputValue: string, type: 'categories' | 'tags') => {
        setIsCreating(true);
        setFormError(null);
        try {
            const response = await fetch(`/api/${type}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: inputValue }) });
            const newData = await response.json();
            if (response.ok || response.status === 409) {
                const newOption = { value: newData._id.toString(), label: newData.name };
                if (type === 'categories') {
                    if (!allCategories.some(c => c.value === newOption.value)) {
                        setAllCategories(prev => [...prev, newOption]);
                    }
                    setSelectedCategories(prev => [...prev.filter(c => c.value !== newOption.value), newOption]);
                } else {
                    if (!allTags.some(t => t.value === newOption.value)) {
                        setAllTags(prev => [...prev, newOption]);
                    }
                    setSelectedTags(prev => [...prev.filter(t => t.value !== newOption.value), newOption]);
                }
            } else { setFormError(`Error creating ${type.slice(0, -1)}: ${newData.message}`); }
        } catch (err) { setFormError(`Network error while creating ${type.slice(0, -1)}.`);
        } finally { setIsCreating(false); }
    };
    
    const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => { setTitle(e.target.value); const generateSlug = (s:string) => s.toLowerCase().trim().replace(/[^\w\s-]/g,'').replace(/[\s_-]+/g,'-').replace(/^-+|-+$/g, ''); setSlug(generateSlug(e.target.value)); };
    const handlePasswordSubmit = (e: React.FormEvent) => { e.preventDefault(); if (password === process.env.NEXT_PUBLIC_CMS_PASSWORD) setIsAuthenticated(true); else alert('Incorrect password'); };
    const addBlock = (type: BlockType) => { let v = {}; if (['h1', 'h2', 'h3'].includes(type)) v = { text: '' }; if (type === 'p') v = { html: '' }; if (type === 'image') v = { url: '', caption: '' }; if (type === 'ctaButton') v = { text: '', url: '' }; setContent(prev => [...prev, { id: `block_${Date.now()}_${Math.random()}`, type, value: v }]); };
    const updateBlock = (id: string, newValues: object) => setContent(prev => prev.map(b => b.id === id ? { ...b, value: { ...b.value, ...newValues } } : b));
    const deleteBlock = (id: string) => setContent(prev => prev.filter(b => b.id !== id));
    const handleDragEnd = (event: any) => { const { active, over } = event; if (over && active.id !== over.id) { setContent(items => { const oldIndex = items.findIndex(i => i.id === active.id); const newIndex = items.findIndex(i => i.id === over.id); return arrayMove(items, oldIndex, newIndex); }); } };
    
    const resetForm = () => {
        setTitle(''); setSlug(''); setAuthor(''); setFeaturedImageUrl(''); setContent([]); 
        setSelectedCategories([]); setSelectedTags([]); setEditingPostId(null); setFormError(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    const handleLoadPostForEdit = (post: IPost) => {
        setEditingPostId(post._id.toString());
        setTitle(post.title); setSlug(post.slug); setAuthor(post.author);
        setFeaturedImageUrl(post.featuredImageUrl || ''); setContent(post.content);
        const postCategoryIds = (post.categories as any[]).map(c => typeof c === 'string' ? c : c._id.toString());
        const postTagIds = (post.tags as any[]).map(t => typeof t === 'string' ? t : t._id.toString());
        setSelectedCategories(allCategories.filter(opt => postCategoryIds.includes(opt.value)));
        setSelectedTags(allTags.filter(opt => postTagIds.includes(opt.value)));
        setFormError(null); window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setIsSubmitting(true); setFormError(null);
        const body = { title, slug, author, featuredImageUrl, content, categories: selectedCategories.map(c => c.value), tags: selectedTags.map(t => t.value) };
        const isUpdating = !!editingPostId;
        const url = isUpdating ? `/api/posts/${editingPostId}` : '/api/posts';
        const method = isUpdating ? 'PUT' : 'POST';
        try {
            const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            const data = await response.json();
            if (response.ok) {
                alert(`Post successfully ${isUpdating ? 'updated' : 'published'}!`);
                resetForm();
                await fetchInitialData();
            } else { setFormError(data.message || 'An error occurred.'); }
        } catch (error) { setFormError('A network error occurred.');
        } finally { setIsSubmitting(false); }
    };

    const handleDelete = async (postId: string) => {
        if (!window.confirm("Are you sure?")) return;
        setFormError(null);
        try { 
            const response = await fetch(`/api/posts/${postId}`, { method: 'DELETE' }); 
            if (response.ok) {
                alert("Post deleted successfully.");
                await fetchInitialData();
            } else {
                const data = await response.json();
                setFormError(data.message || "Failed to delete post.");
            }
        } catch(e){ setFormError("Error deleting post."); }
    };
    
    if (!isMounted) return null;
    if (!isAuthenticated) return (<div className="min-h-screen flex items-center justify-center bg-gray-900"><form onSubmit={handlePasswordSubmit} className="bg-gray-800 p-8 rounded-lg w-full max-w-sm"><h1 className="text-white text-2xl mb-4 text-center">CMS Access</h1><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 rounded bg-gray-700" placeholder="Password" /><button type="submit" className="w-full mt-4 bg-blue-600 text-white p-2 rounded">Login</button></form></div>);

    const selectStyles = { control: (s:any) => ({...s, backgroundColor: '#4a5568', border: '1px solid #718096'}), multiValue: (s:any) => ({...s, backgroundColor: '#2d3748'}), multiValueLabel: (s:any) => ({...s, color: '#e2e8f0'}), multiValueRemove: (s:any) => ({...s, color: '#cbd5e0', ':hover': { backgroundColor: '#e53e3e', color: 'white'}}), option: (s:any, {isFocused}:any) => ({...s, backgroundColor: isFocused ? '#2d3748' : '#4a5568', color: '#e2e8f0'}), menu: (s:any) => ({...s, backgroundColor: '#4a5568'}) };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
            <div className="max-w-7xl mx-auto lg:grid lg:grid-cols-2 lg:gap-8">
                <div className="lg:col-span-1">
                    <div className="flex justify-between items-center mb-6"><h1 className="text-3xl font-bold">{editingPostId ? 'Edit Post' : 'Create New Post'}</h1>{editingPostId && (<button onClick={resetForm} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded">+ Create New</button>)}</div>
                    {formError && <div className="mb-4 p-3 rounded bg-red-800 text-white"><p className="font-bold">Error</p><p>{formError}</p></div>}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="p-4 bg-gray-800 rounded-lg space-y-4">
                            <h2 className="text-xl font-semibold">Post Details</h2>
                            <div><label className="block text-sm mb-1">Title</label><input type="text" value={title} onChange={handleTitleChange} required className="w-full p-2 rounded bg-gray-700 border-gray-600" /></div>
                            <div><label className="block text-sm mb-1">Featured Image</label><ImageUploader value={{url: featuredImageUrl, caption: ''}} onUpdate={(v: any) => setFeaturedImageUrl(v.url)} setFormError={setFormError} /></div>
                            <div><label className="block text-sm mb-1">Slug</label><input type="text" value={slug} onChange={e => setSlug(e.target.value)} required className="w-full p-2 rounded bg-gray-700" /></div>
                            <div><label className="block text-sm mb-1">Author</label><input type="text" value={author} onChange={e => setAuthor(e.target.value)} required className="w-full p-2 rounded bg-gray-700" /></div>
                            <div><label className="block text-sm mb-1">Categories</label><CreatableSelect instanceId="categories-select" isMulti options={allCategories} value={selectedCategories} onChange={(v) => setSelectedCategories(v)} onCreateOption={(val) => handleCreateOption(val, 'categories')} isDisabled={isCreating || isPostsLoading} isLoading={isCreating} styles={selectStyles} className="text-black" /></div>
                            <div><label className="block text-sm mb-1">Tags</label><CreatableSelect instanceId="tags-select" isMulti options={allTags} value={selectedTags} onChange={(v) => setSelectedTags(v)} onCreateOption={(val) => handleCreateOption(val, 'tags')} isDisabled={isCreating || isPostsLoading} isLoading={isCreating} styles={selectStyles} className="text-black" /></div>
                        </div>
                        <div className="p-4 bg-gray-800 rounded-lg"><h2 className="text-xl font-semibold mb-4">Content Builder</h2><DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}><SortableContext items={content} strategy={verticalListSortingStrategy}><div className="space-y-4">{content.map(block => <SortableBlock key={block.id} block={block} onUpdate={updateBlock} onDelete={deleteBlock} setFormError={setFormError} />)}</div></SortableContext></DndContext><div className="mt-6 border-t border-gray-600 pt-4 flex flex-wrap gap-3"><button type="button" onClick={() => addBlock('h1')} className="px-3 py-2 text-sm bg-blue-600 rounded">Add H1</button><button type="button" onClick={() => addBlock('h2')} className="px-3 py-2 text-sm bg-blue-600 rounded">Add H2</button><button type="button" onClick={() => addBlock('h3')} className="px-3 py-2 text-sm bg-blue-600 rounded">Add H3</button><button type="button" onClick={() => addBlock('p')} className="px-3 py-2 text-sm bg-blue-600 rounded">Add Paragraph</button><button type="button" onClick={() => addBlock('image')} className="px-3 py-2 text-sm bg-indigo-600 rounded">Add Image</button><button type="button" onClick={() => addBlock('ctaButton')} className="px-3 py-2 text-sm bg-indigo-600 rounded">Add CTA Button</button></div></div>
                        <button type="submit" disabled={isSubmitting || isPostsLoading} className="w-full bg-green-600 hover:bg-green-700 font-bold py-3 rounded text-lg disabled:bg-gray-500">{isSubmitting ? 'Saving...' : (editingPostId ? 'Update Post' : 'Publish Post')}</button>
                    </form>
                </div>
                <div className="lg:col-span-1"><PublishedPostsTable posts={posts} isLoading={isPostsLoading} onEdit={handleLoadPostForEdit} onDelete={handleDelete} /></div>
            </div>
        </div>
    );
};
export default CreatePostPage;