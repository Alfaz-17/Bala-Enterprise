import { connectToDatabase } from '@/lib/mongoose';
import { Project } from '@/models/Project';
import { ProjectImage } from '@/models/ProjectImage';
import ImageGallery from '@/components/public/ImageGallery';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, Building, Package2 } from 'lucide-react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProjectDetails(slug: string) {
  await connectToDatabase();

  const project = await Project.findOne({ slug, status: 'active' })
    .populate('product', 'name slug')
    .lean();

  if (!project) return null;

  const images = await ProjectImage.find({ project: project._id })
    .sort({ sortOrder: 1 })
    .select('url sortOrder')
    .lean();

  return {
    ...project,
    _id: String(project._id),
    product: project.product
      ? {
          name: (project.product as any).name,
          slug: (project.product as any).slug,
        }
      : undefined,
    images: images.map((img) => ({
      url: img.url,
      sortOrder: img.sortOrder,
    })),
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectDetails(slug);

  if (!project) {
    return {
      title: 'Project Case Study Not Found | Bala Enterprise',
    };
  }

  const industryInfo = project.industryType ? ` for the ${project.industryType} Industry` : '';
  return {
    title: `${project.title} | Bala Enterprise Portfolio`,
    description:
      project.description ||
      `Case study on our crane commissioning installation located in ${project.location || 'India'}${industryInfo}.`,
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectDetails(slug);

  if (!project) {
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
            <span className="text-[#D85A30] lg:text-primary text-xs uppercase tracking-[0.2em] font-bold block">
              Case Study Installation
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl font-black tracking-tight leading-none text-white">
              {project.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back Link */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#888780] hover:text-[#1A1A18] mb-8 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Projects
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Images Section */}
          <div className="lg:col-span-8 space-y-6">
            <ImageGallery images={project.images || []} title={project.title} />

            {/* Description */}
            {project.description && (
              <div className="space-y-3 pt-4">
                <h2 className="font-heading text-xl font-bold text-[#1A1A18]">Project Overview</h2>
                <div className="text-sm text-[#888780] leading-relaxed whitespace-pre-wrap">
                  {project.description}
                </div>
              </div>
            )}
          </div>

          {/* Details Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#F5F4F0] border border-border p-6 space-y-4 rounded-md">
              <h3 className="font-heading text-lg font-bold text-[#1A1A18] border-b border-border pb-2">
                Project Details
              </h3>

              <ul className="space-y-4 text-sm">
                {project.clientName && (
                  <li className="flex items-start gap-3">
                    <Building className="h-4 w-4 text-[#D85A30] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[#1A1A18]">Client</p>
                      <p className="text-[#888780] mt-0.5">{project.clientName}</p>
                    </div>
                  </li>
                )}

                {project.industryType && (
                  <li className="flex items-start gap-3">
                    <Building className="h-4 w-4 text-[#D85A30] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[#1A1A18]">Industry Type</p>
                      <p className="text-[#888780] mt-0.5">{project.industryType}</p>
                    </div>
                  </li>
                )}

                {project.location && (
                  <li className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-[#D85A30] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[#1A1A18]">Installation Site</p>
                      <p className="text-[#888780] mt-0.5">{project.location}</p>
                    </div>
                  </li>
                )}

                {project.completedDate && (
                  <li className="flex items-start gap-3">
                    <Calendar className="h-4 w-4 text-[#D85A30] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[#1A1A18]">Commissioned Date</p>
                      <p className="text-[#888780] mt-0.5">
                        {new Date(project.completedDate).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                        })}
                      </p>
                    </div>
                  </li>
                )}

                {project.product && (
                  <li className="flex items-start gap-3">
                    <Package2 className="h-4 w-4 text-[#D85A30] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[#1A1A18]">Equipment Used</p>
                      <Link
                        href={`/products/${project.product.slug}`}
                        className="text-[#D85A30] hover:underline font-semibold mt-0.5 block"
                      >
                        {project.product.name}
                      </Link>
                    </div>
                  </li>
                )}
              </ul>
            </div>

            <div className="bg-[#1A1A18] text-white p-6 space-y-4 rounded-md">
              <h4 className="font-heading text-base font-bold text-white">Need a Similar Setup?</h4>
              <p className="text-sm text-[#888780] leading-relaxed">
                Contact our factory for customized industrial material handling setups to suit your factory specifications.
              </p>
              <Link
                href="/#enquire"
                className="block w-full text-center py-2.5 bg-[#D85A30] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#c24a24] transition-colors rounded-sm"
              >
                Request Quotation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
