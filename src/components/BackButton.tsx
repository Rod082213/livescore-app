"use client"; // This directive is essential for using the router hook

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

const BackButton = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()} // This navigates to the previous page in history
      className="inline-flex items-center gap-2 px-3 py-2 mb-4 text-sm font-semibold text-gray-300 transition-colors bg-gray-800/50 rounded-md hover:bg-gray-700"
    >
      <ArrowLeft size={16} />
      Back to Matches
    </button>
  );
};

export default BackButton;