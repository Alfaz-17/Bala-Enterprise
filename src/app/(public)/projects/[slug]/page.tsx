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
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#888780] hover:text-[#1A1A18] mb-8 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Projects
        </Link>

        {/* Title */}
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#1A1A18] mb-8 max-w-4xl">
          {project.title}
        </h1>

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
            <div className="bg-[#F5F4F0] border border-border p-6 space-y-4">
              <h3 className="font-heading text-lg font-bold text-[#1A1A18] border-b border-border pb-2">
                Project Details
              </h3>

              <ul className="space-y-4 text-xs">
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

            <div className="bg-[#1A1A18] text-white p-6 space-y-4">
              <h4 className="font-heading text-base font-bold text-white">Need a Similar Setup?</h4>
              <p className="text-xs text-[#888780] leading-relaxed">
                Contact our factory for customized industrial material handling setups to suit your factory specifications.
              </p>
              <Link
                href="/#enquire"
                className="block w-full text-center py-2.5 bg-[#D85A30] text-white text-xs font-semibold hover:opacity-90 transition-opacity"
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
