# Bala Enterprise — Next.js + MongoDB Atlas Tech Stack Guide

Since you're on Next.js + MongoDB Atlas (not SQL), the database design changes from tables/relations to **collections/documents**. Below is the adapted schema, followed by every library you need for a production-ready, reliable, and efficient build.

---

## PART 1: MongoDB Schema (Collections)

MongoDB is document-based, so instead of strict joins, we use a mix of **embedding** (fast reads, data that doesn't change often) and **referencing** (for data reused across collections).

### Design decision:
- **Category → Subcategory → Product**: use referencing (via ObjectId), since categories/subcategories are managed independently and products need fast filtering.
- **Product images, specifications**: embedded inside the product document (no need for a separate collection — faster reads, fewer queries).
- **Enquiries, Projects, Testimonials, Blog**: separate collections, referencing product where relevant.

---

### `categories`
```js
{
  _id: ObjectId,
  name: "Crane",
  slug: "crane",
  description: "Industrial cranes for heavy lifting",
  imageUrl: "https://cdn.../crane.jpg",
  sortOrder: 1,
  status: "active", // active | inactive
  createdAt: ISODate,
  updatedAt: ISODate
}
```

### `subcategories`
```js
{
  _id: ObjectId,
  categoryId: ObjectId,   // ref -> categories._id
  name: "EOT Crane",
  slug: "eot-crane",
  description: "...",
  imageUrl: "https://cdn.../eot.jpg",
  sortOrder: 1,
  status: "active",
  createdAt: ISODate,
  updatedAt: ISODate
}
```

### `products`
```js
{
  _id: ObjectId,
  categoryId: ObjectId,       // ref -> categories._id (denormalized for fast filtering)
  subcategoryId: ObjectId,    // ref -> subcategories._id
  name: "EOT Crane 10 Ton",
  slug: "eot-crane-10-ton",
  modelNumber: "BE-EOT-10",
  capacity: "10 Ton",
  span: "18 meters",
  specifications: {           // flexible object — different per product type
    motorType: "3-phase induction",
    controlType: "Pendant/Radio remote",
    girderType: "Single girder"
  },
  price: {
    min: 450000,
    max: 600000,
    display: "Price on Request"   // overrides min/max on frontend if set
  },
  shortDescription: "Heavy-duty 10 ton EOT crane for factory use",
  fullDescription: "...",
  images: [
    { url: "https://cdn.../1.jpg", altText: "EOT crane front view", isPrimary: true, sortOrder: 1 },
    { url: "https://cdn.../2.jpg", altText: "EOT crane installed", isPrimary: false, sortOrder: 2 }
  ],
  featured: true,
  status: "active",
  createdAt: ISODate,
  updatedAt: ISODate
}
```

### `projects`
```js
{
  _id: ObjectId,
  title: "10 Ton EOT Crane — Automotive Factory, Rajkot",
  slug: "10-ton-eot-crane-automotive-rajkot",
  clientName: "ABC Industries",    // nullable if confidential
  industryType: "Automotive",
  productId: ObjectId,             // ref -> products._id (nullable)
  description: "...",
  location: "Rajkot, Gujarat",
  completedDate: ISODate,
  images: [
    { url: "https://cdn.../p1.jpg", sortOrder: 1 }
  ],
  status: "active",
  createdAt: ISODate
}
```

### `testimonials`
```js
{
  _id: ObjectId,
  clientName: "Rakesh Patel",
  companyName: "ABC Industries",
  rating: 5,
  reviewText: "Reliable and fast delivery.",
  source: "google",   // google | manual | indiamart
  status: "active",
  createdAt: ISODate
}
```

### `blogPosts`
```js
{
  _id: ObjectId,
  title: "5 Things to Check Before Buying a Crane",
  slug: "5-things-before-buying-crane",
  content: "...",             // markdown or rich text
  featuredImage: "https://cdn.../blog1.jpg",
  metaDescription: "...",     // SEO
  status: "published",        // draft | published
  publishedAt: ISODate,
  createdAt: ISODate
}
```

### `enquiries`
```js
{
  _id: ObjectId,
  name: "Rakesh Patel",
  companyName: "ABC Industries",
  phone: "9876543210",
  email: "rakesh@abcindustries.com",
  productId: ObjectId,        // ref -> products._id (nullable)
  message: "Need pricing for 10 ton EOT crane",
  sourcePage: "product-page",
  status: "new",               // new | contacted | converted | closed
  createdAt: ISODate
}
```

### `adminUsers`
```js
{
  _id: ObjectId,
  name: "Admin",
  email: "admin@balaenterprise.com",
  passwordHash: "...",
  role: "owner",   // owner | editor
  createdAt: ISODate
}
```

### `siteSettings`
```js
{
  _id: ObjectId,
  key: "phoneNumber",
  value: "+91 9876543210"
}
// separate documents per key: whatsappNumber, address, socialLinks, workingHours, etc.
```

---

### Indexes to Create (important for performance)
```js
db.categories.createIndex({ slug: 1 }, { unique: true })
db.subcategories.createIndex({ slug: 1 }, { unique: true })
db.subcategories.createIndex({ categoryId: 1 })
db.products.createIndex({ slug: 1 }, { unique: true })
db.products.createIndex({ categoryId: 1, subcategoryId: 1 })
db.products.createIndex({ featured: 1, status: 1 })
db.projects.createIndex({ slug: 1 }, { unique: true })
db.blogPosts.createIndex({ slug: 1 }, { unique: true })
db.enquiries.createIndex({ createdAt: -1 })
db.enquiries.createIndex({ status: 1 })
```

---

## PART 2: Recommended Libraries (Production Stack)

### Core Framework
| Library | Purpose |
|---|---|
| `next` (v14+, App Router) | Framework — use Server Components + Server Actions for fast, SEO-friendly pages |
| `react`, `react-dom` | Comes with Next.js |
| `typescript` | Strongly recommended — catches errors before production, critical since products/data are dynamic |

### Database & Data Layer
| Library | Purpose |
|---|---|
| `mongoose` | ODM for MongoDB — schema validation, easier queries than raw driver. Recommended over raw `mongodb` driver for structure/reliability |
| `mongodb` | Raw driver (mongoose uses this internally; use directly only if you need very custom queries) |

### Validation
| Library | Purpose |
|---|---|
| `zod` | Validate all form inputs and API payloads (enquiry form, admin forms) — pairs perfectly with TypeScript and Server Actions |

### Forms
| Library | Purpose |
|---|---|
| `react-hook-form` | Handles enquiry form, admin product forms — lightweight, good performance, pairs with zod for validation |

### Image Handling & Storage
| Library | Purpose |
|---|---|
| `next/image` | Built-in — automatic image optimization, lazy loading (critical since product photos are heavy) |
| `cloudinary` or `@aws-sdk/client-s3` | Store product/project images in the cloud, not on your server — Cloudinary is easier to set up and has built-in image transformation |
| `sharp` | Image resizing/compression if you self-host image processing (Next.js uses this internally too) |

### Authentication (Admin Panel)
| Library | Purpose |
|---|---|
| `next-auth` (Auth.js) | Handles admin login sessions securely — supports credentials login + JWT |
| `bcryptjs` | Hash admin passwords before storing |

### API & Server Utilities
| Library | Purpose |
|---|---|
| Next.js Route Handlers (`app/api/.../route.ts`) | Built-in — no separate Express server needed |
| `rate-limiter-flexible` or Vercel Edge Config + middleware | Rate-limit the public enquiry form to prevent spam |

### Spam/Security Protection
| Library | Purpose |
|---|---|
| `@marsidev/react-turnstile` (Cloudflare Turnstile) or `react-google-recaptcha-v3` | Prevent bot spam on enquiry form |
| `helmet` equivalent via `next.config.js` headers | Set security headers (CSP, X-Frame-Options, etc.) |
| `isomorphic-dompurify` | Sanitize any rich text/blog content before rendering (prevent XSS) |

### SEO
| Library | Purpose |
|---|---|
| `next-sitemap` | Auto-generate sitemap.xml and robots.txt — important since products/categories are dynamic |
| Built-in Next.js `generateMetadata()` | Dynamic meta titles/descriptions per product/category page |
| `next-seo` (optional) | Simplifies structured data (JSON-LD) for products — helps Google show rich results |

### State Management (Admin Panel / Frontend)
| Library | Purpose |
|---|---|
| `zustand` | Lightweight state management if needed (cart-like enquiry list, admin filters) — simpler than Redux for this project size |
| React Server Components + Server Actions | Use these first — you likely won't need heavy client state for a catalog site |

### UI & Styling
| Library | Purpose |
|---|---|
| `tailwindcss` | Fast, consistent styling — pairs well with your defined color palette (set coral/near-black/gray as custom Tailwind theme colors) |
| `shadcn/ui` | Pre-built accessible components (forms, modals, dropdowns) — saves significant dev time, fully customizable |
| `lucide-react` | Clean icon set, works well with shadcn |
| `embla-carousel-react` | For product image galleries / testimonial sliders |

### Caching & Performance
| Library | Purpose |
|---|---|
| Next.js built-in ISR (Incremental Static Regeneration) | Cache product/category pages, auto-revalidate when admin updates content — critical for a catalog site with dynamic-but-not-constantly-changing data |
| `@vercel/kv` or Redis (`ioredis`) | Optional — cache frequently hit queries (featured products, homepage data) if traffic grows |

### File Uploads (Admin Panel)
| Library | Purpose |
|---|---|
| `react-dropzone` | Drag-and-drop image upload UI for admin product forms |
| `formidable` or built-in Next.js FormData handling | Parse multipart uploads on the server before pushing to Cloudinary/S3 |

### Email Notifications (Enquiry Alerts)
| Library | Purpose |
|---|---|
| `resend` (recommended) or `nodemailer` | Send email/notification to owner when a new enquiry comes in |

### Testing & Reliability
| Library | Purpose |
|---|---|
| `vitest` or `jest` | Unit testing for utility functions, API logic |
| `@testing-library/react` | Component testing |
| `playwright` | End-to-end testing (test that the enquiry form, product filters, etc. actually work before each deploy) |

### Monitoring & Error Tracking
| Library | Purpose |
|---|---|
| `@sentry/nextjs` | Catch and alert on production errors — important once real customers use the site |
| Vercel Analytics / `@vercel/analytics` | Basic traffic and performance monitoring |

### Environment & Config
| Library | Purpose |
|---|---|
| `dotenv` (built into Next.js via `.env.local`) | Store MongoDB URI, Cloudinary keys, email API keys securely |
| `zod` (again) | Validate environment variables at startup so misconfiguration fails fast, not silently in production |

---

## PART 3: Suggested `package.json` Core Dependencies

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "mongoose": "^8.4.0",
    "zod": "^3.23.0",
    "react-hook-form": "^7.51.0",
    "@hookform/resolvers": "^3.6.0",
    "next-auth": "^4.24.0",
    "bcryptjs": "^2.4.3",
    "cloudinary": "^2.2.0",
    "tailwindcss": "^3.4.0",
    "lucide-react": "^0.400.0",
    "embla-carousel-react": "^8.1.0",
    "resend": "^3.2.0",
    "next-sitemap": "^4.2.3",
    "react-dropzone": "^14.2.0",
    "@sentry/nextjs": "^8.9.0"
  },
  "devDependencies": {
    "typescript": "^5.5.0",
    "vitest": "^1.6.0",
    "@testing-library/react": "^16.0.0",
    "playwright": "^1.45.0"
  }
}
```

---

## PART 4: Architecture Notes for Reliability & Efficiency

1. **Use ISR, not full SSR, for product/category pages** — set `revalidate: 3600` (1 hour) or trigger on-demand revalidation when admin edits a product. Keeps pages fast without rebuilding the whole site.
2. **Denormalize `categoryId` on products** — avoids extra lookups when filtering by category directly.
3. **Keep images out of MongoDB** — store only URLs (Cloudinary/S3), never binary image data in the database.
4. **Validate on both client and server** — `react-hook-form` + `zod` on the client, and re-validate the same zod schema in the Server Action/API route (never trust client-only validation).
5. **Rate-limit the enquiry endpoint** — combine with Turnstile/reCAPTCHA to stop spam from IndiaMART-style bot traffic.
6. **Use MongoDB Atlas connection pooling correctly in Next.js** — cache the mongoose connection across serverless function invocations (standard `global.mongoose` caching pattern) to avoid connection exhaustion.
7. **Set up automatic MongoDB Atlas backups** (Atlas has this built-in — enable daily snapshots).

---

## PART 5: Cloudinary Setup (Image Storage)

### Why Cloudinary over self-hosted/S3 for this project
- Free tier covers 25GB storage + 25GB monthly bandwidth — enough for a product catalog site at launch.
- Automatic image optimization, resizing, and format conversion (WebP/AVIF) on the fly — no need to manually create multiple image sizes for cards vs detail pages.
- Direct browser-to-Cloudinary uploads possible from the admin panel — reduces load on your Vercel serverless functions.

### Libraries
```json
"cloudinary": "^2.2.0",
"next-cloudinary": "^6.6.0"
```
`next-cloudinary` gives you a ready `<CldImage />` component with built-in Next.js optimization — use this instead of manually building Cloudinary URLs.

### Setup steps
1. Create a free Cloudinary account → get `cloud_name`, `api_key`, `api_secret`.
2. Add to `.env.local`:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```
3. Create an **upload preset** (unsigned) in Cloudinary dashboard for the admin panel's `react-dropzone` uploader — allows direct client-side uploads without exposing your API secret.
4. Organize images in folders by type for easy management:
```
/bala-enterprise/products/
/bala-enterprise/projects/
/bala-enterprise/blog/
/bala-enterprise/categories/
```
5. Store only the returned `secure_url` (and `public_id` for future deletion) in MongoDB — never the image binary.

### Product image field update
```js
images: [
  {
    url: "https://res.cloudinary.com/.../products/eot-10-ton-1.jpg",
    publicId: "bala-enterprise/products/eot-10-ton-1",  // needed to delete/replace later
    altText: "EOT crane front view",
    isPrimary: true,
    sortOrder: 1
  }
]
```

---

## PART 6: Deployment on Vercel (Free Tier)

### Why this fits your project
Vercel's free (Hobby) tier is well-suited to launch this site since Next.js is built by the same team — zero-config deployment, automatic ISR/edge caching, and free SSL.

### Free tier limits to be aware of
| Resource | Free tier limit | Notes for this project |
|---|---|---|
| Bandwidth | 100GB/month | Plenty for a B2B catalog site at launch |
| Serverless function executions | 100GB-hours/month | Fine unless enquiry/admin traffic is very high |
| Build minutes | 6,000/month | No issue for a site this size |
| Custom domain | 1 free | Connect your `balaenterprise.com` domain |
| Team members | Personal use only | Upgrade to Pro ($20/mo) if multiple developers need access later |
| Cron jobs | 2 per project (Hobby) | Useful for scheduled sitemap regeneration if needed |

### Deployment steps
1. Push the Next.js project to a GitHub repository.
2. Go to vercel.com → "Add New Project" → import the GitHub repo.
3. Add environment variables in Vercel dashboard (Settings → Environment Variables):
   - `MONGODB_URI` (from MongoDB Atlas)
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
   - `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
   - `RESEND_API_KEY` (for enquiry email notifications)
4. Deploy — Vercel auto-builds on every `git push` to main branch.
5. Connect custom domain under Settings → Domains, point your domain's DNS (A/CNAME records) to Vercel as instructed.
6. Enable **Vercel Analytics** (free tier includes basic usage) to track visitor traffic.

### MongoDB Atlas + Vercel connection notes
- Use MongoDB Atlas's **free M0 cluster** to start (512MB storage — sufficient for a product catalog + enquiries).
- In Atlas → Network Access, allow access from `0.0.0.0/0` (required since Vercel serverless functions use dynamic IPs) — this is safe as long as your database user has a strong password and you're not exposing the DB directly.
- Cache the Mongoose connection using the standard serverless pattern (`global.mongoose`) to avoid exhausting Atlas's connection limit on the free tier (M0 allows 500 concurrent connections, but each cold serverless invocation can open a new one without caching).

### When to upgrade off free tier
- **Vercel Pro ($20/mo):** once you need team collaboration, more bandwidth, or password-protected preview deployments.
- **MongoDB Atlas M10+ (~$9/mo+):** once data grows past 512MB or you need better performance/backups beyond the free tier's limited snapshot retention.

---

## PART 7: TypeScript — Type Safety Throughout

TypeScript is already listed as a dependency, but here's how to actually wire it through the whole stack so types stay consistent from database → API → frontend.

### tsconfig.json (recommended strict settings)
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "esModuleInterop": true,
    "moduleResolution": "bundler",
    "module": "esnext",
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  }
}
```
`strict: true` and `noUncheckedIndexedAccess: true` are the two settings that catch the most real bugs — worth keeping on from day one rather than adding later.

### 1. Define core types once, reuse everywhere
Create `src/types/models.ts` — this becomes the single source of truth for shape of your data across mongoose, API responses, and React components.

```ts
export type Status = "active" | "inactive";

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  sortOrder: number;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export interface Subcategory {
  _id: string;
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  sortOrder: number;
  status: Status;
}

export interface ProductImage {
  url: string;
  publicId: string;
  altText?: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface Product {
  _id: string;
  categoryId: string;
  subcategoryId: string;
  name: string;
  slug: string;
  modelNumber?: string;
  capacity: string;
  span?: string;
  specifications: Record<string, string>;
  price: {
    min?: number;
    max?: number;
    display?: string;
  };
  shortDescription: string;
  fullDescription: string;
  images: ProductImage[];
  featured: boolean;
  status: Status;
}

export interface Enquiry {
  _id: string;
  name: string;
  companyName?: string;
  phone: string;
  email?: string;
  productId?: string;
  message: string;
  sourcePage: string;
  status: "new" | "contacted" | "converted" | "closed";
  createdAt: string;
}
```

### 2. Type-safe Mongoose models
```ts
// src/models/Product.ts
import { Schema, model, models, Document } from "mongoose";
import type { Product } from "@/types/models";

export interface ProductDocument extends Omit<Product, "_id">, Document {}

const ProductSchema = new Schema<ProductDocument>({
  categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  subcategoryId: { type: Schema.Types.ObjectId, ref: "Subcategory", required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  capacity: { type: String, required: true },
  specifications: { type: Schema.Types.Mixed, default: {} },
  price: {
    min: Number,
    max: Number,
    display: String
  },
  shortDescription: { type: String, required: true },
  fullDescription: { type: String, required: true },
  images: [{
    url: String,
    publicId: String,
    altText: String,
    isPrimary: Boolean,
    sortOrder: Number
  }],
  featured: { type: Boolean, default: false },
  status: { type: String, enum: ["active", "inactive"], default: "active" }
}, { timestamps: true });

export default models.Product || model<ProductDocument>("Product", ProductSchema);
```

### 3. Zod schemas derived from the same types (validation + type inference together)
```ts
// src/lib/validation/enquiry.ts
import { z } from "zod";

export const enquirySchema = z.object({
  name: z.string().min(2, "Name is required"),
  companyName: z.string().optional(),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number"),
  email: z.string().email().optional().or(z.literal("")),
  productId: z.string().optional(),
  message: z.string().min(5, "Please add a short message"),
  sourcePage: z.string()
});

// Infers the TypeScript type directly from the validation schema — one definition, no drift
export type EnquiryInput = z.infer<typeof enquirySchema>;
```
Using `z.infer` here means your validation rules and your TypeScript types can never fall out of sync — a common source of bugs when they're maintained separately.

### 4. Type-safe API route (App Router)
```ts
// src/app/api/enquiries/route.ts
import { NextRequest, NextResponse } from "next/server";
import { enquirySchema } from "@/lib/validation/enquiry";
import Enquiry from "@/models/Enquiry";
import connectDB from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = enquirySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION_ERROR", issues: parsed.error.flatten() } },
      { status: 400 }
    );
  }

  await connectDB();
  const enquiry = await Enquiry.create({ ...parsed.data, status: "new" });

  return NextResponse.json({ success: true, enquiry_id: enquiry._id }, { status: 201 });
}
```

### 5. Type-safe React components
```tsx
// src/components/ProductCard.tsx
import type { Product } from "@/types/models";

export function ProductCard({ product }: { product: Product }) {
  const primaryImage = product.images.find(img => img.isPrimary) ?? product.images[0];
  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <img src={primaryImage?.url} alt={primaryImage?.altText ?? product.name} />
      <h3 className="font-medium">{product.name}</h3>
      <p className="text-sm text-gray-600">{product.capacity}</p>
    </div>
  );
}
```

### Additional type-safety libraries
| Library | Purpose |
|---|---|
| `zod` | Already listed — also used here to type-infer, not just validate |
| `mongoose` (with generics) | Typed models via `Document` + your interfaces, as shown above |
| `@types/node`, `@types/react`, `@types/react-dom` | Base type definitions (auto-installed by `create-next-app --typescript`) |
| `eslint-plugin-typescript` (via `next lint`) | Catches type-related lint issues alongside compiler checks |
| `ts-reset` (optional, by Matt Pocock) | Fixes overly loose default TS types (e.g. `.json()`, `.includes()`) for stricter inference |

### Why this matters for reliability
- A typo in a MongoDB field name (`prodcut.capacty`) fails at compile time, not in production.
- Zod + TypeScript together mean the enquiry form, the API route, and the database write all agree on the exact same shape — no silent mismatches.
- Refactoring later (e.g., renaming `price.display` to `price.note`) is caught everywhere it's used, across the whole codebase, in one pass.

---

## Notes
- This stack is sized appropriately for a growing catalog site — not overengineered with microservices, but production-grade with proper validation, image optimization, spam protection, and error monitoring.
- Cloudinary (images) + Vercel (hosting) + MongoDB Atlas (database) free tiers together are enough to launch and run this site at zero infrastructure cost until traffic/data grows significantly.
- If traffic grows significantly later (heavy B2B lead volume), Redis caching and a dedicated search service (like Algolia or MongoDB Atlas Search) can be added for faster product filtering — not needed at launch.
