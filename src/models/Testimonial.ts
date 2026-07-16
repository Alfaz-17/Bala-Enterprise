import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITestimonial extends Document {
  clientName: string;
  companyName?: string;
  rating: number;
  reviewText: string;
  source: 'google' | 'manual' | 'indiamart';
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    clientName: { type: String, required: true, trim: true },
    companyName: { type: String, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    reviewText: { type: String, required: true },
    source: {
      type: String,
      enum: ['google', 'manual', 'indiamart'],
      default: 'manual',
    },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

export const Testimonial: Model<ITestimonial> =
  mongoose.models.Testimonial ||
  mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
