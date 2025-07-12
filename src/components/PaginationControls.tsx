'use client'; // This component must be a client component to use hooks.

import { useRouter, useSearchParams } from 'next/navigation';

interface PaginationControlsProps {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalArticles: number;
  perPage: number;
}

export default function PaginationControls({
  hasNextPage,
  hasPrevPage,
  totalArticles,
  perPage,
}: PaginationControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get the current page number from the URL, default to 1 if not present.
  const page = searchParams.get('page') ?? '1';
  const totalPages = Math.ceil(totalArticles / perPage);

  return (
    <div className="flex justify-center items-center gap-4 mt-12">
      <button
        className="bg-gray-700 text-white font-bold py-2 px-6 rounded-lg disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors hover:bg-gray-600"
        disabled={!hasPrevPage}
        // Go to the previous page by updating the URL search parameter
        onClick={() => router.push(`/news?page=${Number(page) - 1}`)}
      >
        ← Previous
      </button>

      <div className="text-gray-300 font-semibold">
        Page {page} of {totalPages}
      </div>

      <button
        className="bg-gray-700 text-white font-bold py-2 px-6 rounded-lg disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors hover:bg-gray-600"
        disabled={!hasNextPage}
        // Go to the next page by updating the URL search parameter
        onClick={() => router.push(`/news?page=${Number(page) + 1}`)}
      >
        Next →
      </button>
    </div>
  );
}