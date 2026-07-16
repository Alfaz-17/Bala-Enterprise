import mongoose, { Schema, Document, Model } from 'mongoose';
import { IProduct } from './Product';

export interface IProductImage extends Document {
  url: string;
  altText?: string;
  sortOrder?: number;
  isPrimary?: boolean;
  product: IProduct['_id'];
  createdAt: Date;
  updatedAt: Date;
}

const ProductImageSchema = new Schema<IProductImage>(
  {
    url: { type: String, required: true },
    altText: { type: String },
    sortOrder: { type: Number, default: 0 },
    isPrimary: { type: Boolean, default: false },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  },
  { timestamps: true }
);

export const ProductImage: Model<IProductImage> =
  mongoose.models.ProductImage ||
  mongoose.model<IProductImage>('ProductImage', ProductImageSchema);
