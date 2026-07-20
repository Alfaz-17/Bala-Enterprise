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
    <div className="bg-[#FAF9F6] min-h-screen text-[#1A1A18] relative overflow-hidden">
      {/* Engineering blueprint dot grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#E5E4DE_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />
      {/* Page Header — Side-by-side text + image on ALL screens */}
      <div className="relative bg-[#1A1A18] text-white overflow-hidden py-8 sm:py-12 md:py-16 lg:py-20 border-b border-[#2A2A28]">
        <div className="absolute top-0 right-0 h-full w-[42%] sm:w-[45%] lg:w-[50%] bg-[#1A1A18] origin-top-right transform skew-x-[-12deg] sm:skew-x-[-15deg] translate-x-[8%] sm:translate-x-[10%] z-0 overflow-hidden border-l border-white/10">
          <div className="absolute inset-0 transform skew-x-[12deg] sm:skew-x-[15deg] -translate-x-[8%] sm:-translate-x-[10%] w-[130%] h-full">
            <Image
              src="/Image_from_internet/pexels-pixabay-236709.jpg"
              alt="Bala Enterprise Blog"
              fill
              priority
              className="object-cover object-center opacity-60 sm:opacity-70 hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-[#D85A30]/30 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A18] via-[#1A1A18]/40 to-transparent" />
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-[55%] sm:max-w-[50%] lg:max-w-[60%] space-y-2 sm:space-y-3">
            <span className="text-[#D85A30] text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] font-bold block">
              Knowledge & Insights
            </span>
            <h1 className="font-heading text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] text-white">
              Blog & Resources
            </h1>
            <p className="text-[11px] sm:text-sm text-white/80 max-w-xl leading-relaxed">
              Read expert articles, crane safety guidelines, and updates from the material handling industry.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {posts.length === 0 ? (
          <div className="text-center py-20 bg-[#F5F4F0] border border-border">
            <p className="text-[#888780] text-sm">No articles published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 py-10 pb-32">
            {posts.map((post) => (
              <div 
                key={post._id} 
                className="group flex flex-col transition-all duration-300 h-[280px] sm:h-[380px] lg:h-[440px]"
              >
                {/* Blog Image Area (70% height) */}
                <div className="relative h-[70%] bg-[#F5F4F0] rounded-md overflow-hidden">
                  {post.featuredImage ? (
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-[#888780] bg-[#F5F4F0]">
                      No Image Available
                    </div>
                  )}
                </div>
                {/* Blog Info Area (30% height) */}
                <div className="h-[30%] pt-2 sm:pt-3 pb-1 flex flex-col justify-between space-y-1 sm:space-y-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 sm:gap-4 text-[8px] sm:text-[10px] text-[#888780] uppercase tracking-[0.12em] sm:tracking-[0.15em] font-semibold">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-[#D85A30]" />
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3 text-[#D85A30]" />
                        Admin
                      </span>
                    </div>
                    <h3 className="font-heading text-xs sm:text-sm lg:text-base font-bold text-[#1A1A18] group-hover:text-[#D85A30] transition-colors line-clamp-2 leading-tight">
                    {post.title}
                  </h3>
                </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.12em] sm:tracking-[0.15em] text-[#D85A30] inline-flex items-center gap-1 border-b border-[#D85A30] pb-0.5 hover:border-transparent transition-colors duration-300 w-fit mt-auto"
                  >
                    Read Full Article
                    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
