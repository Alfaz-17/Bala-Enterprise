import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISiteSettings extends Document {
  settingKey: string;
  settingValue: string;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    settingKey: { type: String, required: true, unique: true, trim: true },
    settingValue: { type: String, required: true },
  },
  { timestamps: false }
);

export const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings ||
  mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
