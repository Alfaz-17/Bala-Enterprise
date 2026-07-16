
import mongoose, { Schema, Document, Model } from 'mongoose';
import { IProject } from './Project';

export interface IProjectImage extends Document {
  url: string;
  sortOrder?: number;
  project: IProject['_id'];
  createdAt: Date;
  updatedAt: Date;
}

const ProjectImageSchema = new Schema<IProjectImage>(
  {
    url: { type: String, required: true },
    sortOrder: { type: Number, default: 0 },
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  },
  { timestamps: true }
);

export const ProjectImage: Model<IProjectImage> =
  mongoose.models.ProjectImage ||
  mongoose.model<IProjectImage>('ProjectImage', ProjectImageSchema);
