import Link from 'next/link';
import Header from '@/components/Header';
import SportsNav from '@/components/SportsNav';
import Footer from '@/components/Footer';
import BackButton from '@/components/BackButton';
import Image from 'next/image';
import { IPost, ICategory, ITag } from '@/models/Post';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import Category from '@/models/Category';
import Tag from '@/models/Tag';
import { unstable_noStore as noStore } from 'next/cache';

async function getBlogPageData() {
    noStore();
    await dbConnect();

    const [posts, categories, tags] = await Promise.all([
        Post.find({}).sort({ createdAt: -1 }).populate('categories', 'name').lean(),
        Category.find({}).sort({ name: 1 }).lean(),
        Tag.find({}).sort({ name: 1 }).lean()
    ]);

    return { 
        posts: JSON.parse(JSON.stringify(posts)), 
        categories: JSON.parse(JSON.stringify(categories)), 
        tags: JSON.parse(JSON.stringify(tags)) 
    };
}

const PostCard = ({ post }: { post: IPost }) => {
    const summary = post.content?.find(b => b.type === 'p')?.value.html.replace(/<[^>]*>/g, '').slice(0, 100) + '...' || 'Read more';
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
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 group-hover:scale-105"
                />
            </div>
            <div className="p-5 flex flex-col">
                <h2 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors flex-grow">
                    {post.title}
                </h2>
                <p className="text-gray-400 text-sm mb-4">
                    {summary}
                </p>
                <div className="text-xs text-gray-500 border-t border-gray-700 pt-3 mt-auto">
                    <span>By {post.author}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
        </Link>
    );
};

const Sidebar = ({ categories, tags }: { categories: ICategory[], tags: ITag[] }) => (
    <aside className="lg:col-span-3">
        <div className="sticky top-24 space-y-8">
            <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-3">Categories</h3>
                <ul className="space-y-2">
                    {categories.map(cat => (
                        <li key={cat._id.toString()}>
                            <Link href={`/blog/category/${cat.name.toLowerCase()}`} className="text-gray-300 hover:text-blue-400 transition-colors block">
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
                        <Link key={tag._id.toString()} href={`/blog/tag/${tag.name.toLowerCase()}`} className="bg-gray-700 text-gray-300 text-xs font-medium px-3 py-1 rounded-full hover:bg-gray-600 transition-colors">
                            #{tag.name}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    </aside>
);

export default async function BlogListPage() {
    const { posts, categories, tags } = await getBlogPageData();

    return (
        <div className="bg-[#1d222d] text-white min-h-screen">
            
        <Header />
           <SportsNav />
            <div className="container mx-auto px-4 py-12">
            
   
        <BackButton />
    

    {/* The title remains perfectly centered in the parent container */}
    <h1 className="text-4xl md:text-5xl font-extrabold border-b border-gray-700 pb-4 mb-4">
        Blogs
    </h1>

                
                <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-8">
                    <main className="lg:col-span-9">
                        {posts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {posts.map((post) => (
                                    <PostCard key={post._id.toString()} post={post} />
                                ))}
                            </div>
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

export const metadata = {
  title: 'Blog | All Posts',
  description: 'Browse all the latest articles, categories, and tags.',
};