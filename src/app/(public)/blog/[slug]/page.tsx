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

export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostDetails(slug);

  if (!post) {
    return {
      title: 'Article Not Found | Bala Enterprise',
    };
  }

  const description = post.metaDescription || `Read the complete article: ${post.title}`;

  return {
    title: `${post.title} | Bala Enterprise Resources`,
    description,
    alternates: {
      canonical: `https://www.balaenterprise.in/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description,
      url: `https://www.balaenterprise.in/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.publishedAt,
      images: post.featuredImage ? [{ url: post.featuredImage }] : undefined,
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPostDetails(slug);

  if (!post) {
    notFound();
  }

  const currentUrl = `https://www.balaenterprise.in/blog/${post.slug}`;

  // Article / BlogPosting schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDescription || post.title,
    image: post.featuredImage ? [post.featuredImage] : [],
    datePublished: post.publishedAt,
    author: {
      '@type': 'Organization',
      name: 'Bala Enterprise',
      url: 'https://www.balaenterprise.in',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Bala Enterprise',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.balaenterprise.in/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': currentUrl,
    },
  };

  // Breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.balaenterprise.in',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://www.balaenterprise.in/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: currentUrl,
      },
    ],
  };

  return (
    <div className="bg-[#F7EBDD] min-h-screen text-[#131312] relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* Engineering blueprint dot grid */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(circle at 2px 2px, #E5E4DE 1px, transparent 0)', 
          backgroundSize: '20px 20px' 
        }} 
      />

      {/* Page Header */}
      <div className="relative bg-[#1A1A18] text-white overflow-hidden py-12 sm:py-16 md:py-20 border-b border-[#2A2A28]">
        {/* Dot pattern overlay inside header */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none z-10" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', 
            backgroundSize: '20px 20px' 
          }} 
        />

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
        
        <div className="section-container relative z-10 w-full">
          <div className="max-w-[55%] sm:max-w-[50%] lg:max-w-[60%] space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="label-tech text-[#D85A30]">
                {new Date(post.publishedAt).toLocaleDateString()}
              </span>
            </div>
            <h1 className="heading-display uppercase text-white font-black">
              {post.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-[#131312] mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="relative h-[250px] sm:h-[400px] w-full bg-white border border-black/10 overflow-hidden mb-10 shadow-sm">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 900px"
              priority
              className="object-cover"
            />
          </div>
        )}

        {/* Content */}
        <article className="prose max-w-none text-sm sm:text-base text-[#131312] leading-relaxed whitespace-pre-wrap bg-white/60 p-8 border border-black/10 shadow-sm">
          {post.content}
        </article>

        {/* Quote CTA */}
        <div className="bg-[#131312] text-white border border-white/10 p-8 mt-16 text-center space-y-4 relative overflow-hidden shadow-lg">
          <p className="label-tech text-[#D85A30]">Direct Support</p>
          <h3 className="heading-section text-white font-black uppercase">Need Technical Advice for Your Factory?</h3>
          <p className="body-text text-white/70 max-w-md mx-auto leading-relaxed">
            Get in touch with our engineering team today for custom crane drawing quotes and price estimates.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-block px-8 py-3.5 bg-[#D85A30] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#c24a24] transition-colors rounded-none shadow-md"
            >
              Get Price Quote
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
