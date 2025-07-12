import { Inter } from 'next/font/google';
import './globals.css';
import NextTopLoader from 'nextjs-toploader'; // 1. Import the component

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'TodayLiveScores',
  description: 'Your go-to for live sports scores and statistics.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* 2. Add the TopLoader component right inside the body */}
        <NextTopLoader
          color="#3b82f6" // A nice blue color that matches your theme
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false} // Set to false to hide the default spinner icon
          easing="ease"
          speed={200}
          shadow="0 0 10px #3b82f6,0 0 5px #3b82f6"
        />
        {children}
      </body>
    </html>
  );
}