import { connectToDatabase } from '@/lib/mongoose';
import { Project } from '@/models/Project';
import { ProjectImage } from '@/models/ProjectImage';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Completed Installation Case Studies | Bala Enterprise',
  description:
    'Explore our portfolio of commissioned overhead gantry cranes, Jib cranes, and heavy lifting installations across India.',
};

async function getProjectsData() {
  await connectToDatabase();

  const projects = await Project.find({ status: 'active' })
    .sort({ completedDate: -1, createdAt: -1 })
    .lean();

  // Load project images
  const projectIds = projects.map((p) => p._id);
  const images = await ProjectImage.find({ project: { $in: projectIds } }).lean();

  const thumbMap = new Map<string, string>();
  for (const img of images) {
    const key = String(img.project);
    if (!thumbMap.has(key)) thumbMap.set(key, img.url);
  }

  return projects.map((p) => ({
    ...p,
    _id: String(p._id),
    product: p.product ? String(p.product) : undefined,
    thumbnail: thumbMap.get(String(p._id)) || undefined,
  }));
}

export default async function ProjectsPage() {
  const projects = await getProjectsData();

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
              Heavy Duty Commissioning
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-black tracking-tight leading-none text-white">
              Completed Projects
            </h1>
            <p className="text-sm text-white/80 max-w-xl">
              Browse real-world crane commissioning layouts, client case studies, and engineering test standards.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pb-32">
        {projects.length === 0 ? (
          <div className="text-center py-20 bg-[#F5F4F0] border border-border">
            <p className="text-[#888780] text-sm">No completed projects listed yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {projects.map((proj, idx) => (
              <Link
                key={proj._id}
                href={`/projects/${proj.slug}`}
                className={`group flex flex-col transition-all duration-300 h-[400px] ${
                  idx % 3 === 0 ? 'lg:translate-y-4' : idx % 3 === 2 ? 'lg:translate-y-8' : ''
                }`}
              >
                {/* Project Image Area (70% height) */}
                <div className="relative h-[70%] w-full bg-[#F5F4F0] rounded-md overflow-hidden flex items-center justify-center p-4">
                  {proj.thumbnail ? (
                    <Image
                      src={proj.thumbnail}
                      alt={proj.title}
                      fill
                      sizes="(max-w-768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#F5F4F0] text-[#888780] text-sm font-bold text-center p-6">
                      {proj.title}
                    </div>
                  )}
                </div>

                {/* Project Info Area (30% height) */}
                <div className="h-[30%] pt-3 pb-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="font-heading text-sm font-bold text-[#1A1A18] group-hover:text-[#D85A30] transition-colors leading-tight line-clamp-2 h-10">
                      {proj.title}
                    </h3>
                    {proj.location && (
                      <span className="text-[10px] text-[#888780] font-semibold uppercase tracking-wider block mt-1">
                        {proj.location}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#D85A30] inline-flex items-center gap-1 border-b border-[#D85A30] pb-0.5 hover:border-transparent transition-colors duration-300 w-fit">
                    View Project Details
                    <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
