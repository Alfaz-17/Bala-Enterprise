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

  // 1. Insert 9 Categories
  console.log('🌱 Seeding 9 Categories...');

  const catWireRopeHoist = await Category.create({
    name: 'Wire Rope Hoist',
    slug: 'wire-rope-hoist',
    description: 'Electric wire rope hoists and utility hoists built for heavy overhead lifting.',
    imageUrl: '/Categories_3d/0a4d7a0d-e724-4c3d-b5e3-d3020ba287bf.png',
    sortOrder: 1,
    status: 'active',
  });

  const catChainBlock = await Category.create({
    name: 'Chain Block',
    slug: 'chain-block',
    description: 'Manual and electric chain blocks and chain hoists for reliable vertical lifting.',
    imageUrl: '/Categories_3d/Chain_Block.png',
    sortOrder: 2,
    status: 'active',
  });

  const catManualStacker = await Category.create({
    name: 'Manual Stacker',
    slug: 'manual-stacker',
    description: 'Hydraulic manual stackers for efficient warehouse pallet stacking and loading.',
    imageUrl: '/Categories_3d/Stacker.png',
    sortOrder: 3,
    status: 'active',
  });

  const catHandPalletTruck = await Category.create({
    name: 'Hand Pallet Truck',
    slug: 'hand-pallet-truck',
    description: 'Heavy-duty hydraulic hand pallet trucks for horizontal material handling.',
    imageUrl: '/Categories_3d/35e73dd5-60db-4891-8715-b6c2ed715917.png',
    sortOrder: 4,
    status: 'active',
  });

  const catGearedTrolley = await Category.create({
    name: 'Geared Trolley',
    slug: 'manual-geared-trolley',
    description: 'Geared traveling monorail trolleys for secure beam movement.',
    imageUrl: '/Categories_3d/Geared_Trolley.png',
    sortOrder: 5,
    status: 'active',
  });

  const catScissorLift = await Category.create({
    name: 'Scissor Lift Table',
    slug: 'hydraulic-scissor-lift-table',
    description: 'Hydraulic scissor lift tables for ergonomic height adjustment.',
    imageUrl: '/Categories_3d/Scissor Lift Table.png',
    sortOrder: 6,
    status: 'active',
  });

  const catFloorCrane = await Category.create({
    name: 'Floor Crane',
    slug: 'hydraulic-floor-crane',
    description: 'Mobile hydraulic floor cranes for versatile shop floor hoisting.',
    imageUrl: '/Categories_3d/Floor crane.png',
    sortOrder: 7,
    status: 'active',
  });

  const catElectricWinch = await Category.create({
    name: 'Electric Winch',
    slug: 'electric-winch',
    description: 'Electric winches, drum winches, and builder winches for heavy pulling.',
    imageUrl: '/Categories_3d/837efcf2-bdd8-4892-8868-267e6b22ca49.png',
    sortOrder: 8,
    status: 'active',
  });

  const catHandWinch = await Category.create({
    name: 'Hand Winch',
    slug: 'hand-winch',
    description: 'Self-locking and worm-gear manual hand winches for pulling and rigging.',
    imageUrl: '/Categories_3d/Hand_winch.png',
    sortOrder: 9,
    status: 'active',
  });

  console.log('✅ 9 Categories seeded successfully');

  // Helper function to seed product and its primary image
  async function addProduct(data: {
    name: string;
    slug: string;
    modelNumber: string;
    capacity?: string;
    priceMin?: number;
    priceDisplay: string;
    shortDescription: string;
    imageUrl: string;
    category: any;
    specifications: Record<string, string>;
  }) {
    const prod = await Product.create({
      name: data.name,
      slug: data.slug,
      modelNumber: data.modelNumber,
      capacity: data.capacity,
      priceMin: data.priceMin,
      priceDisplay: data.priceDisplay,
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

  console.log('🌱 Seeding 38 Scraped Products...');

  // --- Category 1: Wire Rope Hoist ---
  const p1 = await addProduct({
    name: 'CD1 Electric Wire Rope Hoist',
    slug: 'cd1-electric-wire-rope-hoist',
    modelNumber: 'BE-CD1-WRH',
    capacity: '2 Ton',
    priceMin: 16000,
    priceDisplay: '₹ 16,000',
    shortDescription: 'Industrial grade CD1 model electric wire rope hoist with motorized trolley.',
    imageUrl: 'https://cpimg.tistatic.com/12456682/b/5/CD1-Electric-Wire-Rope-Hoist.jpg',
    category: catWireRopeHoist,
    specifications: {
      'Capacity': '2 Ton',
      'Power': '1.5 kW',
      'Duty Cycle': 'Industrial Use',
      'Lifting Speed': '8 m/min',
    },
  });

  const p2 = await addProduct({
    name: '220v Electric Mini Hoist 1TON',
    slug: '220v-electric-mini-hoist-1ton',
    modelNumber: 'BE-EMH-1T',
    capacity: '100 - 200 Kg',
    priceMin: 13500,
    priceDisplay: '₹ 13,500',
    shortDescription: 'Single-phase 220V electric mini hoist for light utility workshop and warehouse lifting.',
    imageUrl: 'https://cpimg.tistatic.com/12456683/b/4/220v-Electric-Mini-Hoist-1TON..jpg',
    category: catWireRopeHoist,
    specifications: {
      'Capacity': '100 - 200 Kg',
      'Voltage': '220V Single Phase',
      'Lifting Height': '6m (single hook) / 12m (double hook)',
      'Speed': '1440 rpm',
      'Sling Type': 'Wire Rope',
    },
  });

  // --- Category 2: Chain Block ---
  const p3 = await addProduct({
    name: 'Chain Block 2 Ton D/F',
    slug: 'chain-block-2-ton-df',
    modelNumber: 'BE-CB-2T-DF',
    capacity: '1 - 2 Ton',
    priceMin: 2500,
    priceDisplay: '₹ 2,500',
    shortDescription: 'Double-fall manual chain block pulley built for heavy factory lifting.',
    imageUrl: 'https://cpimg.tistatic.com/12456701/b/4/Chain-Block-2-Ton-D-F..jpg',
    category: catChainBlock,
    specifications: {
      'Capacity': '1 - 2 Ton',
      'Operation': 'Manual Hook Mounted',
      'Mount Type': 'Hook Mounted',
      'Lifting Height': '3 meters',
    },
  });

  const p4 = await addProduct({
    name: 'VT Model Chain Block',
    slug: 'vt-model-chain-block',
    modelNumber: 'BE-CB-VT-2T',
    capacity: '2 Ton',
    priceMin: 4500,
    priceDisplay: '₹ 4,500',
    shortDescription: 'Premium VT model manual chain pulley block with alloy steel body.',
    imageUrl: 'https://cpimg.tistatic.com/12456702/b/4/VT-Model-Chain-Block..jpg',
    category: catChainBlock,
    specifications: {
      'Capacity': '2 Ton',
      'Chain Type': 'Grade 80 Load Chain',
      'Body Material': 'Alloy Steel Body',
      'Lifting Height': '3 meters',
    },
  });

  const p5 = await addProduct({
    name: 'Chain Hoist Lever Block',
    slug: 'chain-hoist-lever-block',
    modelNumber: 'BE-LB-1T',
    capacity: '1 Ton',
    priceDisplay: 'Price on Request',
    shortDescription: 'Manual lever hoist block with double pawl braking for precise rigging alignment.',
    imageUrl: 'https://cpimg.tistatic.com/12456703/b/4/Chain-Hoist-Lever-Block..png',
    category: catChainBlock,
    specifications: {
      'Capacity': '1 Ton',
      'Operation': 'Lever Operated',
      'Rotation': '360 degree rotation hook',
      'Lifting Height': '3 meters',
      'Features': 'Portable & Lightweight',
    },
  });

  const p6 = await addProduct({
    name: '440volt DHS Model Electric Chain Block',
    slug: '440volt-dhs-model-electric-chain-block',
    modelNumber: 'BE-DHS-440V-1T',
    capacity: '1 Ton',
    priceMin: 13000,
    priceDisplay: '₹ 13,000',
    shortDescription: 'Heavy-duty DHS model electric chain hoist running on 3-phase power.',
    imageUrl: 'https://cpimg.tistatic.com/12456704/b/4/440volt-DHS-Model-Electric-Chain-Block..jpg',
    category: catChainBlock,
    specifications: {
      'Capacity': '1 Ton',
      'Operating Voltage': '440V',
      'Control': 'Remote / Pendant Controller',
      'Speed': 'Dual Speed',
      'Lifting Height': '6 meters',
    },
  });

  const p7 = await addProduct({
    name: 'Chain Block V/T 1 Ton',
    slug: 'chain-block-vt-1t',
    modelNumber: 'BE-CB-VT-1T',
    capacity: '1 Ton',
    priceMin: 3250,
    priceDisplay: '₹ 3,250',
    shortDescription: 'Hand operated manual chain pulley block with heat-treated gears.',
    imageUrl: '/Images_Factory/chain_hoists_refined.png',
    category: catChainBlock,
    specifications: {
      'Capacity': '1 Ton',
      'Operation': 'Hand chain operated',
      'Gears': 'Heat-treated gears',
      'Finish': 'Corrosion resistant coating',
    },
  });

  const p8 = await addProduct({
    name: 'Chain Block V/T 2 Ton',
    slug: 'chain-block-vt-2t',
    modelNumber: 'BE-CB-VT-2T-B',
    capacity: '2 Ton',
    priceMin: 4550,
    priceDisplay: '₹ 4,550',
    shortDescription: 'Double fall manual chain pulley block with overload protection.',
    imageUrl: '/Images_Factory/chain_hoists_refined.png',
    category: catChainBlock,
    specifications: {
      'Capacity': '2 Ton',
      'Operation': 'Hand chain operated',
      'Safety': 'Overload protection mechanism',
    },
  });

  const p9 = await addProduct({
    name: 'Chain Block V/T 3 Ton',
    slug: 'chain-block-vt-3t',
    modelNumber: 'BE-CB-VT-3T',
    capacity: '3 Ton',
    priceMin: 5350,
    priceDisplay: '₹ 5,350',
    shortDescription: 'Triple ton manual chain block pulley with 360 swivel safety hook.',
    imageUrl: '/Images_Factory/chain_hoists_refined.png',
    category: catChainBlock,
    specifications: {
      'Capacity': '3 Ton',
      'Operation': 'Manual Hand Operated',
      'Hook Type': '360 degree swivel safety hook',
    },
  });

  const p10 = await addProduct({
    name: 'Chain Block V/T 5 Ton',
    slug: 'chain-block-vt-5t',
    modelNumber: 'BE-CB-VT-5T',
    capacity: '5 Ton',
    priceMin: 7500,
    priceDisplay: '₹ 7,500',
    shortDescription: 'High-capacity manual chain block pulley with anti-twist chain guide.',
    imageUrl: '/Images_Factory/chain_hoists_refined.png',
    category: catChainBlock,
    specifications: {
      'Capacity': '5 Ton',
      'Operation': 'Manual Hand Operated',
      'Chain Guide': 'Anti-twist chain guide',
      'Features': 'Overload protection',
    },
  });

  // --- Category 3: Manual Stacker ---
  const p11 = await addProduct({
    name: 'C Type Manual Stacker',
    slug: 'c-type-manual-stacker',
    modelNumber: 'BE-MS-C2T',
    capacity: '2000 kg',
    priceMin: 34500,
    priceDisplay: '₹ 34,500',
    shortDescription: 'Heavy-duty C-Channel structural steel manual hydraulic stacker for narrow aisle pallet stacking.',
    imageUrl: 'https://cpimg.tistatic.com/12456714/b/4/C-Type-Manual-Stacker..png',
    category: catManualStacker,
    specifications: {
      'Load Capacity': '2000 kg',
      'Lift Height': '1600 mm',
      'Lift Drive': 'Hydraulic Pump Lift',
      'Chassis Material': 'Mild Steel Powder Coated',
      'Wheels': 'High-strength Nylon Wheels',
    },
  });

  const p12 = await addProduct({
    name: 'H Type Manual Stacker',
    slug: 'h-type-manual-stacker',
    modelNumber: 'BE-MS-H1T',
    capacity: '1000 kg',
    priceMin: 20000,
    priceDisplay: '₹ 20,000',
    shortDescription: 'Robust H-Type steel mast manual stacker with stable weight distribution.',
    imageUrl: 'https://cpimg.tistatic.com/12456715/b/4/H-Type-Manual-Stacker..png',
    category: catManualStacker,
    specifications: {
      'Load Capacity': '1000 kg',
      'Mast Construction': 'Single Mast H-Type Steel',
      'Operation': 'Lever/Handle Operated Pump',
      'Lift Height': '1600 mm',
      'Wheels': 'High-strength Nylon Wheels',
    },
  });

  // --- Category 4: Hand Pallet Truck ---
  const p13 = await addProduct({
    name: 'Hand Pallet Truck',
    slug: 'hand-pallet-truck',
    modelNumber: 'BE-PT-2.5T',
    capacity: '2500 kg',
    priceMin: 11500,
    priceDisplay: '₹ 11,500',
    shortDescription: 'Hydraulic hand pallet truck with reinforced fork ribs for rapid warehouse transport.',
    imageUrl: 'https://cpimg.tistatic.com/12456716/b/4/Hand-Pallet-Truck..png',
    category: catHandPalletTruck,
    specifications: {
      'Capacity': '2500 kg',
      'Pump Type': 'Leakproof integrated manual hydraulic pump',
      'Body Material': 'Heavy-duty Steel Construction',
      'Wheels': '3 Nylon Rollers (steering + load rollers)',
      'Fork Size': '800mm x 550mm',
      'Finish': 'Industrial Powder Coated',
    },
  });

  // --- Category 5: Geared Trolley ---
  const p14 = await addProduct({
    name: 'Manual Geared Trolley',
    slug: 'manual-geared-trolley',
    modelNumber: 'BE-GT-3T',
    capacity: '3 Ton',
    priceMin: 4150,
    priceDisplay: '₹ 4,150',
    shortDescription: 'I-Beam monorail geared traveling trolley with precision machined steel wheels.',
    imageUrl: 'https://cpimg.tistatic.com/12456731/b/4/Manual-Geared-Trolley..jpg',
    category: catGearedTrolley,
    specifications: {
      'Capacity': '3 Ton',
      'Operation': 'Gear Operated Hand Chain',
      'Material': 'Mild Steel Construction',
      'Beam Flange Width': '75mm to 125mm',
      'Standard Lift': '3 meters standard hand chain',
      'Application': 'Overhead EOT Cranes & Monorail I-beams',
    },
  });

  // --- Category 6: Scissor Lift Table ---
  const p15 = await addProduct({
    name: 'Hydraulic Scissor Lift Table',
    slug: 'hydraulic-scissor-lift-table',
    modelNumber: 'BE-SLT-500',
    capacity: '500 kg',
    priceMin: 21500,
    priceDisplay: '₹ 21,500',
    shortDescription: 'Hydraulic scissor lift table with stationary or mobile electric power.',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800',
    category: catScissorLift,
    specifications: {
      'Load Capacity': '500 kg',
      'Operation': 'Push button / foot pedal control',
      'Motor': 'AC Motor 1.2 kW',
      'Voltage': '220V / 380V options',
      'Platform Size': '900mm x 500mm',
      'Wheels': 'Swivel PU wheels with foot-brakes',
    },
  });

  // --- Category 7: Floor Crane ---
  const p16 = await addProduct({
    name: 'Hydraulic Floor Crane',
    slug: 'hydraulic-floor-crane',
    modelNumber: 'BE-FC-1T',
    capacity: '1000 kg (1 Ton)',
    priceDisplay: 'Price on Request',
    shortDescription: 'Mobile hydraulic floor crane with foldable counterweight outriggers.',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800',
    category: catFloorCrane,
    specifications: {
      'Capacity': '1000 kg (1 Ton)',
      'Pump Type': 'Manual hydraulic hand pump',
      'Frame Type': 'Foldable space-saving design',
      'Boom Range': '1600mm extended length',
      'Lifting Height': '2200mm maximum hook height',
      'Wheels': 'Polyurethane (PU) wheels',
      'Safety': 'Overload safety bypass valve',
      'Pressure Capacity': '180 Bar cylinder rating',
    },
  });

  // --- Category 8: Electric Winch ---
  const p17 = await addProduct({
    name: 'CDK1 Aluminum Electric Winch',
    slug: 'cdk1-aluminum-electric-winch',
    modelNumber: 'BE-CDK1-1T',
    capacity: '1 Ton',
    priceDisplay: 'Price on Request',
    shortDescription: 'Compact aluminum body electric winch with high heat dissipation housing.',
    imageUrl: 'https://cpimg.tistatic.com/12456688/b/4/CDK1-Aluminum-Electric-Winch..jpg',
    category: catElectricWinch,
    specifications: {
      'Capacity': '1 Ton',
      'Drive Type': 'Electric Motorized',
      'Pull Speed': '15 meters per minute',
      'Drum Capacity': '50 meters wire rope capacity',
      'Wire Rope Size': '8 mm diameter',
    },
  });

  const p18 = await addProduct({
    name: 'Clutch Winch',
    slug: 'clutch-winch',
    modelNumber: 'BE-CW-1T',
    capacity: '1 Ton',
    priceMin: 16500,
    priceDisplay: '₹ 16,500',
    shortDescription: 'Electric clutch winch machine with manual clutch disengagement lever.',
    imageUrl: 'https://cpimg.tistatic.com/12456689/b/4/Clutch-Winch..png',
    category: catElectricWinch,
    specifications: {
      'Capacity': '1 Ton',
      'Power Source': 'Electric motor',
      'Drum Capacity': '20 cu.in drum size',
      'Winch Weight': '40 kg',
    },
  });

  const p19 = await addProduct({
    name: 'Hand Winch 1200 LBS',
    slug: 'hand-winch-1200-lbs',
    modelNumber: 'BE-HW-1200',
    capacity: '2 Ton',
    priceMin: 1350,
    priceDisplay: '₹ 1,350',
    shortDescription: 'High load manual winch with self-locking steel gear reduction.',
    imageUrl: 'https://cpimg.tistatic.com/12456690/b/4/Hand-Winch-1200-LBS..jpg',
    category: catElectricWinch,
    specifications: {
      'Rated Capacity': '2 Ton equivalent pulling force (1200 LBS rating)',
      'Wire Rope': '10 mm diameter',
      'Drum Capacity': '20 meters rope capacity',
    },
  });

  const p20 = await addProduct({
    name: '12v Jeep Winch',
    slug: '12v-jeep-winch',
    modelNumber: 'BE-JW-12V',
    capacity: '500 kg',
    priceMin: 14500,
    priceDisplay: '₹ 14,500',
    shortDescription: '12V DC heavy-duty electric recovery winch for jeeps and utility vehicles.',
    imageUrl: 'https://cpimg.tistatic.com/12456691/b/4/12v-Jeep-Winch..png',
    category: catElectricWinch,
    specifications: {
      'Capacity': '500 kg',
      'Input Voltage': '12V DC Power',
      'Line Speed': '12 meters per minute',
      'Drum Wire': '50 meters capacity',
    },
  });

  const p21 = await addProduct({
    name: 'KCD Winch',
    slug: 'kcd-winch',
    modelNumber: 'BE-KCD-1T',
    capacity: '1 Ton',
    priceMin: 16000,
    priceDisplay: '₹ 16,000',
    shortDescription: 'Standard KCD series electric builder winch machine.',
    imageUrl: 'https://cpimg.tistatic.com/12456695/b/4/KCD-Winch..png',
    category: catElectricWinch,
    specifications: {
      'Capacity': '1 Ton',
      'Phase': 'Single Phase Electric',
      'Drum Capacity': '20 meters rope capacity',
      'Wire Rope': '8 mm diameter',
    },
  });

  const p22 = await addProduct({
    name: '220volt KCD Electric Winch',
    slug: '220volt-kcd-electric-winch',
    modelNumber: 'BE-KCD-220V',
    capacity: '1 Ton',
    priceMin: 16000,
    priceDisplay: '₹ 16,000',
    shortDescription: 'Single-phase 220V KCD builder winch machine for standard sockets.',
    imageUrl: 'https://cpimg.tistatic.com/12456696/b/4/220volt-KCD-Electric-Winch..png',
    category: catElectricWinch,
    specifications: {
      'Capacity': '1 Ton',
      'Voltage': '220V Single Phase',
      'Lifting Speed': '10 meters per minute',
    },
  });

  const p23 = await addProduct({
    name: '440volt KCD Winch',
    slug: '440volt-kcd-winch',
    modelNumber: 'BE-KCD-440V',
    capacity: '1 Ton',
    priceMin: 30000,
    priceDisplay: '₹ 30,000',
    shortDescription: 'Heavy-duty 440V KCD model electric winch for engineering and site hoisting.',
    imageUrl: 'https://cpimg.tistatic.com/12456697/b/4/440volt-KCD-Winch..png',
    category: catElectricWinch,
    specifications: {
      'Capacity': '1 Ton',
      'Operating Voltage': '440V 3-Phase',
      'Drum Capacity': '20 meters',
    },
  });

  const p24 = await addProduct({
    name: 'Hand winch 1800 LBS',
    slug: 'hand-winch-1800-lbs',
    modelNumber: 'BE-HW-1800',
    capacity: '816 kg (1800 lbs)',
    priceMin: 2300,
    priceDisplay: '₹ 2,300',
    shortDescription: 'Wall-mounted manual hand winch with self-locking spur gears.',
    imageUrl: 'https://cpimg.tistatic.com/12456690/b/4/Hand-Winch-1200-LBS..jpg',
    category: catElectricWinch,
    specifications: {
      'Pulling Capacity': '816 kg (1800 lbs)',
      'Operation': 'Manual Gear Operated',
      'Wire Rope': '5 mm diameter',
      'Drum Capacity': '8 meters rope capacity',
    },
  });

  const p25 = await addProduct({
    name: 'HAND WINCH 2600 LBS',
    slug: 'hand-winch-2600-lbs',
    modelNumber: 'BE-HW-2600',
    capacity: '1180 kg (2600 lbs)',
    priceMin: 3730,
    priceDisplay: '₹ 3,730',
    shortDescription: 'Heavy-duty worm-gear manual hand winch for high capacity recovery.',
    imageUrl: 'https://cpimg.tistatic.com/12456690/b/4/Hand-Winch-1200-LBS..jpg',
    category: catElectricWinch,
    specifications: {
      'Pulling Capacity': '1180 kg (2600 lbs)',
      'Operation': 'Manual Hand Operated',
      'Wire Rope': '6 mm diameter',
    },
  });

  const p26 = await addProduct({
    name: 'JEEP WINCH 6500 LBS',
    slug: 'jeep-winch-6500-lbs',
    modelNumber: 'BE-JW-6500',
    capacity: '2948 kg',
    priceMin: 15800,
    priceDisplay: '₹ 15,800',
    shortDescription: '12V DC electric vehicle recovery winch with steel mounting base.',
    imageUrl: 'https://cpimg.tistatic.com/12456691/b/4/12v-Jeep-Winch..png',
    category: catElectricWinch,
    specifications: {
      'Capacity': '2948 kg (6500 lbs)',
      'Voltage': '12V DC Power',
      'Line Speed': '6.8 meters per minute',
      'Drum Wire': '28 meters capacity',
    },
  });

  const p27 = await addProduct({
    name: 'JEEP WINCH 13500 LBS',
    slug: 'jeep-winch-13500-lbs',
    modelNumber: 'BE-JW-13500',
    capacity: '6123 kg',
    priceMin: 18500,
    priceDisplay: '₹ 18,500',
    shortDescription: 'Ultra heavy recovery jeep winch with high tensile wire rope.',
    imageUrl: 'https://cpimg.tistatic.com/12456691/b/4/12v-Jeep-Winch..png',
    category: catElectricWinch,
    specifications: {
      'Capacity': '6123 kg (13500 lbs)',
      'Voltage': '12V DC Motor',
      'Wire Rope': '9.5 mm diameter',
      'Drum Capacity': '26 meters',
    },
  });

  const p28 = await addProduct({
    name: 'HHBB Electric chain hoist 1TON (variant A)',
    slug: 'hhbb-electric-chain-hoist-1ton-a',
    modelNumber: 'BE-HHBB-1T-A',
    capacity: '1 Ton',
    priceMin: 46500,
    priceDisplay: '₹ 46,500',
    shortDescription: 'Premium HHBB model heavy duty electric chain block with side braking.',
    imageUrl: 'https://cpimg.tistatic.com/12456704/b/4/440volt-DHS-Model-Electric-Chain-Block..jpg',
    category: catElectricWinch,
    specifications: {
      'Capacity': '1 Ton',
      'Power': 'Electric Motorized',
      'Lifting Speed': '6.8 meters per minute',
    },
  });

  const p29 = await addProduct({
    name: 'HHBB Electric chain hoist 1TON (variant B)',
    slug: 'hhbb-electric-chain-hoist-1ton-b',
    modelNumber: 'BE-HHBB-1T-B',
    capacity: '1 Ton',
    priceMin: 77500,
    priceDisplay: '₹ 77,500',
    shortDescription: 'Robust HHBB model electric chain block with alloy load chain.',
    imageUrl: 'https://cpimg.tistatic.com/12456704/b/4/440volt-DHS-Model-Electric-Chain-Block..jpg',
    category: catElectricWinch,
    specifications: {
      'Capacity': '1 Ton',
      'Power Source': 'Electric motor',
      'Lifting Speed': '6.6 meters per minute',
      'Chain Size': '7.1 mm alloy load chain',
    },
  });

  const p30 = await addProduct({
    name: 'HHBB Chain Hoist 3TON',
    slug: 'hhbb-chain-hoist-3ton',
    modelNumber: 'BE-HHBB-3T',
    capacity: '3 Ton',
    priceMin: 83600,
    priceDisplay: '₹ 83,600',
    shortDescription: 'Industrial EOT hoist geared motor chain block.',
    imageUrl: 'https://cpimg.tistatic.com/12456704/b/4/440volt-DHS-Model-Electric-Chain-Block..jpg',
    category: catElectricWinch,
    specifications: {
      'Capacity': '3 Ton',
      'Power': '3-Phase Electric Motorized',
      'Lifting Speed': '2.7 meters per minute',
      'Drum Capacity': '10 meters load chain',
    },
  });

  const p31 = await addProduct({
    name: 'DHS Electric Chain block 1 ton',
    slug: 'dhs-electric-chain-block-1-ton',
    modelNumber: 'BE-DHS-1T',
    capacity: '1 Ton',
    priceMin: 13250,
    priceDisplay: '₹ 13,250',
    shortDescription: 'Standard DHS electric hoisting chain block with control pendant.',
    imageUrl: 'https://cpimg.tistatic.com/12456704/b/4/440volt-DHS-Model-Electric-Chain-Block..jpg',
    category: catElectricWinch,
    specifications: {
      'Capacity': '1 Ton',
      'Operation': 'Electric pendant controls',
      'Lifting Speed': '6.6 meters per minute',
      'Load Chain length': '6 meters',
    },
  });

  const p32 = await addProduct({
    name: 'DHS Electric Chain block 2 ton',
    slug: 'dhs-electric-chain-block-2-ton',
    modelNumber: 'BE-DHS-2T',
    capacity: '2 Ton',
    priceMin: 15000,
    priceDisplay: '₹ 15,000',
    shortDescription: 'Double-fall DHS electric chain hoist for factory utility lifting.',
    imageUrl: 'https://cpimg.tistatic.com/12456704/b/4/440volt-DHS-Model-Electric-Chain-Block..jpg',
    category: catElectricWinch,
    specifications: {
      'Capacity': '2 Ton',
      'Operation': 'Electric Motorized',
      'Lifting Speed': '6.6 meters per minute',
      'Load Chain length': '12 meters',
    },
  });

  const p33 = await addProduct({
    name: 'DHS Electric Chain block 3 ton',
    slug: 'dhs-electric-chain-block-3-ton',
    modelNumber: 'BE-DHS-3T',
    capacity: '3 Ton',
    priceMin: 15750,
    priceDisplay: '₹ 15,750',
    shortDescription: 'High load DHS electric chain block. Minimum Order Quantity applies.',
    imageUrl: 'https://cpimg.tistatic.com/12456704/b/4/440volt-DHS-Model-Electric-Chain-Block..jpg',
    category: catElectricWinch,
    specifications: {
      'Capacity': '3 Ton',
      'Lifting Speed': '4.8 meters per minute',
      'Order Notice': 'MOQ 14 sets for special orders',
    },
  });

  const p34 = await addProduct({
    name: 'DHS Electric Chain block 5 ton',
    slug: 'dhs-electric-chain-block-5-ton',
    modelNumber: 'BE-DHS-5T',
    capacity: '5 Ton',
    priceMin: 18550,
    priceDisplay: '₹ 18,550',
    shortDescription: 'Heavy-duty DHS electric hoist crane block with thick high-tensile wire rope drum.',
    imageUrl: 'https://cpimg.tistatic.com/12456704/b/4/440volt-DHS-Model-Electric-Chain-Block..jpg',
    category: catElectricWinch,
    specifications: {
      'Capacity': '5 Ton',
      'Lifting Speed': '3.9 meters per minute',
      'Wire Rope Sling': '11.2 mm diameter',
    },
  });

  const p35 = await addProduct({
    name: 'Clutch winch 1 ton 500 mtr',
    slug: 'clutch-winch-1-ton-500-mtr',
    modelNumber: 'BE-CW-500M',
    capacity: '1 Ton',
    priceMin: 17000,
    priceDisplay: '₹ 17,000',
    shortDescription: 'High spooling electric clutch winch machine with 500 meters rope limit.',
    imageUrl: 'https://cpimg.tistatic.com/12456689/b/4/Clutch-Winch..png',
    category: catElectricWinch,
    specifications: {
      'Capacity': '1 Ton',
      'Wire Rope Spool': '500 meters capacity',
      'Features': 'Manual clutch release gear',
    },
  });

  // --- Category 9: Hand Winch ---
  const p36 = await addProduct({
    name: 'JSW HAND WINCH 1 TON',
    slug: 'jsw-hand-winch-1-ton',
    modelNumber: 'BE-JSW-HW1T',
    capacity: '1 Ton',
    priceMin: 11550,
    priceDisplay: '₹ 11,550',
    shortDescription: 'Worm-gear manual hand winch for 1-ton pulling applications.',
    imageUrl: 'https://cpimg.tistatic.com/12456692/b/4/JSW-Series-Hand-Winch..jpg',
    category: catHandWinch,
    specifications: {
      'Capacity': '1 Ton',
      'Operation': 'Manual Worm Gear Handcrank',
      'Drum Capacity': '15 meters',
      'Wire Rope': '8 mm diameter',
    },
  });

  const p37 = await addProduct({
    name: 'JSW Series Hand Winch',
    slug: 'jsw-series-hand-winch',
    modelNumber: 'BE-JSW-HW0.5T',
    capacity: '500 kg',
    priceMin: 9000,
    priceDisplay: '₹ 9,000',
    shortDescription: 'Heavy-duty JSW model manual hand winch for recovery pulling.',
    imageUrl: 'https://cpimg.tistatic.com/12456692/b/4/JSW-Series-Hand-Winch..jpg',
    category: catHandWinch,
    specifications: {
      'Capacity': '500 kg',
      'Operation': 'Manual Hand Operated',
      'Drum Capacity': '20 meters',
      'Wire Rope': '8 mm diameter',
    },
  });

  const p38 = await addProduct({
    name: 'JSW HAND WINCH 2 TON',
    slug: 'jsw-hand-winch-2-ton',
    modelNumber: 'BE-JSW-HW2T',
    capacity: '2 Ton',
    priceMin: 15550,
    priceDisplay: '₹ 15,550',
    shortDescription: 'Heavy-duty JSW manual worm-gear winch for 2-ton load recovery.',
    imageUrl: 'https://cpimg.tistatic.com/12456692/b/4/JSW-Series-Hand-Winch..jpg',
    category: catHandWinch,
    specifications: {
      'Capacity': '2 Ton',
      'Operation': 'Manual Worm Gear Handcrank',
      'Drum Capacity': '25 meters',
      'Wire Rope': '8 mm diameter',
    },
  });

  console.log('✅ 38 Products seeded successfully');

  // 4. Case Studies / Completed Projects
  console.log('🌱 Seeding Projects...');
  const proj1 = await Project.create({
    title: 'Hydraulic Scissor Lift Installation at Cargo Yard',
    slug: 'hydraulic-scissor-lift-table-installation-cargo-yard',
    clientName: 'Mundra Terminal Logistics',
    industryType: 'Logistics & Distribution',
    location: 'Mundra Port, Gujarat',
    completedDate: new Date('2026-04-12'),
    product: p15._id, // References Scissor Lift Table
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
    product: p1._id, // References CD1 Electric Wire Rope Hoist
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
  console.log('✅ Projects seeded successfully');

  // 5. Testimonials
  console.log('🌱 Seeding Testimonials...');
  await Testimonial.create([
    {
      clientName: 'Hanif Patel',
      companyName: 'Patel Crane & Rigging',
      rating: 5,
      reviewText: 'Excellent service from Mr. Mustufa. The manual H-mast stacker we bought handles 1.5 tons easily and steering rollers roll smoothly.',
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
  console.log('✅ Testimonials seeded successfully');

  // 6. Site Settings
  console.log('🌱 Seeding Site Settings...');
  await SiteSettings.create([
    { settingKey: 'phone_number', settingValue: '+91 7315122944' },
    { settingKey: 'whatsapp_number', settingValue: '+91 7315122944' },
    { settingKey: 'email', settingValue: 'info@balaenterprise.com' },
    { settingKey: 'address', settingValue: 'Plot No 28 A 5, Opp. Alang House Gali, Moti Talav Road, Bhavnagar - 360041, Gujarat, India' },
    { settingKey: 'google_maps_url', settingValue: 'https://maps.google.com/?q=Moti+Talav+Road+Bhavnagar' },
    { settingKey: 'logo', settingValue: '/logo.png' },
  ]);
  console.log('✅ Site Settings seeded successfully');

  console.log('🏁 Real Database Seeding finished successfully!');
  await mongoose.disconnect();
}

seedRealData().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
