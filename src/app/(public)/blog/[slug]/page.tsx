import { connectToDatabase } from '@/lib/mongoose';
import { BlogPost } from '@/models/BlogPost';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getBlogPostDetails(slug: string) {
  await connectToDatabase();

  const post = await BlogPost.findOne({ slug, status: 'published' }).lean();
  if (!post) return null;

  return {
    ...post,
    _id: String(post._id),
    publishedAt: post.publishedAt ? post.publishedAt.toISOString() : '',
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostDetails(slug);

  if (!post) {
    return {
      title: 'Article Not Found | Bala Enterprise',
    };
  }

  return {
    title: `${post.title} | Bala Enterprise Resources`,
    description: post.metaDescription || `Read the complete article: ${post.title}`,
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPostDetails(slug);

  if (!post) {
    notFound();
  }

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
              alt={post.title}
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
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[8px] sm:text-[10px] text-[#D85A30] uppercase tracking-wider">
              <span className="flex items-center gap-1 font-bold">
                <Calendar className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-[#D85A30]" />
                {new Date(post.publishedAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1 font-bold">
                <User className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-[#D85A30]" />
                Admin Author
              </span>
            </div>
            <h1 className="font-heading text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] text-white mt-1 sm:mt-2">
              {post.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#888780] hover:text-[#1A1A18] mb-8 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Blog
        </Link>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="relative h-[220px] sm:h-[350px] w-full bg-zinc-100 border border-border overflow-hidden mb-10 rounded-md">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              sizes="(max-w-768px) 100vw, 800px"
              priority
              className="object-cover"
            />
          </div>
        )}

        {/* Content */}
        <article className="prose max-w-none text-sm text-[#1A1A18] leading-relaxed whitespace-pre-wrap">
          {post.content}
        </article>

        {/* Quote CTA */}
        <div className="bg-white/40 backdrop-blur-sm border border-black/5 p-6 rounded-lg mt-16 text-center space-y-4 relative overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
          {/* Corner Tag Accent */}
          <div className="absolute top-0 left-0 w-1.5 h-4 bg-[#D85A30]" />
          <h3 className="font-heading text-xl sm:text-2xl font-black text-[#1A1A18]">Need Customized Lifting Equipment Advice?</h3>
          <p className="text-sm text-[#888780] max-w-md mx-auto leading-relaxed">
            Get in touch with our factory experts today for tailored technical crane specifications and price quotes.
          </p>
          <Link
            href="/#enquire"
            className="inline-block px-6 py-3 bg-[#D85A30] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#c24a24] transition-colors rounded-sm shadow-sm"
          >
            Consult Our Engineering Team
          </Link>
        </div>
      </div>
    </div>
  );
}
