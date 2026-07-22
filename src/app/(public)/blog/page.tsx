import { connectToDatabase } from '@/lib/mongoose';
import { BlogPost } from '@/models/BlogPost';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog & Articles | Bala Enterprise',
  description:
    'Read expert articles, crane maintenance checklists, safety guidelines, and industrial material handling updates from Bala Enterprise.',
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
    <div className="bg-[#F7EBDD] min-h-screen text-[#131312] relative overflow-hidden">
      {/* Engineering blueprint dot grid */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(circle at 2px 2px, #E5E4DE 1px, transparent 0)', 
          backgroundSize: '20px 20px' 
        }} 
      />

      {/* Page Header */}
      <div className="relative bg-[#1A1A18] text-white overflow-hidden py-10 sm:py-16 md:py-20 border-b border-[#2A2A28]">
        {/* Dot pattern overlay inside header */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none z-10" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', 
            backgroundSize: '20px 20px' 
          }} 
        />

        <div className="absolute top-0 right-0 h-full w-[38%] sm:w-[45%] lg:w-[50%] bg-[#1A1A18] origin-top-right transform skew-x-[-12deg] sm:skew-x-[-15deg] translate-x-[8%] sm:translate-x-[10%] z-0 overflow-hidden border-l border-white/10">
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
        
        <div className="section-container relative z-10 w-full">
          <div className="max-w-[65%] sm:max-w-[55%] lg:max-w-[60%] space-y-2 sm:space-y-3">
            <p className="label-tech text-[#D85A30] block">
              Knowledge & Articles
            </p>
            <h1 className="heading-display uppercase text-white font-black">
              Blog & <span className="text-[#D85A30] italic font-medium">Resources.</span>
            </h1>
            <p className="body-text text-white/80 max-w-xl text-xs sm:text-sm leading-relaxed">
              Read expert articles, crane safety guidelines, and updates from the material handling industry.
            </p>
          </div>
        </div>
      </div>

      <div className="section-container py-12 sm:py-16 relative z-10">
        {posts.length === 0 ? (
          <div className="text-center py-20 bg-white border border-black/10">
            <p className="body-text text-muted-foreground text-sm">No articles published yet.</p>
          </div>
        ) : (
          /* 2-Columns on Mobile for Native Mobile Grid */
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 pb-20">
            {posts.map((post) => (
              <div 
                key={post._id} 
                className="group flex flex-col transition-all duration-300 h-[280px] sm:h-[380px] lg:h-[420px] bg-white border border-black/10 p-3 sm:p-4 relative hover:border-[#D85A30]/40 shadow-sm"
              >
                {/* Blog Image Area */}
                <div className="relative h-[55%] sm:h-[60%] bg-[#FCF6ED] overflow-hidden">
                  {post.featuredImage ? (
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] sm:text-xs text-muted-foreground bg-[#FCF6ED]">
                      No Image
                    </div>
                  )}
                </div>
                {/* Blog Info Area */}
                <div className="h-[45%] sm:h-[40%] pt-2.5 sm:pt-4 flex flex-col justify-between">
                  <div className="space-y-1 sm:space-y-2">
                    <div className="flex items-center gap-2 text-[9px] sm:text-[10px] text-muted-foreground uppercase font-sans font-semibold">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-[#D85A30]" />
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-heading text-xs sm:text-sm font-bold text-[#131312] group-hover:text-[#D85A30] transition-colors line-clamp-2 leading-tight sm:leading-snug">
                      {post.title}
                    </h3>
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="label-tech !text-[#D85A30] !text-[9px] sm:!text-[10px] flex items-center gap-1 mt-auto group-hover:underline"
                  >
                    Read Article
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
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
