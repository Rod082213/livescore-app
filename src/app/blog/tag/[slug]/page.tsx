import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { IPost, ITag } from '@/models/Post';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import Tag from '@/models/Tag';

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

async function getTagData(tagSlug: string) {
    await dbConnect();
    const tag = await Tag.findOne({ name: { $regex: new RegExp(`^${tagSlug}$`, 'i') } }).lean();
    if (!tag) {
        return null;
    }
    const posts = await Post.find({ tags: tag._id }).sort({ createdAt: -1 }).lean();
    return {
        tag: JSON.parse(JSON.stringify(tag)),
        posts: JSON.parse(JSON.stringify(posts))
    };
}

export default async function TagArchivePage({ params }: { params: { slug: string } }) {
    const tagSlug = decodeURIComponent(params.slug);
    const data = await getTagData(tagSlug);

    if (!data) {
        notFound();
    }

    const { tag, posts } = data;

    return (
        <div className="bg-gray-900 text-white min-h-screen">
            <div className="container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <p className="text-indigo-400 font-semibold uppercase tracking-wider">Tag</p>
                    <h1 className="text-4xl md:text-5xl font-extrabold">
                        # {tag.name}
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
                        <p className="text-gray-400 text-lg">No posts found with this tag yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const tagSlug = decodeURIComponent(params.slug);
    const data = await getTagData(tagSlug);
    const tagName = data?.tag.name || 'Tag';

    return {
        title: `Posts Tagged: #${tagName}`,
        description: `Browse all articles tagged with #${tagName}.`,
    };
}