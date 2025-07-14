'use client'; // This is correct for the form page

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
// Assuming you have this function in your api.ts
// import { generateArticleOnBackend } from '@/lib/api';

export default function GenerateNewsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ title: '', description: '', image_url: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // In a real app, you'd call your API function here:
      // const result = await generateArticleOnBackend(formData);
      
      // For now, let's use the direct fetch:
      const response = await fetch('http://127.0.0.1:8000/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error(`Generation failed: ${response.statusText}`);
      
      const result = await response.json();
      router.push(`/news/${result.slug}`);

    } catch (err: any) {
      console.error('Generation failed:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-[#1e1e1e] min-h-screen p-4 sm:p-6 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-[#2b3341] p-6 sm:p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-white title-gradient">
          Generate News Article
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ... all your input fields ... */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-300 text-sm font-bold mb-2">Title</label>
            <input id="title" name="title" type="text" placeholder="Enter article title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full p-3 bg-[#1d222d] text-gray-200 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition" required />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-300 text-sm font-bold mb-2">Description</label>
            <textarea id="description" name="description" placeholder="Enter a short description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full p-3 bg-[#1d222d] text-gray-200 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition" rows={4} required></textarea>
          </div>
          <div className="mb-6">
            <label htmlFor="image_url" className="block text-gray-300 text-sm font-bold mb-2">Image URL (Optional)</label>
            <input id="image_url" name="image_url" type="text" placeholder="https://example.com/image.jpg" value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})} className="w-full p-3 bg-[#1d222d] text-gray-200 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition" />
          </div>
          {error && <div className="text-red-400 p-3 bg-red-900/50 rounded-md">{error}</div>}
          <div className="text-center">
            <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto bg-green-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300">
              {isSubmitting ? 'Generating...' : 'Generate Article'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}