import mongoose from 'mongoose';
import { Category } from '../models/Category';
import { Product } from '../models/Product';
import { ProductImage } from '../models/ProductImage';
import { Project } from '../models/Project';
import { ProjectImage } from '../models/ProjectImage';
import { Testimonial } from '../models/Testimonial';
import { BlogPost } from '../models/BlogPost';
import { Enquiry } from '../models/Enquiry';
import { AdminUser } from '../models/AdminUser';
import { SiteSettings } from '../models/SiteSettings';

/**
 * Model unit tests — validate schema structure, required fields,
 * defaults, and enum constraints using Mongoose's built-in
 * document validation (no live DB connection needed).
 */

// ---------------------------------------------------------------------------
// Helper: run Mongoose validation on a plain object and return the error
// ---------------------------------------------------------------------------
async function validateDoc(Model: mongoose.Model<any>, data: Record<string, any>) {
  const doc = new Model(data);
  try {
    await doc.validate();
    return null; // no error
  } catch (err) {
    return err as mongoose.Error.ValidationError;
  }
}

// ---------------------------------------------------------------------------
// Category
// ---------------------------------------------------------------------------
describe('Category model', () => {
  it('should validate a valid category', async () => {
    const err = await validateDoc(Category, {
      name: 'Crane',
      slug: 'crane',
    });
    expect(err).toBeNull();
  });

  it('should require name', async () => {
    const err = await validateDoc(Category, { slug: 'crane' });
    expect(err).not.toBeNull();
    expect(err!.errors.name).toBeDefined();
  });

  it('should require slug', async () => {
    const err = await validateDoc(Category, { name: 'Crane' });
    expect(err).not.toBeNull();
    expect(err!.errors.slug).toBeDefined();
  });

  it('should default status to active', () => {
    const doc = new Category({ name: 'Crane', slug: 'crane' });
    expect(doc.status).toBe('active');
  });

  it('should default sortOrder to 0', () => {
    const doc = new Category({ name: 'Crane', slug: 'crane' });
    expect(doc.sortOrder).toBe(0);
  });

  it('should reject invalid status', async () => {
    const err = await validateDoc(Category, {
      name: 'Crane',
      slug: 'crane',
      status: 'archived',
    });
    expect(err).not.toBeNull();
    expect(err!.errors.status).toBeDefined();
  });
});


// ---------------------------------------------------------------------------
// Product
// ---------------------------------------------------------------------------
describe('Product model', () => {
  const categoryId = new mongoose.Types.ObjectId();

  it('should validate a valid product', async () => {
    const err = await validateDoc(Product, {
      name: 'EOT Crane 10 Ton',
      slug: 'eot-crane-10-ton',
      category: categoryId,
    });
    expect(err).toBeNull();
  });

  it('should require name', async () => {
    const err = await validateDoc(Product, {
      slug: 'eot-crane-10-ton',
      category: categoryId,
    });
    expect(err).not.toBeNull();
    expect(err!.errors.name).toBeDefined();
  });

  it('should require category', async () => {
    const err = await validateDoc(Product, {
      name: 'EOT Crane 10 Ton',
      slug: 'eot-crane-10-ton',
    });
    expect(err).not.toBeNull();
    expect(err!.errors.category).toBeDefined();
  });

  it('should default featured to false', () => {
    const doc = new Product({
      name: 'EOT Crane 10 Ton',
      slug: 'eot-crane-10-ton',
      category: categoryId,
    });
    expect(doc.featured).toBe(false);
  });

  it('should default status to active', () => {
    const doc = new Product({
      name: 'EOT Crane 10 Ton',
      slug: 'eot-crane-10-ton',
      category: categoryId,
    });
    expect(doc.status).toBe('active');
  });

  it('should accept specifications as a mixed object', async () => {
    const err = await validateDoc(Product, {
      name: 'EOT Crane 10 Ton',
      slug: 'eot-crane-10-ton',
      category: categoryId,
      specifications: { motor_type: '3-phase', control: 'pendant' },
    });
    expect(err).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// ProductImage
// ---------------------------------------------------------------------------
describe('ProductImage model', () => {
  const productId = new mongoose.Types.ObjectId();

  it('should validate a valid product image', async () => {
    const err = await validateDoc(ProductImage, {
      url: 'https://cdn.example.com/img.jpg',
      product: productId,
    });
    expect(err).toBeNull();
  });

  it('should require url', async () => {
    const err = await validateDoc(ProductImage, { product: productId });
    expect(err).not.toBeNull();
    expect(err!.errors.url).toBeDefined();
  });

  it('should require product ref', async () => {
    const err = await validateDoc(ProductImage, {
      url: 'https://cdn.example.com/img.jpg',
    });
    expect(err).not.toBeNull();
    expect(err!.errors.product).toBeDefined();
  });

  it('should default isPrimary to false', () => {
    const doc = new ProductImage({
      url: 'https://cdn.example.com/img.jpg',
      product: productId,
    });
    expect(doc.isPrimary).toBe(false);
  });

  it('should default sortOrder to 0', () => {
    const doc = new ProductImage({
      url: 'https://cdn.example.com/img.jpg',
      product: productId,
    });
    expect(doc.sortOrder).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Project
// ---------------------------------------------------------------------------
describe('Project model', () => {
  it('should validate a valid project', async () => {
    const err = await validateDoc(Project, {
      title: '10 Ton EOT Crane — Automotive Factory',
      slug: '10-ton-eot-crane-automotive',
    });
    expect(err).toBeNull();
  });

  it('should require title', async () => {
    const err = await validateDoc(Project, { slug: 'some-project' });
    expect(err).not.toBeNull();
    expect(err!.errors.title).toBeDefined();
  });

  it('should require slug', async () => {
    const err = await validateDoc(Project, { title: 'Some Project' });
    expect(err).not.toBeNull();
    expect(err!.errors.slug).toBeDefined();
  });

  it('should default status to active', () => {
    const doc = new Project({
      title: 'Project',
      slug: 'project',
    });
    expect(doc.status).toBe('active');
  });
});

// ---------------------------------------------------------------------------
// ProjectImage
// ---------------------------------------------------------------------------
describe('ProjectImage model', () => {
  const projectId = new mongoose.Types.ObjectId();

  it('should validate a valid project image', async () => {
    const err = await validateDoc(ProjectImage, {
      url: 'https://cdn.example.com/project.jpg',
      project: projectId,
    });
    expect(err).toBeNull();
  });

  it('should require url', async () => {
    const err = await validateDoc(ProjectImage, { project: projectId });
    expect(err).not.toBeNull();
    expect(err!.errors.url).toBeDefined();
  });

  it('should require project ref', async () => {
    const err = await validateDoc(ProjectImage, {
      url: 'https://cdn.example.com/project.jpg',
    });
    expect(err).not.toBeNull();
    expect(err!.errors.project).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// Testimonial
// ---------------------------------------------------------------------------
describe('Testimonial model', () => {
  it('should validate a valid testimonial', async () => {
    const err = await validateDoc(Testimonial, {
      clientName: 'Rakesh Patel',
      rating: 5,
      reviewText: 'Excellent service and delivery.',
    });
    expect(err).toBeNull();
  });

  it('should require clientName', async () => {
    const err = await validateDoc(Testimonial, {
      rating: 5,
      reviewText: 'Great!',
    });
    expect(err).not.toBeNull();
    expect(err!.errors.clientName).toBeDefined();
  });

  it('should require rating', async () => {
    const err = await validateDoc(Testimonial, {
      clientName: 'Rakesh',
      reviewText: 'Great!',
    });
    expect(err).not.toBeNull();
    expect(err!.errors.rating).toBeDefined();
  });

  it('should reject rating below 1', async () => {
    const err = await validateDoc(Testimonial, {
      clientName: 'Rakesh',
      rating: 0,
      reviewText: 'Bad',
    });
    expect(err).not.toBeNull();
    expect(err!.errors.rating).toBeDefined();
  });

  it('should reject rating above 5', async () => {
    const err = await validateDoc(Testimonial, {
      clientName: 'Rakesh',
      rating: 6,
      reviewText: 'Too good',
    });
    expect(err).not.toBeNull();
    expect(err!.errors.rating).toBeDefined();
  });

  it('should default source to manual', () => {
    const doc = new Testimonial({
      clientName: 'Rakesh',
      rating: 5,
      reviewText: 'Nice',
    });
    expect(doc.source).toBe('manual');
  });

  it('should default status to active', () => {
    const doc = new Testimonial({
      clientName: 'Rakesh',
      rating: 5,
      reviewText: 'Nice',
    });
    expect(doc.status).toBe('active');
  });

  it('should reject invalid source', async () => {
    const err = await validateDoc(Testimonial, {
      clientName: 'Rakesh',
      rating: 5,
      reviewText: 'Nice',
      source: 'facebook',
    });
    expect(err).not.toBeNull();
    expect(err!.errors.source).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// BlogPost
// ---------------------------------------------------------------------------
describe('BlogPost model', () => {
  it('should validate a valid blog post', async () => {
    const err = await validateDoc(BlogPost, {
      title: '5 Things to Check Before Buying a Crane',
      slug: '5-things-before-buying-crane',
      content: 'Full article content here...',
    });
    expect(err).toBeNull();
  });

  it('should require title', async () => {
    const err = await validateDoc(BlogPost, {
      slug: 'test',
      content: 'content',
    });
    expect(err).not.toBeNull();
    expect(err!.errors.title).toBeDefined();
  });

  it('should require content', async () => {
    const err = await validateDoc(BlogPost, {
      title: 'Test',
      slug: 'test',
    });
    expect(err).not.toBeNull();
    expect(err!.errors.content).toBeDefined();
  });

  it('should default status to draft', () => {
    const doc = new BlogPost({
      title: 'Test',
      slug: 'test',
      content: 'content',
    });
    expect(doc.status).toBe('draft');
  });

  it('should reject invalid status', async () => {
    const err = await validateDoc(BlogPost, {
      title: 'Test',
      slug: 'test',
      content: 'content',
      status: 'archived',
    });
    expect(err).not.toBeNull();
    expect(err!.errors.status).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// Enquiry
// ---------------------------------------------------------------------------
describe('Enquiry model', () => {
  it('should validate a valid enquiry', async () => {
    const err = await validateDoc(Enquiry, {
      name: 'Rakesh Patel',
      phone: '9876543210',
      message: 'Need pricing for 10 ton EOT crane',
      sourcePage: 'product-page',
    });
    expect(err).toBeNull();
  });

  it('should require name', async () => {
    const err = await validateDoc(Enquiry, {
      phone: '9876543210',
      message: 'Need pricing',
      sourcePage: 'product-page',
    });
    expect(err).not.toBeNull();
    expect(err!.errors.name).toBeDefined();
  });

  it('should require phone', async () => {
    const err = await validateDoc(Enquiry, {
      name: 'Rakesh',
      message: 'Need pricing',
      sourcePage: 'product-page',
    });
    expect(err).not.toBeNull();
    expect(err!.errors.phone).toBeDefined();
  });

  it('should require message', async () => {
    const err = await validateDoc(Enquiry, {
      name: 'Rakesh',
      phone: '9876543210',
      sourcePage: 'product-page',
    });
    expect(err).not.toBeNull();
    expect(err!.errors.message).toBeDefined();
  });

  it('should default status to new', () => {
    const doc = new Enquiry({
      name: 'Rakesh',
      phone: '9876543210',
      message: 'Inquiry',
      sourcePage: 'contact-page',
    });
    expect(doc.status).toBe('new');
  });

  it('should reject invalid status', async () => {
    const err = await validateDoc(Enquiry, {
      name: 'Rakesh',
      phone: '9876543210',
      message: 'Inquiry',
      sourcePage: 'contact-page',
      status: 'pending',
    });
    expect(err).not.toBeNull();
    expect(err!.errors.status).toBeDefined();
  });

  it('should lowercase email', () => {
    const doc = new Enquiry({
      name: 'Rakesh',
      phone: '9876543210',
      email: 'Rakesh@ABC.COM',
      message: 'Inquiry',
      sourcePage: 'contact-page',
    });
    expect(doc.email).toBe('rakesh@abc.com');
  });
});

// ---------------------------------------------------------------------------
// AdminUser
// ---------------------------------------------------------------------------
describe('AdminUser model', () => {
  it('should validate a valid admin user', async () => {
    const err = await validateDoc(AdminUser, {
      name: 'Admin',
      email: 'admin@balaenterprise.com',
      passwordHash: '$2b$10$hashedpassword',
    });
    expect(err).toBeNull();
  });

  it('should require name', async () => {
    const err = await validateDoc(AdminUser, {
      email: 'admin@balaenterprise.com',
      passwordHash: '$2b$10$hash',
    });
    expect(err).not.toBeNull();
    expect(err!.errors.name).toBeDefined();
  });

  it('should require email', async () => {
    const err = await validateDoc(AdminUser, {
      name: 'Admin',
      passwordHash: '$2b$10$hash',
    });
    expect(err).not.toBeNull();
    expect(err!.errors.email).toBeDefined();
  });

  it('should require passwordHash', async () => {
    const err = await validateDoc(AdminUser, {
      name: 'Admin',
      email: 'admin@balaenterprise.com',
    });
    expect(err).not.toBeNull();
    expect(err!.errors.passwordHash).toBeDefined();
  });

  it('should default role to editor', () => {
    const doc = new AdminUser({
      name: 'Admin',
      email: 'admin@balaenterprise.com',
      passwordHash: '$2b$10$hash',
    });
    expect(doc.role).toBe('editor');
  });

  it('should lowercase email', () => {
    const doc = new AdminUser({
      name: 'Admin',
      email: 'ADMIN@BalaEnterprise.COM',
      passwordHash: '$2b$10$hash',
    });
    expect(doc.email).toBe('admin@balaenterprise.com');
  });

  it('should reject invalid role', async () => {
    const err = await validateDoc(AdminUser, {
      name: 'Admin',
      email: 'admin@balaenterprise.com',
      passwordHash: '$2b$10$hash',
      role: 'superadmin',
    });
    expect(err).not.toBeNull();
    expect(err!.errors.role).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// SiteSettings
// ---------------------------------------------------------------------------
describe('SiteSettings model', () => {
  it('should validate a valid setting', async () => {
    const err = await validateDoc(SiteSettings, {
      settingKey: 'phone_number',
      settingValue: '+91-9876543210',
    });
    expect(err).toBeNull();
  });

  it('should require settingKey', async () => {
    const err = await validateDoc(SiteSettings, {
      settingValue: 'some value',
    });
    expect(err).not.toBeNull();
    expect(err!.errors.settingKey).toBeDefined();
  });

  it('should require settingValue', async () => {
    const err = await validateDoc(SiteSettings, {
      settingKey: 'phone_number',
    });
    expect(err).not.toBeNull();
    expect(err!.errors.settingValue).toBeDefined();
  });
});
