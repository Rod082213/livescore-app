// src/app/news/[slug]/page.tsx

import { notFound } from "next/navigation";
import { Metadata } from 'next';
import { fetchNewsBySlug } from "@/lib/news-api";
import ArticleBody from "@/components/ArticleBody"; // <-- IMPORT THE NEW COMPONENT
import BackToNewsButton from "@/components/BackToNewsButton";

type Props = { params: { slug: string } };

/**
 * Generates SEO metadata for the page <head> tag.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await fetchNewsBySlug(params.slug);

  if (!article) {
    return { title: "Article Not Found" };
  }

  const safeDescription = article.description ? article.description.slice(0, 160) : '';

  return {
    title: article.title || "Untitled Article",
    description: safeDescription,
    keywords: Array.isArray(article.keywords) ? article.keywords.join(', ') : article.keywords,
    openGraph: {
      title: article.title || "Untitled Article",
      description: safeDescription,
      images: [article.image_url || '/default-news-image.jpg'],
    },
  };
}

/**
 * This is the Page component. It fetches data and renders the client component.
 */
export default async function NewsArticlePage({ params }: Props) {
  // Fetch the data on the server
  const article = await fetchNewsBySlug(params.slug);

  if (!article) {
    notFound();
  }

  return (
    // This outer 'article' tag provides a semantic container for the page content.
    <article className="max-w-7xl mx-auto bg-[#2b3341] p-6 rounded-lg">
      <BackToNewsButton text="Back to All News" />
      
      {/* Pass the server-fetched data to the client component for rendering */}
      <ArticleBody article={article} />
    </article>
  );
}