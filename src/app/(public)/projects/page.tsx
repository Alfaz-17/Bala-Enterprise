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
      {/* Page Header */}
      <div className="bg-[#F5F4F0] border-b border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-4xl font-bold text-[#1A1A18]">
            Completed Projects
          </h1>
          <p className="text-xs text-[#888780] mt-2">
            Browse real-world crane commissioning layouts, client case studies, and engineering test standards.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {projects.length === 0 ? (
          <div className="text-center py-20 bg-[#F5F4F0] border border-border">
            <p className="text-[#888780] text-sm">No completed projects listed yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((proj) => (
              <Link
                key={proj._id}
                href={`/projects/${proj.slug}`}
                className="group block relative bg-[#F5F4F0] border border-border h-72 overflow-hidden"
              >
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6">
                  {proj.industryType && (
                    <span className="text-[10px] uppercase tracking-wider text-[#D85A30] font-semibold">
                      {proj.industryType}
                    </span>
                  )}
                  <h3 className="font-heading text-lg font-bold text-white group-hover:text-[#D85A30] transition-colors line-clamp-2 mt-1">
                    {proj.title}
                  </h3>
                  {proj.location && (
                    <span className="text-xs text-[#888780] mt-1">{proj.location}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
