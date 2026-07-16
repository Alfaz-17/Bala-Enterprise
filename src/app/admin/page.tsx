import { connectToDatabase } from '@/lib/mongoose';
import { Category } from '@/models/Category';
import { Product } from '@/models/Product';
import { Enquiry } from '@/models/Enquiry';
import { Project } from '@/models/Project';
import { Testimonial } from '@/models/Testimonial';
import { BlogPost } from '@/models/BlogPost';
import {
  FolderOpen,
  Package,
  Mail,
  Briefcase,
  MessageSquareQuote,
  FileText,
} from 'lucide-react';

async function getStats() {
  await connectToDatabase();

  const [categories, products, enquiries, projects, testimonials, blogPosts] =
    await Promise.all([
      Category.countDocuments({ status: 'active' }),
      Product.countDocuments({ status: 'active' }),
      Enquiry.countDocuments(),
      Project.countDocuments({ status: 'active' }),
      Testimonial.countDocuments({ status: 'active' }),
      BlogPost.countDocuments({ status: 'published' }),
    ]);

  const newEnquiries = await Enquiry.countDocuments({ status: 'new' });

  return {
    categories,
    products,
    enquiries,
    newEnquiries,
    projects,
    testimonials,
    blogPosts,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    {
      label: 'Categories',
      value: stats.categories,
      icon: FolderOpen,
      href: '/admin/categories',
    },
    {
      label: 'Products',
      value: stats.products,
      icon: Package,
      href: '/admin/products',
    },
    {
      label: 'Enquiries',
      value: stats.enquiries,
      icon: Mail,
      href: '/admin/enquiries',
      badge: stats.newEnquiries > 0 ? `${stats.newEnquiries} new` : undefined,
    },
    {
      label: 'Projects',
      value: stats.projects,
      icon: Briefcase,
      href: '/admin/projects',
    },
    {
      label: 'Testimonials',
      value: stats.testimonials,
      icon: MessageSquareQuote,
      href: '/admin/testimonials',
    },
    {
      label: 'Blog Posts',
      value: stats.blogPosts,
      icon: FileText,
      href: '/admin/blog',
    },
  ];

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-foreground mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <a
              key={card.label}
              href={card.href}
              className="block bg-card border border-border p-6 hover:border-primary transition-colors group"
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                {card.badge && (
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 font-medium">
                    {card.badge}
                  </span>
                )}
              </div>
              <p className="text-3xl font-bold text-foreground">{card.value}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {card.label}
              </p>
            </a>
          );
        })}
      </div>
    </div>
  );
}
