import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { IPost, ICategory } from '@/models/Post';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import Category from '@/models/Category';

const PostCard = ({ post }: { post: IPost }) => {
    const summary = post.content?.find(b => b.type === 'p')?.value.html.replace(/<[^>]*>/g, '').slice(0, 100) + '...' || 'Click to read more.';

    return (
        <Link href={`/blog/${post.slug}`} className="block group bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="relative w-full h-48">
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
                <p className="text-gray-400 text-sm mb-4 h-10 overflow-hidden">{summary}</p>
                <div className="text-xs text-gray-500 border-t border-gray-700 pt-3 mt-auto">
                    <span>By {post.author}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
        </Link>
    );
};

async function getCategoryData(categorySlug: string) {
    await dbConnect();
    const category = await Category.findOne({ name: { $regex: new RegExp(`^${categorySlug}$`, 'i') } }).lean();
    if (!category) {
        return null;
    }
    const posts = await Post.find({ categories: category._id }).sort({ createdAt: -1 }).lean();
    return {
        category: JSON.parse(JSON.stringify(category)),
        posts: JSON.parse(JSON.stringify(posts))
    };
}

export default async function CategoryArchivePage({ params }: { params: { slug: string } }) {
    const categorySlug = decodeURIComponent(params.slug);
    const data = await getCategoryData(categorySlug);

    if (!data) {
        notFound();
    }

    const { category, posts } = data;

    return (
        <div className="bg-gray-900 text-white min-h-screen">
            <div className="container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <p className="text-blue-400 font-semibold uppercase tracking-wider">Category</p>
                    <h1 className="text-4xl md:text-5xl font-extrabold capitalize">
                        {category.name}
                    </h1>
                </div>
                
                {posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {posts.map((post) => (
                            <PostCard key={post._id.toString()} post={post} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-800 rounded-lg">
                        <p className="text-gray-400 text-lg">No posts found in this category yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const categorySlug = decodeURIComponent(params.slug);
    const data = await getCategoryData(categorySlug);
    const categoryName = data?.category.name || 'Category';
    
    return {
        title: `Posts in: ${categoryName}`,
        description: `Browse all articles filed under the category: ${categoryName}.`,
    };
}