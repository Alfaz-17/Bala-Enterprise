# Bala Enterprise Website — Database Design & API Documentation

---

## PART 1: DATABASE DESIGN

### 1.1 Entity Relationship Overview

```
Category (1) ──< (M) Subcategory (1) ──< (M) Product ──< (M) ProductImage
                                                   │
                                                   └──< (M) Enquiry (also linked directly)

Project ──< (M) ProjectImage
Testimonial (standalone)
BlogPost ──< (M) BlogImage
Enquiry (also standalone form submissions)
Admin / User (for CMS login)
Settings (site-wide info: phone, address, social links)
```

---

### 1.2 Tables (Schema)

#### **category**
| Column | Type | Notes |
|---|---|---|
| id | INT, PK, AUTO_INCREMENT | |
| name | VARCHAR(100) | e.g. "Crane" |
| slug | VARCHAR(120), UNIQUE | e.g. "crane" (for URL: /products/crane) |
| description | TEXT | short intro shown on category page |
| image_url | VARCHAR(255) | category banner/thumbnail |
| sort_order | INT | controls display order |
| status | ENUM('active','inactive') | default 'active' |
| created_at | DATETIME | |
| updated_at | DATETIME | |

#### **subcategory**
| Column | Type | Notes |
|---|---|---|
| id | INT, PK, AUTO_INCREMENT | |
| category_id | INT, FK → category.id | |
| name | VARCHAR(100) | e.g. "EOT Crane" |
| slug | VARCHAR(120), UNIQUE | |
| description | TEXT | |
| image_url | VARCHAR(255) | |
| sort_order | INT | |
| status | ENUM('active','inactive') | |
| created_at | DATETIME | |
| updated_at | DATETIME | |

#### **product**
| Column | Type | Notes |
|---|---|---|
| id | INT, PK, AUTO_INCREMENT | |
| subcategory_id | INT, FK → subcategory.id | (nullable if no subcategory used) |
| category_id | INT, FK → category.id | denormalized for faster queries |
| name | VARCHAR(150) | e.g. "EOT Crane 10 Ton" |
| slug | VARCHAR(180), UNIQUE | |
| model_number | VARCHAR(50) | optional |
| capacity | VARCHAR(50) | e.g. "10 Ton" |
| span | VARCHAR(50) | e.g. "18 meters" |
| specifications | TEXT / JSON | key-value pairs (motor type, control type, etc.) |
| price_min | DECIMAL(10,2) | nullable |
| price_max | DECIMAL(10,2) | nullable |
| price_display | VARCHAR(50) | e.g. "Price on Request" (overrides min/max if set) |
| short_description | VARCHAR(500) | shown on listing cards |
| full_description | TEXT | shown on product detail page |
| featured | BOOLEAN | show on homepage |
| status | ENUM('active','inactive') | |
| created_at | DATETIME | |
| updated_at | DATETIME | |

#### **product_image**
| Column | Type | Notes |
|---|---|---|
| id | INT, PK, AUTO_INCREMENT | |
| product_id | INT, FK → product.id | |
| image_url | VARCHAR(255) | |
| alt_text | VARCHAR(150) | for SEO |
| sort_order | INT | |
| is_primary | BOOLEAN | main thumbnail |

#### **project** (completed projects/portfolio)
| Column | Type | Notes |
|---|---|---|
| id | INT, PK, AUTO_INCREMENT | |
| title | VARCHAR(150) | e.g. "10 Ton EOT Crane — Automotive Factory, Rajkot" |
| slug | VARCHAR(180), UNIQUE | |
| client_name | VARCHAR(150) | nullable if confidential |
| industry_type | VARCHAR(100) | e.g. "Automotive" |
| product_id | INT, FK → product.id | nullable, links to product supplied |
| description | TEXT | |
| location | VARCHAR(150) | |
| completed_date | DATE | |
| status | ENUM('active','inactive') | |
| created_at | DATETIME | |

#### **project_image**
| Column | Type | Notes |
|---|---|---|
| id | INT, PK, AUTO_INCREMENT | |
| project_id | INT, FK → project.id | |
| image_url | VARCHAR(255) | |
| sort_order | INT | |

#### **testimonial**
| Column | Type | Notes |
|---|---|---|
| id | INT, PK, AUTO_INCREMENT | |
| client_name | VARCHAR(150) | |
| company_name | VARCHAR(150) | |
| rating | TINYINT | 1-5 |
| review_text | TEXT | |
| source | ENUM('google','manual','indiamart') | |
| status | ENUM('active','inactive') | |
| created_at | DATETIME | |

#### **blog_post**
| Column | Type | Notes |
|---|---|---|
| id | INT, PK, AUTO_INCREMENT | |
| title | VARCHAR(200) | |
| slug | VARCHAR(220), UNIQUE | |
| content | TEXT / LONGTEXT | |
| featured_image | VARCHAR(255) | |
| meta_description | VARCHAR(300) | SEO |
| status | ENUM('draft','published') | |
| published_at | DATETIME | |
| created_at | DATETIME | |

#### **enquiry** (contact/inquiry form submissions)
| Column | Type | Notes |
|---|---|---|
| id | INT, PK, AUTO_INCREMENT | |
| name | VARCHAR(150) | |
| company_name | VARCHAR(150) | |
| phone | VARCHAR(20) | |
| email | VARCHAR(150) | nullable |
| product_id | INT, FK → product.id | nullable (if enquiry made from product page) |
| message | TEXT | |
| source_page | VARCHAR(150) | e.g. "product-page", "contact-page", "homepage" |
| status | ENUM('new','contacted','converted','closed') | for owner to track |
| created_at | DATETIME | |

#### **admin_user** (for CMS/dashboard login)
| Column | Type | Notes |
|---|---|---|
| id | INT, PK, AUTO_INCREMENT | |
| name | VARCHAR(100) | |
| email | VARCHAR(150), UNIQUE | |
| password_hash | VARCHAR(255) | |
| role | ENUM('owner','editor') | |
| created_at | DATETIME | |

#### **site_settings** (single row / key-value table)
| Column | Type | Notes |
|---|---|---|
| id | INT, PK | |
| setting_key | VARCHAR(100), UNIQUE | e.g. "phone_number", "whatsapp_number", "address" |
| setting_value | TEXT | |

---

### 1.3 Relationships Summary
- `category` 1—M `subcategory`
- `subcategory` 1—M `product`
- `product` 1—M `product_image`
- `product` 1—M `enquiry` (optional link)
- `project` M—1 `product` (optional link)
- `project` 1—M `project_image`
- All content tables are independent of `admin_user` except through CMS edit ownership (optional `created_by` FK if needed)

---

## PART 2: API DOCUMENTATION

**Base URL:** `https://api.balaenterprise.com/v1`
**Format:** JSON
**Auth:** Public endpoints = open. Admin endpoints = Bearer token (JWT) required.

---

### 2.1 Category Endpoints

**GET `/categories`**
Returns all active categories.
```json
[
  {
    "id": 1,
    "name": "Crane",
    "slug": "crane",
    "description": "Industrial cranes for heavy lifting",
    "image_url": "https://cdn.../crane.jpg"
  }
]
```

**GET `/categories/:slug`**
Returns single category with its subcategories.
```json
{
  "id": 1,
  "name": "Crane",
  "slug": "crane",
  "subcategories": [
    { "id": 1, "name": "EOT Crane", "slug": "eot-crane" },
    { "id": 2, "name": "Jib Crane", "slug": "jib-crane" }
  ]
}
```

---

### 2.2 Subcategory Endpoints

**GET `/subcategories/:slug`**
Returns subcategory details with its products.
```json
{
  "id": 1,
  "name": "EOT Crane",
  "slug": "eot-crane",
  "category": { "id": 1, "name": "Crane", "slug": "crane" },
  "products": [
    { "id": 5, "name": "EOT Crane 10 Ton", "slug": "eot-crane-10-ton", "price_display": "Price on Request" }
  ]
}
```

---

### 2.3 Product Endpoints

**GET `/products`**
Query params: `category`, `subcategory`, `featured`, `page`, `limit`
```
GET /products?category=crane&subcategory=eot-crane&page=1&limit=10
```
```json
{
  "total": 24,
  "page": 1,
  "limit": 10,
  "data": [
    {
      "id": 5,
      "name": "EOT Crane 10 Ton",
      "slug": "eot-crane-10-ton",
      "capacity": "10 Ton",
      "price_display": "Price on Request",
      "thumbnail": "https://cdn.../eot-10.jpg"
    }
  ]
}
```

**GET `/products/:slug`**
Full product detail.
```json
{
  "id": 5,
  "name": "EOT Crane 10 Ton",
  "slug": "eot-crane-10-ton",
  "capacity": "10 Ton",
  "span": "18 meters",
  "specifications": {
    "motor_type": "3-phase induction",
    "control": "Pendant/Radio remote"
  },
  "price_display": "Price on Request",
  "full_description": "...",
  "images": [
    { "url": "https://cdn.../1.jpg", "is_primary": true },
    { "url": "https://cdn.../2.jpg", "is_primary": false }
  ],
  "category": { "name": "Crane", "slug": "crane" },
  "subcategory": { "name": "EOT Crane", "slug": "eot-crane" }
}
```

---

### 2.4 Project (Portfolio) Endpoints

**GET `/projects`**
Query params: `page`, `limit`
```json
{
  "total": 15,
  "data": [
    {
      "id": 3,
      "title": "10 Ton EOT Crane — Automotive Factory, Rajkot",
      "industry_type": "Automotive",
      "location": "Rajkot",
      "thumbnail": "https://cdn.../project3.jpg"
    }
  ]
}
```

**GET `/projects/:slug`**
Full project detail with images and linked product.

---

### 2.5 Testimonial Endpoints

**GET `/testimonials`**
Returns active testimonials (for homepage/testimonials page).
```json
[
  {
    "client_name": "Rakesh Patel",
    "company_name": "ABC Industries",
    "rating": 5,
    "review_text": "Reliable and fast delivery."
  }
]
```

---

### 2.6 Blog Endpoints

**GET `/blog`**
Query params: `page`, `limit`
```json
{
  "total": 8,
  "data": [
    { "id": 1, "title": "5 Things to Check Before Buying a Crane", "slug": "5-things-before-buying-crane", "published_at": "2026-06-01" }
  ]
}
```

**GET `/blog/:slug`**
Full blog post content.

---

### 2.7 Enquiry (Contact Form) Endpoint

**POST `/enquiries`**
Public endpoint — used by contact form and product page "Enquire Now" buttons.

Request body:
```json
{
  "name": "Rakesh Patel",
  "company_name": "ABC Industries",
  "phone": "9876543210",
  "email": "rakesh@abcindustries.com",
  "product_id": 5,
  "message": "Need pricing for 10 ton EOT crane",
  "source_page": "product-page"
}
```

Response:
```json
{
  "success": true,
  "message": "Enquiry submitted successfully",
  "enquiry_id": 102
}
```

Validation rules:
- `name`, `phone` — required
- `email` — optional but validated if present
- `product_id` — optional
- Rate limit: max 5 submissions per IP per hour (spam protection)

---

### 2.8 Admin/CMS Endpoints (Auth Required)

All admin endpoints require header:
```
Authorization: Bearer <JWT_TOKEN>
```

**POST `/admin/login`**
```json
// Request
{ "email": "admin@balaenterprise.com", "password": "••••••" }

// Response
{ "token": "eyJhbGciOi...", "expires_in": 86400 }
```

**POST `/admin/categories`** — create category
**PUT `/admin/categories/:id`** — update category
**DELETE `/admin/categories/:id`** — soft delete (sets status = inactive)

**POST `/admin/subcategories`** — create subcategory
**PUT `/admin/subcategories/:id`** — update
**DELETE `/admin/subcategories/:id`** — soft delete

**POST `/admin/products`** — create product (with image upload support)
**PUT `/admin/products/:id`** — update product
**DELETE `/admin/products/:id`** — soft delete

**POST `/admin/products/:id/images`** — upload additional product images

**GET `/admin/enquiries`** — list all enquiries (with filters: status, date range)
**PUT `/admin/enquiries/:id`** — update enquiry status (new/contacted/converted/closed)

**POST `/admin/projects`** — create project entry
**PUT `/admin/projects/:id`** — update
**DELETE `/admin/projects/:id`** — soft delete

**POST `/admin/testimonials`** — add testimonial
**PUT `/admin/testimonials/:id`** — update/approve
**DELETE `/admin/testimonials/:id`** — remove

**POST `/admin/blog`** — create blog post
**PUT `/admin/blog/:id`** — update
**DELETE `/admin/blog/:id`** — delete

**PUT `/admin/settings`** — update site-wide settings (phone, WhatsApp, address, social links)

---

### 2.9 Standard Response Format

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Phone number is required"
  }
}
```

**HTTP Status Codes Used:**
| Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized (invalid/missing token) |
| 404 | Not Found |
| 429 | Too Many Requests (rate limit) |
| 500 | Server Error |

---

## PART 3: TECH STACK RECOMMENDATION (for this scale)

| Layer | Suggested Option |
|---|---|
| Database | MySQL or PostgreSQL |
| Backend | Node.js (Express) or Laravel (PHP) |
| Admin Panel | Simple CMS dashboard (React or server-rendered) so owner/team can add products without a developer |
| Image Storage | Cloud storage (AWS S3 / Cloudinary) — not local server storage |
| Frontend | React/Next.js (for SEO with server-side rendering) |
| Hosting | Shared hosting is NOT recommended given dynamic products — use VPS or cloud hosting (e.g., DigitalOcean, AWS Lightsail) |

---

## Notes
- All `slug` fields are used for clean SEO-friendly URLs (e.g., `/products/crane/eot-crane/eot-crane-10-ton`).
- Soft deletes (`status = inactive`) are used instead of hard deletes so historical enquiry/project links don't break.
- The `specifications` field in `product` can be stored as JSON to keep it flexible per product type (crane specs differ from winch specs) without needing new columns for every attribute.
- Rate limiting and basic spam protection (e.g., honeypot field or reCAPTCHA) should be added to the public `/enquiries` endpoint.
