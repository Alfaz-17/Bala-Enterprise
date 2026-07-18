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
    <div className="bg-white min-h-screen">
      {/* Page Header (Slanted High-Contrast Style) */}
      <div className="relative bg-[#1A1A18] text-white overflow-hidden py-16 md:py-20 border-b border-[#2A2A28]">
        {/* Slanted Design Background shape */}
        <div className="absolute top-0 right-0 h-full w-[45%] bg-[#D85A30] origin-top-right transform skew-x-[-15deg] translate-x-[15%] z-0 hidden lg:block" />
        <div className="absolute inset-0 bg-[#D85A30] z-0 lg:hidden opacity-90" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center gap-4 text-[10px] text-[#D85A30] uppercase tracking-wider">
              <span className="flex items-center gap-1 font-bold">
                <Calendar className="h-3.5 w-3.5 text-[#D85A30]" />
                {new Date(post.publishedAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1 font-bold">
                <User className="h-3.5 w-3.5 text-[#D85A30]" />
                Admin Author
              </span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-black tracking-tight leading-tight text-white mt-2">
              {post.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
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
        <div className="border-t border-border mt-16 pt-8 text-center space-y-4">
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
