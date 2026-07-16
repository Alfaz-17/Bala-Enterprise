import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { Category } from '../models/Category';
import { Product } from '../models/Product';
import { ProductImage } from '../models/ProductImage';
import { Project } from '../models/Project';
import { ProjectImage } from '../models/ProjectImage';
import { Testimonial } from '../models/Testimonial';
import { BlogPost } from '../models/BlogPost';
import { SiteSettings } from '../models/SiteSettings';

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

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bala-enterprise';

async function seedRealData() {
  console.log('🔄 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  // Clear existing collections
  console.log('🗑️ Clearing collections...');
  await Promise.all([
    Category.deleteMany({}),
    Product.deleteMany({}),
    ProductImage.deleteMany({}),
    Project.deleteMany({}),
    ProjectImage.deleteMany({}),
    Testimonial.deleteMany({}),
    BlogPost.deleteMany({}),
    SiteSettings.deleteMany({}),
  ]);
  console.log('✅ Collections cleared');

  // 1. Insert Categories
  console.log('🌱 Seeding Categories...');
  const catMaterial = await Category.create({
    name: 'Material Handling Equipment',
    slug: 'material-handling-equipment',
    description: 'Manual and hydraulic stackers, hand pallet trucks, and trolleys built for robust logistics.',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800',
    sortOrder: 1,
    status: 'active',
  });

  const catLifting = await Category.create({
    name: 'Lifting & Hoisting Equipment',
    slug: 'lifting-hoisting-equipment',
    description: 'Electric hoists, manual chain blocks, and geared trolleys built for durability and factory safety.',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800',
    sortOrder: 2,
    status: 'active',
  });

  const catWinches = await Category.create({
    name: 'Industrial Winch Machines',
    slug: 'industrial-winch-machines',
    description: 'Heavy duty electric winches, jeep winches, and manual hand winches for pulling and anchoring.',
    imageUrl: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&q=80&w=800',
    sortOrder: 3,
    status: 'active',
  });

  // Helper function to seed product and its primary image
  async function addProduct(data: {
    name: string;
    slug: string;
    modelNumber: string;
    capacity?: string;
    shortDescription: string;
    imageUrl: string;
    category: any;
    subcategory?: any;
    specifications: Record<string, string>;
  }) {
    const prod = await Product.create({
      name: data.name,
      slug: data.slug,
      modelNumber: data.modelNumber,
      capacity: data.capacity,
      priceDisplay: 'Price on Request',
      shortDescription: data.shortDescription,
      fullDescription: `${data.name} manufactured by Bala Enterprise. Engineered with premium materials to guarantee long service life, durability, and compliance with industry safety standards.`,
      specifications: data.specifications,
      featured: true,
      category: data.category._id,
      status: 'active',
    });

    await ProductImage.create({
      product: prod._id,
      url: data.imageUrl,
      isPrimary: true,
      sortOrder: 1,
    });

    return prod;
  }

  // 3. Seed the 18 Scraped Products
  console.log('🌱 Seeding 18 Scraped Products...');

  // Group 1: Material Handling
  const p1 = await addProduct({
    name: 'C Type Manual Stacker',
    slug: 'c-type-manual-stacker',
    modelNumber: 'BE-CMS-01',
    capacity: '1 Ton - 2 Ton',
    shortDescription: 'Heavy-duty C-Channel structural steel manual hydraulic stacker for narrow aisle pallet stacking.',
    imageUrl: 'https://cpimg.tistatic.com/12456714/b/4/C-Type-Manual-Stacker..png',
    category: catMaterial,
    specifications: {
      'Load Capacity': '1000 kg / 2000 kg',
      'Lift Height': '1.6 meters to 3.0 meters',
      'Mast Construction': 'C-Channel Steel Profile',
      'Fork Width': 'Adjustable up to 740mm',
      'Pump Valve': 'Leak-proof integrated cylinder pump',
    },
  });

  const p2 = await addProduct({
    name: 'H Type Manual Stacker',
    slug: 'h-type-manual-stacker',
    modelNumber: 'BE-HMS-02',
    capacity: '1.5 Ton',
    shortDescription: 'Robust H-Type steel mast manual stacker with stable weight distribution for high lift safety.',
    imageUrl: 'https://cpimg.tistatic.com/12456715/b/4/H-Type-Manual-Stacker..png',
    category: catMaterial,
    specifications: {
      'Load Capacity': '1500 kg',
      'Lift Height': '1.6 meters',
      'Mast Type': 'H-Section Heavy Steel',
      'Steering Wheels': 'Dual Nylon Rollers with foot-brakes',
    },
  });

  const p3 = await addProduct({
    name: 'Hand Pallet Truck',
    slug: 'hand-pallet-truck',
    modelNumber: 'BE-HPT-03',
    capacity: '2.5 Ton - 3 Ton',
    shortDescription: 'Hydraulic hand pallet truck with reinforced fork ribs for rapid warehouse transport.',
    imageUrl: 'https://cpimg.tistatic.com/12456716/b/4/Hand-Pallet-Truck..png',
    category: catMaterial,
    specifications: {
      'Capacity': '2500 kg / 3000 kg',
      'Standard Width': '550 mm / 685 mm',
      'Fork Length': '1150 mm',
      'Pump': 'Cast Iron integrated pump cylinder',
    },
  });

  const p4 = await addProduct({
    name: 'Manual Geared Trolley',
    slug: 'manual-geared-trolley',
    modelNumber: 'BE-MGT-04',
    capacity: '1 Ton - 5 Ton',
    shortDescription: 'I-Beam monorail geared traveling trolley with precision machined steel wheels.',
    imageUrl: 'https://cpimg.tistatic.com/12456731/b/4/Manual-Geared-Trolley..jpg',
    category: catMaterial,
    specifications: {
      'Capacity Range': '1 Ton to 5 Ton',
      'Adjustable Flange Width': '75mm to 125mm',
      'Operation': 'Hand chain driven gearing wheel',
    },
  });

  // Group 2: Lifting & Hoisting
  const p5 = await addProduct({
    name: 'CD1 Electric Wire Rope Hoist',
    slug: 'cd1-electric-wire-rope-hoist',
    modelNumber: 'BE-CD1-05',
    capacity: '1 Ton - 10 Ton',
    shortDescription: 'Industrial grade CD1 model electric wire rope hoist with motorized trolley.',
    imageUrl: 'https://cpimg.tistatic.com/12456682/b/5/CD1-Electric-Wire-Rope-Hoist.jpg',
    category: catLifting,
    specifications: {
      'Capacity': '1 Ton to 10 Ton',
      'Lifting Height': '6m / 9m / 12m / 24m',
      'Lifting Speed': '8 meters per minute',
      'Power Source': '3-Phase AC 415V, 50Hz',
    },
  });

  const p6 = await addProduct({
    name: '220v Electric Mini Hoist 1TON',
    slug: '220v-electric-mini-hoist-1ton',
    modelNumber: 'BE-EMH-06',
    capacity: '1 Ton',
    shortDescription: 'Single-phase 220V electric mini hoist for light utility workshop and warehouse lifting.',
    imageUrl: 'https://cpimg.tistatic.com/12456683/b/4/220v-Electric-Mini-Hoist-1TON..jpg',
    category: catLifting,
    specifications: {
      'Voltage': '220V Single Phase, 50Hz',
      'Capacity (Double Hook)': '1000 kg',
      'Lifting Height': '12 meters / 24 meters',
    },
  });

  const p7 = await addProduct({
    name: '440volt DHS Model Electric Chain Block',
    slug: '440volt-dhs-model-electric-chain-block',
    modelNumber: 'BE-DHS-07',
    capacity: '1 Ton - 5 Ton',
    shortDescription: 'Heavy-duty DHS model electric chain hoist running on 3-phase power.',
    imageUrl: 'https://cpimg.tistatic.com/12456704/b/4/440volt-DHS-Model-Electric-Chain-Block..jpg',
    category: catLifting,
    specifications: {
      'Operating Voltage': '3-Phase 440V',
      'Lifting Speed': '2.2 meters per minute',
      'Chain Links': 'Alloy steel load chain',
    },
  });

  const p8 = await addProduct({
    name: 'Chain Hoist Lever Block',
    slug: 'chain-hoist-lever-block',
    modelNumber: 'BE-CHL-08',
    capacity: '1.5 Ton - 6 Ton',
    shortDescription: 'Manual lever hoist block with double pawl braking for precise rigging alignment.',
    imageUrl: 'https://cpimg.tistatic.com/12456703/b/4/Chain-Hoist-Lever-Block..png',
    category: catLifting,
    specifications: {
      'Lifting Capacity': '1.5 Ton to 6 Ton',
      'Standard Lift': '1.5 meters / 3 meters',
      'Brake': 'Double pawl Weston-style automatic brake',
    },
  });

  const p9 = await addProduct({
    name: 'VT Model Chain Block',
    slug: 'vt-model-chain-block',
    modelNumber: 'BE-VTCB-09',
    capacity: '1 Ton - 10 Ton',
    shortDescription: 'Premium VT model manual chain pulley block with cast steel covers.',
    imageUrl: 'https://cpimg.tistatic.com/12456702/b/4/VT-Model-Chain-Block..jpg',
    category: catLifting,
    specifications: {
      'Capacity': '1000 kg to 10,000 kg',
      'Lift Height': '3m / 6m',
      'Chain Material': 'Grade 80 heat-treated alloy steel',
    },
  });

  const p10 = await addProduct({
    name: 'Chain Block 2 Ton D/F',
    slug: 'chain-block-2-ton-d-f',
    modelNumber: 'BE-DFCB-10',
    capacity: '2 Ton',
    shortDescription: 'Double-fall manual chain block pulley built for heavy factory lifting.',
    imageUrl: 'https://cpimg.tistatic.com/12456701/b/4/Chain-Block-2-Ton-D-F..jpg',
    category: catLifting,
    specifications: {
      'Capacity': '2000 kg',
      'Falls of Chain': '2 Falls',
      'Load Chain Diameter': '6 mm',
    },
  });

  // Group 3: Winches
  const p11 = await addProduct({
    name: 'CDK1 Aluminum Electric Winch',
    slug: 'cdk1-aluminum-electric-winch',
    modelNumber: 'BE-CDK1-11',
    shortDescription: 'Compact aluminum body electric winch with high heat dissipation housing.',
    imageUrl: 'https://cpimg.tistatic.com/12456688/b/4/CDK1-Aluminum-Electric-Winch..jpg',
    category: catWinches,
    specifications: {
      'Material': 'Cast Aluminum alloy shell',
      'Voltage': '220V / 380V options',
      'Brake': 'Automatic electromagnetic brake',
    },
  });

  const p12 = await addProduct({
    name: '440volt KCD Winch',
    slug: '440volt-kcd-winch',
    modelNumber: 'BE-KCD440-12',
    shortDescription: 'Heavy-duty 440V KCD model electric winch for engineering and site hoisting.',
    imageUrl: 'https://cpimg.tistatic.com/12456697/b/4/440volt-KCD-Winch..png',
    category: catWinches,
    specifications: {
      'Voltage': '3-Phase 440V AC',
      'Speed': '12 - 18 meters per minute',
      'Rope Capacity': 'Up to 100 meters',
    },
  });

  const p13 = await addProduct({
    name: 'Clutch Winch',
    slug: 'clutch-winch',
    modelNumber: 'BE-CW-13',
    shortDescription: 'Electric clutch winch machine with manual clutch disengagement lever.',
    imageUrl: 'https://cpimg.tistatic.com/12456689/b/4/Clutch-Winch..png',
    category: catWinches,
    specifications: {
      'Clutch mechanism': 'Manual lever action disengagement',
      'Application': 'Free spooling wire rope pulling',
    },
  });

  const p14 = await addProduct({
    name: 'Hand Winch 1200 LBS',
    slug: 'hand-winch-1200-lbs',
    modelNumber: 'BE-HW1200-14',
    capacity: '1200 lbs',
    shortDescription: 'Wall-mounted manual hand winch with self-locking spur gears.',
    imageUrl: 'https://cpimg.tistatic.com/12456690/b/4/Hand-Winch-1200-LBS..jpg',
    category: catWinches,
    specifications: {
      'Pulling Capacity': '1200 lbs / 540 kg',
      'Gear Ratio': '4.1:1',
      'Brake': 'Automatic mechanical self-locking brake',
    },
  });

  const p15 = await addProduct({
    name: 'KCD Winch',
    slug: 'kcd-winch',
    modelNumber: 'BE-KCD-15',
    shortDescription: 'Standard KCD series electric builder winch machine.',
    imageUrl: 'https://cpimg.tistatic.com/12456695/b/4/KCD-Winch..png',
    category: catWinches,
    specifications: {
      'Type': 'KCD Builder Winch',
      'Rope Thickness': '8 mm',
      'Mounting': 'Base plate structural steel mounting holes',
    },
  });

  const p16 = await addProduct({
    name: 'JSW Series Hand Winch',
    slug: 'jsw-series-hand-winch',
    modelNumber: 'BE-JSW-16',
    shortDescription: 'Heavy-duty JSW model worm-gear manual hand winch.',
    imageUrl: 'https://cpimg.tistatic.com/12456692/b/4/JSW-Series-Hand-Winch..jpg',
    category: catWinches,
    specifications: {
      'Gearbox Type': 'Worm gear self-locking reduction',
      'Finish': 'Corrosion-resistant powder coating',
    },
  });

  const p17 = await addProduct({
    name: '12v Jeep Winch',
    slug: '12v-jeep-winch',
    modelNumber: 'BE-JW12-17',
    capacity: '12V DC',
    shortDescription: '12V DC heavy-duty electric recovery winch for off-road jeeps and utility towing.',
    imageUrl: 'https://cpimg.tistatic.com/12456691/b/4/12v-Jeep-Winch..png',
    category: catWinches,
    // recoveries are group level
    specifications: {
      'Voltage': '12V DC Power',
      'Motor': 'Series wound high-torque motor',
      'Control': 'Wired pendant remote controller',
    },
  });

  const p18 = await addProduct({
    name: '220volt KCD Electric Winch',
    slug: '220volt-kcd-electric-winch',
    modelNumber: 'BE-KCD220-18',
    shortDescription: 'Single-phase 220V KCD builder winch machine for standard sockets.',
    imageUrl: 'https://cpimg.tistatic.com/12456696/b/4/220volt-KCD-Electric-Winch..png',
    category: catWinches,
    specifications: {
      'Operating Voltage': '220V Single Phase',
      'Control': 'IP54 pendant station up/down switch',
    },
  });

  // 4. Case Studies / Completed Projects
  console.log('🌱 Seeding Projects...');
  const proj1 = await Project.create({
    title: 'Hydraulic Scissor Lift Installation at Cargo Yard',
    slug: 'hydraulic-scissor-lift-installation-cargo-yard',
    clientName: 'Mundra Terminal Logistics',
    industryType: 'Logistics & Distribution',
    location: 'Mundra Port, Gujarat',
    completedDate: new Date('2026-04-12'),
    product: p3._id,
    description: 'We customized and commissioned a stationary 2-ton hydraulic scissor lift table for height adjustment during container unloading docks.',
    status: 'active',
  });

  const proj2 = await Project.create({
    title: 'Geared Trolley & Wire Rope Hoist Assembly Commissioning',
    slug: 'geared-trolley-wire-rope-hoist-assembly-commissioning',
    clientName: 'Bhavnagar Structural Steel Works',
    industryType: 'Metal Fabrication',
    location: 'Chitra GIDC, Bhavnagar',
    completedDate: new Date('2026-06-08'),
    product: p5._id,
    description: 'Supplied and assembled five CD1 model 5-Ton wire rope hoists paired with geared traveling monorail trolleys for overhead beam transport systems.',
    status: 'active',
  });

  await ProjectImage.create([
    {
      project: proj1._id,
      url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600',
      sortOrder: 1,
    },
    {
      project: proj2._id,
      url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
      sortOrder: 1,
    },
  ]);

  // 5. Testimonials
  console.log('🌱 Seeding Testimonials...');
  await Testimonial.create([
    {
      clientName: 'Hanif Patel',
      companyName: 'Patel Crane & Rigging',
      rating: 5,
      reviewText: 'Excellent service from Mr. Hanif Bala. The manual H-mast stacker we bought handles 1.5 tons easily and steering rollers roll smoothly.',
      source: 'manual',
      status: 'active',
    },
    {
      clientName: 'Rashid Khan',
      companyName: 'Alang Marine Spares Trading',
      rating: 5,
      reviewText: 'We sourced manual geared trolleys and hand winches for shipyard operations. Build and welds are extremely robust.',
      source: 'manual',
      status: 'active',
    },
  ]);

  // 6. Site Settings
  console.log('🌱 Seeding Site Settings...');
  await SiteSettings.create([
    { settingKey: 'phone_number', settingValue: '+91-98252 14214' },
    { settingKey: 'whatsapp_number', settingValue: '+91-98252 14214' },
    { settingKey: 'email', settingValue: 'info@balaenterprise.com' },
    { settingKey: 'address', settingValue: 'Bala Enterprise, Plot No. 84, Chitra GIDC, Bhavnagar - 364004, Gujarat, India' },
    { settingKey: 'google_maps_url', settingValue: 'https://maps.google.com/?q=Chitra+GIDC+Bhavnagar' },
  ]);

  console.log('🏁 Scraped Seeding finished successfully!');
  await mongoose.disconnect();
}

seedRealData().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
