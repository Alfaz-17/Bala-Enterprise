import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { Category } from '../models/Category';
import { Product } from '../models/Product';
import { ProductImage } from '../models/ProductImage';

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

async function deleteScissorCategory() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    // Find category
    const cat = await Category.findOne({ slug: 'hydraulic-scissor-lift-table' });
    if (cat) {
      // Find products in this category
      const products = await Product.find({ category: cat._id });
      const productIds = products.map((p) => p._id);

      // Delete images
      await ProductImage.deleteMany({ product: { $in: productIds } });
      console.log(`Deleted images for ${productIds.length} products.`);

      // Delete products
      await Product.deleteMany({ category: cat._id });
      console.log(`Deleted ${products.length} products in Scissor Lift Table category.`);

      // Delete category
      await Category.deleteOne({ _id: cat._id });
      console.log('Successfully deleted Scissor Lift Table category!');
    } else {
      console.log('Scissor Lift Table category not found in DB.');
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  } catch (err) {
    console.error('Error deleting category:', err);
    process.exit(1);
  }
}

deleteScissorCategory();
