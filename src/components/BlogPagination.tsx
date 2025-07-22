// src/components/Pagination.tsx

import Link from 'next/link';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    baseUrl?: string;
}

const BlogPagination = ({ currentPage, totalPages, baseUrl = '/blog' }: PaginationProps) => {
    if (totalPages <= 1) {
        return null; // Don't show pagination if there's only one page
    }

    const prevPage = currentPage - 1;
    const nextPage = currentPage + 1;

    const hasPrev = currentPage > 1;
    const hasNext = currentPage < totalPages;

    return (
        <nav className="flex items-center justify-center gap-4 mt-12" aria-label="Pagination">
            {/* Previous Button */}
            <Link 
                href={hasPrev ? `${baseUrl}?page=${prevPage}` : '#'}
                className={`flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-gray-800 border-0 border-l border-gray-700 rounded-l-lg hover:bg-gray-700 hover:text-white transition-colors ${!hasPrev ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-disabled={!hasPrev}
                tabIndex={!hasPrev ? -1 : undefined}
                onClick={(e) => !hasPrev && e.preventDefault()}
            >
                <svg className="w-3.5 h-3.5 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5H1m0 0l4 4M1 5l4-4"/>
                </svg>
                Previous
            </Link>

            {/* Page Info */}
            <span className="text-sm text-gray-400">
                Page <span className="font-semibold text-white">{currentPage}</span> of <span className="font-semibold text-white">{totalPages}</span>
            </span>

            {/* Next Button */}
            <Link 
                href={hasNext ? `${baseUrl}?page=${nextPage}` : '#'}
                className={`flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-gray-800 border-0 border-l border-gray-700 rounded-r-lg hover:bg-gray-700 hover:text-white transition-colors ${!hasNext ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-disabled={!hasNext}
                tabIndex={!hasNext ? -1 : undefined}
                onClick={(e) => !hasNext && e.preventDefault()}
            >
                Next
                <svg className="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                </svg>
            </Link>
        </nav>
    );
};

export default BlogPagination;