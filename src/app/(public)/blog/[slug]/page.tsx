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
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#888780] hover:text-[#1A1A18] mb-8 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Blog
        </Link>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-[10px] text-[#888780] uppercase tracking-wider mb-4">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-[#D85A30]" />
            {new Date(post.publishedAt).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1">
            <User className="h-3.5 w-3.5 text-[#D85A30]" />
            Admin Author
          </span>
        </div>

        {/* Title */}
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#1A1A18] mb-8 leading-tight">
          {post.title}
        </h1>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="relative h-[220px] sm:h-[350px] w-full bg-zinc-100 border border-border overflow-hidden mb-10">
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
          <h3 className="font-heading text-lg font-bold text-[#1A1A18]">Need Customized Lifting Equipment Advice?</h3>
          <p className="text-xs text-[#888780] max-w-md mx-auto leading-relaxed">
            Get in touch with our factory experts today for tailored technical crane specifications and price quotes.
          </p>
          <Link
            href="/#enquire"
            className="inline-block px-6 py-3 bg-[#D85A30] text-white text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            Consult Our Engineering Team
          </Link>
        </div>
      </div>
    </div>
  );
}
