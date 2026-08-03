/**
 * Seed script: populates realistic blog posts for Bala Enterprise.
 * It checks for existing blog posts by slug to avoid overwriting or altering any existing data.
 *
 * Usage:
 *   npx tsx src/scripts/seed-blogs.ts
 */

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

// Load .env.local variables for stand-alone execution
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  for (const line of envConfig.split('\n')) {
    const match = line.match(/^\s*([^#=]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2] ? match[2].trim() : '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      }
      process.env[key] = value;
    }
  }
}

const MONGODB_URI = process.env.MONGODB_URI || '';

const blogsToSeed: {
  title: string;
  slug: string;
  metaDescription: string;
  featuredImage: string;
  status: 'draft' | 'published';
  publishedAt: Date;
  content: string;
}[] = [
  {
    title: 'Industrial Overhead Cranes: Safety Regulations & Preventive Maintenance Guide',
    slug: 'industrial-overhead-cranes-safety-maintenance-guide',
    metaDescription: 'A detailed guide on safety regulations, daily inspection checklists, and monthly preventive maintenance schedules for overhead cranes in GIDC industrial units.',
    featuredImage: '/Images_Factory/factory_hangar_refined.webp',
    status: 'published',
    publishedAt: new Date(),
    content: `# Industrial Overhead Cranes: Safety Regulations & Preventive Maintenance Guide

Overhead cranes are the backbone of modern factories and GIDC industrial plants. They carry out heavy lifting tasks that are otherwise impossible, ensuring efficiency and workflow continuity. However, handling loads of 5 to 50 tons comes with substantial responsibility. Without proper maintenance and safety protocols, overhead cranes can become significant hazards.

In this guide, we walk you through the essential safety regulations, standard daily inspection checklists, and periodic preventive maintenance routines necessary to keep your facility safe and compliant.

---

## 1. Why Preventive Maintenance Matters
Preventive maintenance (PM) is not just about avoiding sudden breakdowns; it is a critical strategy to:
* **Protect Workforce:** Ensure operators and nearby workers are safe from mechanical failures.
* **Increase Longevity:** Heavy machinery represents a massive capital investment. Proper care extends the life of hoists, girders, and tracks.
* **Compliance:** Adhere to factory inspection acts and safety standards in India (such as the Factories Act, 1948).

---

## 2. The Daily Inspection Checklist
Before beginning any lifting operations, the crane operator should perform a visual and functional check. This 5-minute routine can prevent major accidents:

1. **Visual Checklist:**
   * Look for oil leaks beneath the hoist and gearbox.
   * Inspect wire ropes for kinks, broken strands, or wear.
   * Ensure the hook has a functioning safety latch and is not bent or twisted.
   * Check that the runway tracks are free of obstacles.

2. **Operational Checklist:**
   * Test the emergency stop button on the pendant control or radio remote.
   * Check the limit switches by raising the hook block slowly to ensure it stops before reaching the drum.
   * Verify all directions of travel (hoisting, trolley cross travel, crane long travel) respond smoothly without unusual noises or vibrations.

---

## 3. Monthly and Quarterly Maintenance Tasks
While operators handle daily checks, qualified maintenance engineers must conduct detailed monthly and quarterly inspections:
* **Brake Adjustment:** Inspect hoist brakes and travel brakes. Adjust clearances and replace worn lining materials.
* **Lubrication:** Lubricate wire ropes, drum gears, sheave bearings, and travel wheel bearings. Use manufacturer-recommended lubricants.
* **Electrical Controls:** Inspect contactors, terminals, and wiring in the control panel for corrosion, burns, or loose connections.
* **Structure Inspection:** Look for loose bolts on runway rails, structural girders, and end carriages.

---

## 4. Annual Inspections & Load Testing
As per Indian factory regulations, overhead cranes must undergo certified load testing periodically. 
* A competent person must inspect and certify the crane's Safe Working Load (SWL).
* Load tests are typically carried out at 125% of the rated capacity to verify the structural and mechanical integrity of the crane system under stress.

---

## Conclusion
A safe factory is an efficient factory. By enforcing a strict daily inspection checklist and adhering to a rigorous preventive maintenance schedule, you can protect your operators, maximize the lifespan of your cranes, and eliminate costly downtime.

*Need professional overhead crane maintenance or looking to upgrade your factory equipment? Contact Bala Enterprise today for expert guidance.*`
  },
  {
    title: 'How to Choose the Right Electric Wire Rope Hoist for Your Facility',
    slug: 'how-to-choose-electric-wire-rope-hoist',
    metaDescription: 'Learn key parameters to consider when selecting an electric wire rope hoist, including loading capacity, duty cycles, lift heights, and speeds.',
    featuredImage: '/Images_Factory/inside_factory.webp',
    status: 'published',
    publishedAt: new Date(),
    content: `# How to Choose the Right Electric Wire Rope Hoist for Your Facility

When it comes to vertical lifting in workshops, warehouses, and heavy-duty manufacturing plants, electric wire rope hoists are the industry standard. However, choosing the wrong hoist can lead to premature motor burnout, safety risks, or inefficient cycle times.

Understanding how to specify the right electric wire rope hoist ensures you get the best value, durability, and performance for your material handling needs. Here are the core factors to analyze before making your purchase.

---

## 1. Load Capacity (Safe Working Load - SWL)
The most obvious factor is the maximum weight you need to lift. 
* Always choose a hoist capacity that exceeds your heaviest expected load. 
* If your maximum load is 4.8 tons, opt for a **5-ton capacity** hoist rather than pushing a 3-ton or 4-ton hoist beyond its design limit.
* Operating near the maximum rated load continuously reduces the hoist's lifespan.

---

## 2. Lifting Height and Headroom
* **Lifting Height:** Measure from the floor to the highest point the hook needs to reach. Remember to account for the height of the hook block itself and any slings or attachments.
* **Headroom:** Headroom is the vertical distance between the hoist suspension beam/rail and the hook in its fully raised position. In low-ceiling environments, you should choose a **low-headroom wire rope hoist** to maximize the usable lifting space.

---

## 3. Duty Cycle Classification (Class I, II, III, IV)
Duty cycles define how frequently the hoist will run and the average weight it will carry. 
* **Light Duty (Class I / M3):** Occasional lifting, maintenance workshops, or small assembly lines.
* **Medium Duty (Class II / M5):** General manufacturing plants, machine shops, lifting moderate loads regularly.
* **Heavy Duty (Class III / M7):** Steel yards, foundries, busy GIDC fabrication units with high-frequency lifting cycles.
* Selecting a lower-duty hoist for a heavy-duty application will result in motor overheating and mechanical failure.

---

## 4. Lifting and Travel Speeds
* **Single Speed vs. Dual Speed:** A single-speed hoist is suitable for standard loading. However, for precision positioning (e.g., placing heavy molds into machinery or handling delicate parts), a **dual-speed hoist** (with a slow creep speed and a fast travel speed) is highly recommended.
* **Cross Travel Speed:** The speed at which the trolley moves horizontally along the girder/beam. Typically ranges from 10 to 20 meters per minute.

---

## 5. Safety Features to Look For
To protect your equipment and operators, ensure your wire rope hoist includes:
* **Overload Limit Switches:** Automatically cuts off hoisting power if the load exceeds 110% of capacity.
* **Electro-Magnetic Brakes:** Ensures instant braking and holds the load securely in case of power failure.
* **Rope Guide:** A heavy-duty guide ring that prevents the wire rope from overlapping or jumping out of the drum grooves.

---

## Summary
Investing in the right electric wire rope hoist saves your business from operational headaches, downtime, and expensive repairs. Always evaluate load capacity, headroom restrictions, duty cycle class, and safety features when discussing your requirements with a manufacturer.

*At Bala Enterprise, we manufacture heavy-duty electric wire rope hoists tailored to your specific plant specifications. Browse our catalog or speak to our engineers to get a customized quote.*`
  },
  {
    title: 'Optimizing Warehouse Workflows with Stackers & Hand Pallet Trucks',
    slug: 'optimizing-warehouse-workflows-stackers-pallet-trucks',
    metaDescription: 'Discover how to improve warehouse efficiency, safety, and organization by choosing and deploying manual, semi-electric, and fully electric stackers.',
    featuredImage: '/Images_Factory/front_main.webp',
    status: 'published',
    publishedAt: new Date(),
    content: `# Optimizing Warehouse Workflows with Stackers & Hand Pallet Trucks

Effective warehouse layout and material handling are critical for supply chain efficiency. Whether you are running a small retail storeroom or a large GIDC logistics hub, moving goods quickly from receiving to storage to dispatch is essential.

Among the most versatile and cost-effective tools for warehouse operations are **Hand Pallet Trucks** and **Stackers**. Here is how to utilize them to optimize your workflows, reduce worker strain, and boost overall productivity.

---

## 1. Streamlining Horizontal Transportation
For moving goods across the warehouse floor, the classic Hand Pallet Truck is unmatched in utility:
* **Eliminate Manual Lifting:** Instead of workers carrying boxes individually, load them onto a pallet and transport up to 2.5 or 3 tons in a single trip.
* **Low-Maintenance Utility:** Manual pallet trucks require no charging, have minimal moving parts, and are ready to use 24/7.
* **Compact Design:** They can navigate tight aisles and corners where large forklifts cannot fit.

---

## 2. Maximizing Vertical Storage Space
Horizontal space is expensive. Warehouses must look upward by implementing racking systems. This is where **Stackers** become indispensable:
* **Manual Stackers:** Best for low-frequency operations where loads need to be lifted up to 1.6 or 2 meters occasionally.
* **Semi-Electric Stackers:** Features electric lifting and manual pushing. Highly efficient for medium-sized warehouses, relieving workers of the physical effort of pumping the mast.
* **Fully Electric Stackers (Battery Operated):** Motorized travel and lift. Ideal for high-density warehouses with continuous loading and unloading cycles.

---

## 3. Best Practices for Warehouse Efficiency
To get the most out of your material handling equipment:
* **Clear the Aisles:** Ensure walkways and aisles are wide enough for the stacker's turning radius and free of debris.
* **Implement Zone Storage:** Place fast-moving goods near the loading bays using pallet trucks, and slow-moving items on higher racks using stackers.
* **Regular Maintenance:** Check hydraulic oil levels, clean debris from the wheels, and ensure battery charging protocols are followed for electric models.

---

## Conclusion
You do not always need expensive, heavy forklifts to optimize your warehouse. A smart combination of high-quality hand pallet trucks and hydraulic stackers can dramatically speed up material flow while keeping acquisition and maintenance costs low.

*Explore Bala Enterprise's range of ISO-certified stackers and hand pallet trucks designed for heavy industrial use. Contact us for a catalog.*`
  }
];

async function seedBlogs() {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not set. Add it to .env.local');
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  const { BlogPost } = await import('../models/BlogPost');

  for (const blog of blogsToSeed) {
    const exists = await BlogPost.findOne({ slug: blog.slug });
    if (!exists) {
      await BlogPost.create(blog);
      console.log(`✅ Seeded blog: "${blog.title}"`);
    } else {
      console.log(`ℹ️ Blog already exists, skipping: "${blog.title}"`);
    }
  }

  console.log('🎉 Seeding completed successfully!');
  await mongoose.disconnect();
}

seedBlogs().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
