'use client'; // Marks this as an interactive Client Component

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { NewsArticleSummary } from '@/lib/types';

interface NewsListingClientProps {
  initialNews: NewsArticleSummary[];
}

export default function NewsListingClient({ initialNews }: NewsListingClientProps) {
  const [allNews] = useState<NewsArticleSummary[]>(initialNews);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const categories = useMemo(() => {
    const keywordSet = new Set<string>();
    allNews.forEach(item => {
      if (item.keywords) {
        item.keywords.split(',').forEach(keyword => {
          const trimmed = keyword.trim();
          if (trimmed) keywordSet.add(trimmed);
        });
      }
    });
    return Array.from(keywordSet).sort();
  }, [allNews]);

  const filteredNews = useMemo(() => {
    if (selectedCategory === 'All') return allNews;
    return allNews.filter(item => 
      item.keywords?.split(',').map(k => k.trim()).includes(selectedCategory)
    );
  }, [allNews, selectedCategory]);

  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);

  const paginatedNews = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredNews.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredNews, currentPage]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString();
  };
  
  return (
    <>
      <main className="news-container">
        <h2 className="text-center mb-10 text-3xl font-bold uppercase">
          <span className="title-gradient">Latest News</span>
        </h2>

        {paginatedNews.length > 0 ? (
          <div className="news-list">
            {paginatedNews.map((item) => (
              <div key={item.id} className="news-card-wrapper">
                <div className="news-card">
                  <div className="card-image-container">
                    {item.image_url ? (
                      <Image src={item.image_url} alt={item.title} width={180} height={180} className="card-image"/>
                    ) : (
                      <div className="card-image-placeholder"><span>No Image</span></div>
                    )}
                  </div>
                  <div className="card-content">
                    <h3 className="news-title">{item.title}</h3>
                    <p className="news-date">{formatDate(item.pubDate)}</p>
                    <p className="news-description">{item.description?.slice(0, 150)}...</p>
                    <div className="card-footer">
                      <Link href={`/news/${item.slug}`} className="read-more-link">Read more</Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="loading-message">No news found for this category.</div>
        )}

        {totalPages > 1 && (
          <div className="pagination-controls">
            <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="page-btn">← Previous</button>
            <span className="page-info">Page {currentPage} / {totalPages}</span>
            <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage >= totalPages} className="page-btn">Next →</button>
          </div>
        )}
      </main>

      <aside className="sidebar">
        <h3 className="sidebar-title">Categories</h3>
        <ul className="category-list">
          <li><a href="#" className={`category-link ${selectedCategory === 'All' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setSelectedCategory('All'); setCurrentPage(1); }}>All</a></li>
          {categories.map((cat) => (
            <li key={cat}><a href="#" className={`category-link ${selectedCategory === cat ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setSelectedCategory(cat); setCurrentPage(1); }}>{cat}</a></li>
          ))}
        </ul>
      </aside>
    </>
  );
}