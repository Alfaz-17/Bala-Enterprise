import { z } from 'zod/v4';

// ---------------------------------------------------------------------------
// Category
// ---------------------------------------------------------------------------
export const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  slug: z.string().min(1, 'Slug is required').max(120),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  sortOrder: z.number().int().optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

// ---------------------------------------------------------------------------
// Product
// ---------------------------------------------------------------------------
export const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required').max(150),
  slug: z.string().min(1, 'Slug is required').max(180),
  modelNumber: z.string().max(50).optional(),
  capacity: z.string().max(50).optional(),
  span: z.string().max(50).optional(),
  specifications: z.record(z.string(), z.any()).optional(),
  priceMin: z.number().optional(),
  priceMax: z.number().optional(),
  priceDisplay: z.string().max(50).optional(),
  shortDescription: z.string().max(500).optional(),
  fullDescription: z.string().optional(),
  featured: z.boolean().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  categoryId: z.string().min(1, 'Category ID is required'),
});

export const updateProductSchema = createProductSchema.partial();

// ---------------------------------------------------------------------------
// Project
// ---------------------------------------------------------------------------
export const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(150),
  slug: z.string().min(1, 'Slug is required').max(180),
  clientName: z.string().max(150).optional(),
  industryType: z.string().max(100).optional(),
  productId: z.string().optional(),
  description: z.string().optional(),
  location: z.string().max(150).optional(),
  completedDate: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

// ---------------------------------------------------------------------------
// Testimonial
// ---------------------------------------------------------------------------
export const createTestimonialSchema = z.object({
  clientName: z.string().min(1, 'Client name is required').max(150),
  companyName: z.string().max(150).optional(),
  rating: z.number().int().min(1).max(5),
  reviewText: z.string().min(1, 'Review text is required'),
  source: z.enum(['google', 'manual', 'indiamart']).optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

export const updateTestimonialSchema = createTestimonialSchema.partial();

// ---------------------------------------------------------------------------
// BlogPost
// ---------------------------------------------------------------------------
export const createBlogPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().min(1, 'Slug is required').max(220),
  content: z.string().min(1, 'Content is required'),
  featuredImage: z.string().url().optional(),
  metaDescription: z.string().max(300).optional(),
  status: z.enum(['draft', 'published']).optional(),
  publishedAt: z.string().optional(),
});

export const updateBlogPostSchema = createBlogPostSchema.partial();

// ---------------------------------------------------------------------------
// Enquiry (public form submission)
// ---------------------------------------------------------------------------
export const createEnquirySchema = z.object({
  name: z.string().min(1, 'Name is required').max(150),
  companyName: z.string().max(150).optional(),
  phone: z.string().min(1, 'Phone is required').max(20),
  email: z.email().optional(),
  productId: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
  sourcePage: z.string().min(1, 'Source page is required').max(150),
});

export const updateEnquiryStatusSchema = z.object({
  status: z.enum(['new', 'contacted', 'converted', 'closed']),
});

// ---------------------------------------------------------------------------
// SiteSettings
// ---------------------------------------------------------------------------
export const updateSiteSettingsSchema = z.object({
  settingKey: z.string().min(1),
  settingValue: z.string().min(1),
});
