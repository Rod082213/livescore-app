// src/components/Breadcrumbs.tsx
import { ChevronRight } from "lucide-react";
import Link from "next/link";

const Breadcrumbs = () => {
    return (
        // This container ensures the breadcrumbs align with the rest of your page content.
        <div className="container mx-auto px-4">
            {/* The flex container creates the horizontal layout for the trail. */}
            <nav className="flex items-center gap-2 text-sm text-gray-400 py-3 border-b border-gray-700/50">
                
                {/* The first part of the breadcrumb, linking back to the homepage. */}
                <Link href="/" className="hover:text-white transition-colors">
                    Football
                </Link>
                
                {/* The separator icon. */}
                <ChevronRight size={16} />

                {/* The current page location. It's not a link, so we use a span. */}
                <span className="text-white font-semibold">
                    Today's Matches
                </span>

            </nav>
        </div>
    );
};

export default Breadcrumbs;