import React from 'react';
import Link from 'next/link';

const AdminDashboardPage = () => {
  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-white mb-4">
        Welcome to the Admin Panel
      </h1>
      <p className="text-lg text-gray-300 mb-8">
        Select an option from the sidebar to manage your content.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/admin/create-post" className="block p-6 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
          <h2 className="text-xl font-semibold text-white">Create a New Post</h2>
          <p className="text-blue-200 mt-2">Write and publish a new blog article.</p>
        </Link>
        <Link href="/admin/banner-update" className="block p-6 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
          <h2 className="text-xl font-semibold text-white">Manage Banners</h2>
          <p className="text-gray-300 mt-2">Update the promotional banners on the site.</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboardPage;