import mongoose, { Document, Schema, models } from 'mongoose';

export interface IBanner extends Document {
  imageUrl: string;
  targetUrl: string;
  displayLocation: string;
  isActive: boolean;
  sortOrder: number;
}

const BannerSchema: Schema = new Schema({
  imageUrl: { type: String, required: true },
  targetUrl: { type: String, required: true },
  displayLocation: { type: String, required: true, index: true },
  isActive: { type: Boolean, default: true, index: true },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

const Banner = models.Banner || mongoose.model<IBanner>('Banner', BannerSchema);

export default Banner;