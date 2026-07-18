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
      {/* Page Header (Slanted High-Contrast Style) */}
      <div className="relative bg-[#1A1A18] text-white overflow-hidden py-16 md:py-20 border-b border-[#2A2A28]">
        {/* Slanted Design Background shape */}
        <div className="absolute top-0 right-0 h-full w-[45%] bg-[#D85A30] origin-top-right transform skew-x-[-15deg] translate-x-[15%] z-0 hidden lg:block" />
        <div className="absolute inset-0 bg-[#D85A30] z-0 lg:hidden opacity-90" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-8 space-y-3">
            <span className="text-[#D85A30] lg:text-primary text-xs uppercase tracking-[0.2em] font-bold block">
              Knowledge & Insights
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-black tracking-tight leading-none text-white">
              Blog & Resources
            </h1>
            <p className="text-sm text-white/80 max-w-xl">
              Read expert articles, crane safety guidelines, and updates from the material handling industry.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-20 bg-[#F5F4F0] border border-border">
            <p className="text-[#888780] text-sm">No articles published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 py-10 pb-32">
            {posts.map((post, idx) => (
              <div 
                key={post._id} 
                className={`group flex flex-col transition-all duration-300 h-[440px] ${
                  idx % 3 === 0 ? 'lg:translate-y-4' : idx % 3 === 2 ? 'lg:translate-y-8' : ''
                }`}
              >
                {/* Blog Image Area (70% height) */}
                <div className="relative h-[70%] bg-[#F5F4F0] rounded-md overflow-hidden">
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
                {/* Blog Info Area (30% height) */}
                <div className="h-[30%] pt-3 pb-1 flex flex-col justify-between space-y-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-4 text-[10px] text-[#888780] uppercase tracking-[0.15em] font-semibold">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-[#D85A30]" />
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3 text-[#D85A30]" />
                        Admin
                      </span>
                    </div>
                    <h3 className="font-heading text-base font-bold text-[#1A1A18] group-hover:text-[#D85A30] transition-colors line-clamp-2 leading-tight">
                      {post.title}
                    </h3>
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#D85A30] inline-flex items-center gap-1 border-b border-[#D85A30] pb-0.5 hover:border-transparent transition-colors duration-300 w-fit mt-auto"
                  >
                    Read Full Article
                    <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
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
