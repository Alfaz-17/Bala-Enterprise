/**
 * Reset all products to featured: false
 * 
 * This fixes the issue where the TradeIndia sync was automatically
 * setting featured: true for every imported product.
 * 
 * After running this, go to Admin → Products and manually toggle ON
 * only the products you want to showcase in "Our Main Products" on the homepage.
 * 
 * Usage: npx tsx src/scripts/reset-featured-products.ts
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function resetFeaturedProducts() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not found in .env.local');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  const result = await mongoose.connection.db!
    .collection('products')
    .updateMany(
      { featured: true },
      { $set: { featured: false } }
    );

  console.log(`\n✅ Reset ${result.modifiedCount} products from featured=true to featured=false`);
  console.log('\nNext steps:');
  console.log('  1. Go to Admin → Products');
  console.log('  2. Toggle ON only the products you want as "Our Main Products" on the homepage');
  console.log('  3. The homepage will show max 6 featured products\n');

  await mongoose.disconnect();
}

resetFeaturedProducts().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
