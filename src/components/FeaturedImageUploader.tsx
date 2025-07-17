'use client';

import { useState, useRef } from 'react';

interface FeaturedImageUploaderProps {
  value: string; // The URL of the current featured image
  onChange: (url: string) => void; // Callback to update the parent's state
  setFormError: (msg: string | null) => void; // Callback for global form errors
}

const FeaturedImageUploader = ({ value, onChange, setFormError }: FeaturedImageUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setFormError(null); // Clear previous errors
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        onChange(data.url); // Update parent state with the new URL
      } else {
        setFormError(`Featured image upload failed: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      setFormError('A network error occurred during featured image upload.');
      console.error('Featured image upload error:', error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Clear the file input field
      }
    }
  };

  return (
    <div className="space-y-2">
      {value && (
        <div className="relative w-full max-w-xs h-32 rounded-md overflow-hidden bg-gray-700 flex items-center justify-center my-2">
            <img src={value} alt="Featured image preview" className="object-cover w-full h-full" />
        </div>
      )}
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden" // Hide the default input
        accept="image/png, image/jpeg, image/webp, image/gif"
      />
      
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="w-full p-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm disabled:bg-gray-500 disabled:cursor-not-allowed"
      >
        {isUploading ? 'Uploading...' : (value ? 'Change Image' : 'Choose File')}
      </button>
    </div>
  );
};

export default FeaturedImageUploader;