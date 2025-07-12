import { Inter } from 'next/font/google';
import './globals.css';
import NextTopLoader from 'nextjs-toploader';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'LiveStats',
  description: 'Your go-to for live sports scores and statistics.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* 
        THE FIX: Add `suppressHydrationWarning={true}` to the body tag.
        This prevents browser extensions from causing a fatal hydration error.
      */}
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
        
        {children}
        
      </body>
    </html>
  );
}