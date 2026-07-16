import mongoose, { Schema, Document, Model } from 'mongoose';
import { IProduct } from './Product';

export interface IProject extends Document {
  title: string;
  slug: string;
  clientName?: string;
  industryType?: string;
  product?: IProduct['_id'];
  description?: string;
  location?: string;
  completedDate?: Date;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    clientName: { type: String },
    industryType: { type: String },
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    description: { type: String },
    location: { type: String },
    completedDate: { type: Date },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

export const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
