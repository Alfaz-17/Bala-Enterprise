import mongoose from 'mongoose';
import { connectToDatabase } from '../src/lib/mongoose';
import { ProductImage } from '../src/models/ProductImage';

async function main() {
  await connectToDatabase();
  console.log('Connected to DB');

  // Query using mongoose model
  const mDocs = await ProductImage.find().limit(3).lean();
  console.log('Mongoose docs:', JSON.stringify(mDocs, null, 2));

  // Query using raw mongodb
  const rawDocs = await mongoose.connection.db.collection('productimages').find().limit(3).toArray();
  console.log('Raw docs:', JSON.stringify(rawDocs, null, 2));

  await mongoose.disconnect();
}

main().catch(console.error);
