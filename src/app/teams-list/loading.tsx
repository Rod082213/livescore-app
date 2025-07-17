// src/app/teams-list/loading.tsx

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SportsNav from '@/components/SportsNav';
import BackButton from "@/components/BackButton";

// A simple skeleton component for a card
const SkeletonCard = () => (
  <div className="bg-[#2b3341] p-4 rounded-lg flex flex-col items-center justify-center animate-pulse">
    <div className="h-16 w-16 bg-gray-600 rounded-full mb-3"></div>
    <div className="h-4 w-24 bg-gray-600 rounded-md"></div>
  </div>
);

// A skeleton for the sidebar widgets
const SidebarSkeleton = () => (
  <div className="space-y-4">
    <div className="bg-[#2b3341] p-4 rounded-lg animate-pulse space-y-3">
      <div className="h-5 w-3/4 bg-gray-600 rounded-md"></div>
      <div className="h-12 w-full bg-gray-700 rounded-md"></div>
      <div className="h-12 w-full bg-gray-700 rounded-md"></div>
    </div>
    <div className="bg-[#2b3341] p-4 rounded-lg animate-pulse space-y-3">
      <div className="h-5 w-1/2 bg-gray-600 rounded-md"></div>
      <div className="h-20 w-full bg-gray-700 rounded-md"></div>
    </div>
  </div>
);

export default function Loading() {
  return (
    <div className="bg-[#1d222d] text-gray-200 min-h-screen">
      <Header />
      <SportsNav />
      <div className="container mx-auto px-4 py-8">
        <BackButton text="Back to Teams List" />
        <h1 className="text-3xl font-bold text-white mb-8">All Teams By League</h1>
        
        <div className="lg:flex lg:gap-8">
          {/* Column 1: Left Sidebar Skeleton */}
          <aside className="w-full lg:w-72 lg:flex-shrink-0">
            <SidebarSkeleton />
          </aside>
            
          {/* Column 2: Main Content Skeleton */}
          <main className="w-full lg:flex-1 mt-8 lg:mt-0">
            <div className="space-y-10">
              {/* Simulate two loading league sections */}
              {[1, 2].map((i) => (
                <div key={i}>
                  <div className="h-8 w-1/2 bg-gray-700 rounded-md mb-4 animate-pulse"></div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <SkeletonCard key={j} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </main>
          
          {/* Column 3: Right Sidebar Skeleton */}
          <aside className="hidden lg:block lg:w-72 lg:flex-shrink-0">
             <SidebarSkeleton />
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}