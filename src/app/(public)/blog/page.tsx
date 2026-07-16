import { connectToDatabase } from '@/lib/mongoose';
import { BlogPost } from '@/models/BlogPost';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog & Resources | Bala Enterprise',
  description:
    'Read expert articles, gantry crane maintenance checklists, safety compliance guidelines, and industrial material handling updates.',
};

async function getBlogPosts() {
  await connectToDatabase();

  const posts = await BlogPost.find({ status: 'published' })
    .select('title slug featuredImage metaDescription publishedAt')
    .sort({ publishedAt: -1 })
    .lean();

  return posts.map((p) => ({
    ...p,
    _id: String(p._id),
    publishedAt: p.publishedAt ? p.publishedAt.toISOString() : '',
  }));
}

export default async function BlogIndexPage() {
  const posts = await getBlogPosts();

  return (
    <div className="bg-white min-h-screen">
      {/* Page Header */}
      <div className="bg-[#F5F4F0] border-b border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-4xl font-bold text-[#1A1A18]">
            Blog & Resources
          </h1>
          <p className="text-xs text-[#888780] mt-2">
            Read expert articles, crane safety guidelines, and updates from the material handling industry.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-20 bg-[#F5F4F0] border border-border">
            <p className="text-[#888780] text-sm">No articles published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div key={post._id} className="bg-white border border-border flex flex-col group h-full">
                <div className="relative h-48 bg-zinc-200 border-b border-border overflow-hidden">
                  {post.featuredImage ? (
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      sizes="(max-w-768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-[#888780] bg-[#F5F4F0]">
                      No Image Available
                    </div>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-4 text-[10px] text-[#888780] uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-[#D85A30]" />
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3 text-[#D85A30]" />
                        Admin
                      </span>
                    </div>
                    <h3 className="font-heading text-base font-bold text-[#1A1A18] group-hover:text-[#D85A30] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    {post.metaDescription && (
                      <p className="text-xs text-[#888780] line-clamp-3 leading-relaxed">
                        {post.metaDescription}
                      </p>
                    )}
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block w-full text-center py-2 bg-[#1A1A18] text-white text-xs font-semibold hover:bg-[#D85A30] transition-colors mt-auto"
                  >
                    Read Full Article
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
