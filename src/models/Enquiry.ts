import mongoose, { Schema, Document, Model } from 'mongoose';
import { IProduct } from './Product';

export interface IEnquiry extends Document {
  name: string;
  companyName?: string;
  phone: string;
  email?: string;
  product?: IProduct['_id'];
  message: string;
  sourcePage: string;
  status: 'new' | 'contacted' | 'converted' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema = new Schema<IEnquiry>(
  {
    name: { type: String, required: true, trim: true },
    companyName: { type: String, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    message: { type: String, required: true },
    sourcePage: { type: String, required: true },
    status: {
      type: String,
      enum: ['new', 'contacted', 'converted', 'closed'],
      default: 'new',
    },
  },
  { timestamps: true }
);

export const Enquiry: Model<IEnquiry> =
  mongoose.models.Enquiry ||
  mongoose.model<IEnquiry>('Enquiry', EnquirySchema);
