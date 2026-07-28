import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { Category } from '../models/Category';

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

async function listCategories() {
  await mongoose.connect(MONGODB_URI);
  const categories = await Category.find({}).sort({ sortOrder: 1, name: 1 });
  console.log('=== CURRENT MONGO DB CATEGORIES (' + categories.length + ') ===');
  categories.forEach(c => {
    console.log(`ID: ${c._id} | Name: "${c.name}" | Slug: "${c.slug}" | Status: ${c.status}`);
  });
  await mongoose.disconnect();
}

listCategories().catch(console.error);
