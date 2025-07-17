import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { IPost, ICategory, ITag } from '@/models/Post'; // Import ITag
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import Category from '@/models/Category';
import Tag from '@/models/Tag'; // Import Tag

const PostCard = ({ post }: { post: IPost }) => {
    // FIX: Access post.content.blocks for the summary
    const summary = post.content?.blocks?.find(b => b.type === 'paragraph')?.data.text.replace(/<[^>]*>/g, '').slice(0, 100) + '...' || 'Click to read more.';

    return (
        <Link href={`/blog/${post.slug}`} className="block group bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="relative w-full h-48">
                <Image src={post.featuredImageUrl || '/placeholder-image.jpg'} alt={post.title} layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" />
            </div>
            <div className="p-5 flex flex-col">
                <h2 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors flex-grow">{post.title}</h2>
                <p className="text-gray-400 text-sm mb-4 h-10 overflow-hidden">{summary}</p>
                <div className="text-xs text-gray-500 border-t border-gray-700 pt-3 mt-auto">
                    <span>By {post.author}</span><span className="mx-2">•</span><span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
        </Link>
    );
};

// Reusable Sidebar component (defined once here, used on both archive pages)
const Sidebar = ({ categories, tags }: { categories: ICategory[], tags: ITag[] }) => (
    <aside className="lg:col-span-3">
        <div className="sticky top-24 space-y-8">
            <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-3">Categories</h3>
                <ul className="space-y-2">
                    {categories.map(cat => (<li key={cat._id.toString()}><Link href={`/blog/category/${cat.name.toLowerCase()}`} className="text-gray-300 hover:text-blue-400 transition-colors block">{cat.name}</Link></li>))}
                </ul>
            </div>
            <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">{tags.map(tag => (<Link key={tag._id.toString()} href={`/blog/tag/${tag.name.toLowerCase()}`} className="bg-gray-700 text-gray-300 text-xs font-medium px-3 py-1 rounded-full hover:bg-gray-600 transition-colors">#{tag.name}</Link>))}</div>
            </div>
        </div>
    </aside>
);

async function getCategoryData(categorySlug: string) {
    await dbConnect();
    const category = await Category.findOne({ name: { $regex: new RegExp(`^${categorySlug}$`, 'i') } }).lean();
    if (!category) return null;

    // Fetch posts AND all categories/tags in parallel
    const [posts, allCategories, allTags] = await Promise.all([
        Post.find({ categories: category._id }).sort({ createdAt: -1 }).lean(),
        Category.find({}).sort({ name: 1 }).lean(),
        Tag.find({}).sort({ name: 1 }).lean()
    ]);

    return {
        category: JSON.parse(JSON.stringify(category)),
        posts: JSON.parse(JSON.stringify(posts)),
        allCategories: JSON.parse(JSON.stringify(allCategories)),
        allTags: JSON.parse(JSON.stringify(allTags))
    };
}

export default async function CategoryArchivePage({ params }: { params: { slug: string } }) {
    const categorySlug = decodeURIComponent(params.slug);
    const data = await getCategoryData(categorySlug);

    if (!data) {
        notFound();
    }

    const { category, posts, allCategories, allTags } = data;

    return (
        <div className="bg-gray-900 text-white min-h-screen">
            <div className="container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <p className="text-blue-400 font-semibold uppercase tracking-wider">Category</p>
                    <h1 className="text-4xl md:text-5xl font-extrabold capitalize">{category.name}</h1>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-8">
                    <main className="lg:col-span-9">
                        {posts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {posts.map((post) => (<PostCard key={post._id.toString()} post={post} />))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-gray-800 rounded-lg"><p className="text-gray-400 text-lg">No posts found in this category yet.</p></div>
                        )}
                    </main>
                    <Sidebar categories={allCategories} tags={allTags} />
                </div>
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