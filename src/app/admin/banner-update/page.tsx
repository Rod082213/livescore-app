'use client';

import { useState, useEffect, useCallback } from 'react';
import { IBanner } from '@/models/Banner';

const LoadingSpinner = () => <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>;
const ImageUploader = ({ value, onChange, setFormError }: { value: string, onChange: (url: string) => void, setFormError: (msg: string | null) => void }) => {
  const [isUploading, setIsUploading] = useState(false);
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setFormError(null);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await response.json();
      if (data.success) {
        onChange(data.url);
      } else {
        setFormError(data.message || 'Upload failed');
      }
    } catch (error) {
      setFormError('An error occurred during upload.');
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <div className="p-4 bg-gray-700 rounded-lg">
      {value && <img src={value} alt="Banner preview" className="max-w-full h-auto rounded-md mb-4" />}
      <div className="flex items-center space-x-4">
        <label htmlFor="image-upload" className="flex-grow text-center cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">{isUploading ? 'Uploading...' : (value ? 'Change Image' : 'Select Image')}</label>
        {value && <button type="button" onClick={() => onChange('')} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Remove</button>}
        <input id="image-upload" type="file" accept="image/*" onChange={handleFileUpload} className="hidden" disabled={isUploading} />
      </div>
    </div>
  );
};

const BannerUpdatePage = () => {
  const [banners, setBanners] = useState<IBanner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [displayLocation, setDisplayLocation] = useState('homepage');
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);

  const fetchBanners = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/banners');
      if (res.ok) setBanners(await res.json());
    } catch (e) {
      setFormError('Failed to load banners.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const resetForm = () => {
    setEditingBannerId(null);
    setImageUrl('');
    setTargetUrl('');
    setDisplayLocation('homepage');
    setIsActive(true);
    setSortOrder(0);
    setFormError(null);
  };

  const handleLoadForEdit = (banner: IBanner) => {
    setEditingBannerId(banner._id.toString());
    setImageUrl(banner.imageUrl);
    setTargetUrl(banner.targetUrl);
    setDisplayLocation(banner.displayLocation);
    setIsActive(banner.isActive);
    setSortOrder(banner.sortOrder);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const body = { imageUrl, targetUrl, displayLocation, isActive, sortOrder };
    const url = editingBannerId ? `/api/banners/${editingBannerId}` : '/api/banners';
    const method = editingBannerId ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (res.ok) {
        alert(`Banner ${editingBannerId ? 'updated' : 'created'} successfully!`);
        resetForm();
        await fetchBanners();
      } else {
        const data = await res.json();
        setFormError(data.message || 'An error occurred.');
      }
    } catch (err) {
      setFormError('A network error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/banners/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Banner deleted successfully!');
        await fetchBanners();
      } else {
        const data = await res.json();
        setFormError(data.message || 'Failed to delete banner.');
      }
    } catch (err) {
      setFormError('A network error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const displayLocations = ['homepage', 'news', 'blog', 'all'];

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold mb-6">{editingBannerId ? 'Edit Banner' : 'Create New Banner'}</h1>
        {formError && <div className="mb-4 p-3 rounded bg-red-800 text-white"><p>{formError}</p></div>}
        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          <form onSubmit={handleSubmit} className="space-y-6 p-4 bg-gray-800 rounded-lg">
            <div><label className="block text-sm mb-1">Banner Image</label><ImageUploader value={imageUrl} onChange={setImageUrl} setFormError={setFormError} /></div>
            <div><label className="block text-sm mb-1">Target URL (Link)</label><input type="url" value={targetUrl} onChange={e => setTargetUrl(e.target.value)} required className="w-full p-2 rounded bg-gray-700" /></div>
            <div><label className="block text-sm mb-1">Display Location</label><select value={displayLocation} onChange={e => setDisplayLocation(e.target.value)} className="w-full p-2 rounded bg-gray-700"><option value="">Select Location</option>{displayLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}</select></div>
            <div><label className="block text-sm mb-1">Sort Order</label><input type="number" value={sortOrder} onChange={e => setSortOrder(Number(e.target.value))} className="w-full p-2 rounded bg-gray-700" /></div>
            <div className="flex items-center"><input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="h-4 w-4 rounded bg-gray-700" /><label className="ml-2 text-sm">Active</label></div>
            <div className="flex space-x-4"><button type="submit" disabled={isLoading} className="flex-grow bg-green-600 hover:bg-green-700 font-bold py-3 rounded text-lg">{isLoading ? 'Saving...' : (editingBannerId ? 'Update Banner' : 'Create Banner')}</button>{editingBannerId && <button type="button" onClick={resetForm} className="bg-gray-600 hover:bg-gray-500 font-bold py-3 px-6 rounded">Cancel</button>}</div>
          </form>
          <div className="p-4 bg-gray-800 rounded-lg mt-8 lg:mt-0"><h2 className="text-xl font-semibold mb-4">Current Banners</h2>{isLoading ? <LoadingSpinner /> : (<ul>{banners.map(banner => (<li key={banner._id.toString()} className="flex items-center justify-between p-2 hover:bg-gray-700 rounded-md"><div className="flex items-center"><img src={banner.imageUrl} alt="banner thumb" className="w-16 h-9 object-cover rounded-md mr-4" /><div><p className="font-semibold">{banner.displayLocation}</p><p className="text-xs text-gray-400 truncate max-w-xs">{banner.targetUrl}</p></div></div><div className="space-x-4"><button onClick={() => handleLoadForEdit(banner)} className="text-blue-400 hover:underline">Edit</button><button onClick={() => handleDelete(banner._id.toString())} className="text-red-400 hover:underline">Delete</button></div></li>))}</ul>)}</div>
        </div>
      </div>
    </div>
  );
};

export default BannerUpdatePage;