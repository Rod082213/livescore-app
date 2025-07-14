// src/app/layout.tsx

import { Inter } from 'next/font/google';
import './globals.css';
import NextTopLoader from 'nextjs-toploader';
import { Metadata } from 'next'; // It's good practice to import the type

const inter = Inter({ subsets: ['latin'] });

// 1. You export your metadata as a NAMED export. This is correct.
export const metadata: Metadata = {
  // The 'template' will be used by child pages. %s is replaced by the child's title.
  title: {
    default: 'TodayLiveScores', // Title for the homepage or pages without a title
    template: '%s | TodayLiveScores', // e.g., "Manchester United | TodayLiveScores"
  },
  description: 'Your go-to for live sports scores and statistics.',
};

// 2. You export the React Component as the DEFAULT export. This is required.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 3. The component MUST return JSX containing <html> and <body> tags.
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        
        <NextTopLoader
          color="#3b82f6"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #3b82f6,0 0 5px #3b82f6"
        />
        
        {/* The children prop is where your page content will be rendered */}
        {children}
        
      </body>
    </html>
  );
}