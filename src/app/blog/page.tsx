import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import Category from '@/models/Category';
import Tag from '@/models/Tag';
import Header from '@/components/Header';
import SportsNav from '@/components/SportsNav';
import Footer from '@/components/Footer';
import BackButton from '@/components/BackButton';
import BlogPagination from '@/components/BlogPagination';
import { IPost, ICategory, ITag } from '@/models/Post';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Latest Sports News & Analysis | TodayLiveScores Blog',
  description: 'Explore in-depth articles, match previews, and expert analysis on football, basketball, and more.',
  alternates: { canonical: 'https://www.todaylivescores.com/blog' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Latest Sports News & Analysis | TodayLiveScores Blog',
    description: 'In-depth articles, match previews, and expert analysis.',
    url: '/blog',
    siteName: 'TodayLiveScores',
    images: [{ url: '/social-card-blog.png', width: 1200, height: 630, alt: 'TodayLiveScores Blog - Sports News and Analysis' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Latest Sports News & Analysis | TodayLiveScores Blog',
    description: 'In-depth articles, match previews, and expert analysis.',
    images: ['/social-card-blog.png'],
  },
};

// --- Data Fetching ---
async function getBlogPageData({ page = 1, limit = 6 }: { page: number; limit: number }) {
  await dbConnect();
  const skip = (page - 1) * limit;

  const [posts, categories, tags, totalPosts] = await Promise.all([
    Post.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('categories', 'name').lean(),
    Category.find({}).sort({ name: 1 }).lean(),
    Tag.find({}).sort({ name: 1 }).lean(),
    Post.countDocuments(),
  ]);

  return {
    posts: JSON.parse(JSON.stringify(posts)),
    categories: JSON.parse(JSON.stringify(categories)),
    tags: JSON.parse(JSON.stringify(tags)),
    totalPages: Math.ceil(totalPosts / limit),
    currentPage: page,
  };
}

// --- Components ---
const PostCard = ({ post }: { post: IPost }) => {
  const summary = (() => {
    if (Array.isArray(post.content)) {
      const pBlock = post.content.find(b => b.type === 'p');
      return pBlock?.value?.html?.replace(/<[^>]+>/g, '')?.slice(0, 100) + '...' || 'Read more';
    }
    return post.content?.value?.html?.replace(/<[^>]+>/g, '')?.slice(0, 100) + '...' || 'Read more';
  })();

  const firstCategory = post.categories?.[0] as ICategory | undefined;

  return (
    <Link href={`/blog/${post.slug}`} className="block group bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative w-full h-48">
        {firstCategory && (
          <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
            {firstCategory.name}
          </div>
        )}
        <Image
          src={post.featuredImageUrl || '/placeholder-image.jpg'}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-5 flex flex-col">
        <h2 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors flex-grow">
          {post.title}
        </h2>
        <p className="text-gray-400 text-sm mb-4">{summary}</p>
        <div className="text-xs text-gray-500 border-t border-gray-700 pt-3 mt-auto">
          <span>By {post.author}</span>
          <span className="mx-2">•</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </Link>
  );
};

const Sidebar = ({ categories, tags }: { categories: ICategory[]; tags: ITag[] }) => (
  <aside className="lg:col-span-3 space-y-8 sticky top-24">
    <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
      <h3 className="text-lg font-bold text-white mb-3">Categories</h3>
      <ul className="space-y-2">
        {categories.map(cat => (
          <li key={cat._id.toString()}>
            <Link href={`/blog/category/${encodeURIComponent(cat.name.toLowerCase())}`} className="text-gray-300 hover:text-blue-400 block">
              {cat.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
    <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
      <h3 className="text-lg font-bold text-white mb-3">Tags</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <Link key={tag._id.toString()} href={`/blog/tag/${encodeURIComponent(tag.name.toLowerCase())}`} className="bg-gray-700 text-gray-300 text-xs font-medium px-3 py-1 rounded-full hover:bg-gray-600">
            #{tag.name}
          </Link>
        ))}
      </div>
    </div>
  </aside>
);

// --- Page Component ---
export default async function BlogListPage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  const currentPage = Number(searchParams?.page) || 1;
  const postsPerPage = 6;

  const { posts, categories, tags, totalPages } = await getBlogPageData({
    page: currentPage,
    limit: postsPerPage,
  });

  return (
    <div className="bg-[#1d222d] text-white min-h-screen">
      <Header />
      <SportsNav />

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 md:relative">
          <div className="md:absolute md:left-0 md:top-1/2 md:-translate-y-1/2">
            <BackButton />
          </div>
          <h1 className="text-center text-4xl md:text-5xl font-extrabold pb-4 border-b border-gray-700 mt-4 md:mt-0">Our Blog</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-8">
          <main className="lg:col-span-9">
            {posts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {posts.map(post => (
                    <PostCard key={post._id.toString()} post={post} />
                  ))}
                </div>
                <BlogPagination currentPage={currentPage} totalPages={totalPages} />
              </>
            ) : (
              <div className="text-center py-20 bg-gray-800 rounded-lg">
                <p className="text-gray-400 text-lg">No posts found.</p>
                <p className="text-gray-500 mt-2">Check back later or create a new post in the CMS!</p>
              </div>
            )}
          </main>
          <Sidebar categories={categories} tags={tags} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
