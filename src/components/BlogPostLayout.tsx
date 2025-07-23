import Image from 'next/image';
import Link from 'next/link';
import { IPost, IContentBlock, ICategory } from '@/models/Post';
import BackButton from './BackButton';
import TableOfContents from './TableOfContents';

const generateSlug = (text: string) =>
  text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

const ContentRenderer = ({ blocks }: { blocks: IContentBlock[] }) => (
  <div className="prose prose-invert max-w-none prose-h2:mt-10 prose-h2:mb-4 prose-p:text-gray-300 prose-a:text-blue-400">
    {blocks.map((block, index) => {
      switch (block.type) {
        case 'header':
          const Tag = `h${block.data.level}` as keyof JSX.IntrinsicElements;
          const id = generateSlug(block.data.text);
          return <Tag key={index} id={id}>{block.data.text}</Tag>;
        case 'paragraph':
          return <p key={index} dangerouslySetInnerHTML={{ __html: block.data.text }} />;
        case 'list':
          const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
          return (
            <ListTag key={index} className="text-gray-300">
              {block.data.items.map((item: string, i: number) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
              ))}
            </ListTag>
          );
        default:
          return null;
      }
    })}
  </div>
);

const PostSidebar = ({ categories }: { categories?: ICategory[] }) => (
  <div className="space-y-8">
    <div className="p-4 bg-[#283040] rounded-lg border border-gray-700">
      <h3 className="font-bold text-white mb-3 text-sm tracking-wider">CATEGORIES</h3>
      <div className="flex flex-wrap gap-2">
        {categories?.map(cat => (
          <Link key={cat._id.toString()} href={`/blog/category/${encodeURIComponent(cat.name.toLowerCase())}`} className="bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-md hover:bg-blue-700 capitalize">
            {cat.name}
          </Link>
        ))}
      </div>
    </div>
  </div>
);

export default function BlogPostLayout({ post }: { post: IPost }) {
  const publicDomain = 'https://todaylivescores.com';
  let imageUrl = `${publicDomain}/placeholder-image.jpg`;
  if (post.featuredImageUrl) {
    try {
      const imagePath = new URL(post.featuredImageUrl, publicDomain).pathname;
      imageUrl = `${publicDomain}${imagePath}`;
    } catch { /* use placeholder */ }
  }

  const headings = post.content.blocks.filter(b => b.type === 'header');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <BackButton href="/blog" text="← Back to Blogs" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12">
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24">
            <TableOfContents headings={headings} />
          </div>
        </aside>

        <main className="lg:col-span-6">
          <article>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">{post.title}</h1>
            <p className="text-gray-400 mb-8">
              By {post.author || 'Staff'} on {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <div className="relative w-full h-80 rounded-lg overflow-hidden mb-8">
              <Image src={imageUrl} alt={post.title} fill className="object-cover" />
            </div>
            <ContentRenderer blocks={post.content.blocks} />
          </article>
        </main>

        <aside className="lg:col-span-3">
          <div className="sticky top-24">
            <PostSidebar categories={post.categories} />
          </div>
        </aside>
      </div>
    </div>
  );
}