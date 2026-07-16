import mongoose, { Schema, Document, Model } from 'mongoose';
import { ICategory } from './Category';

export interface IProduct extends Document {
  name: string;
  slug: string;
  modelNumber?: string;
  capacity?: string;
  span?: string;
  specifications?: Record<string, any>;
  priceMin?: number;
  priceMax?: number;
  priceDisplay?: string;
  shortDescription?: string;
  fullDescription?: string;
  featured?: boolean;
  status: 'active' | 'inactive';
  category: ICategory['_id'];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    modelNumber: { type: String },
    capacity: { type: String },
    span: { type: String },
    specifications: { type: Schema.Types.Mixed },
    priceMin: { type: Number },
    priceMax: { type: Number },
    priceDisplay: { type: String },
    shortDescription: { type: String },
    fullDescription: { type: String },
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  },
  { timestamps: true }
);

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
