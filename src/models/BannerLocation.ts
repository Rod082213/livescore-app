import mongoose, { Document, Schema, models, Types } from 'mongoose';

export interface IBannerLocation extends Document {
  _id: Types.ObjectId;
  name: string;
}

const BannerLocationSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});

const BannerLocation = models.BannerLocation || mongoose.model<IBannerLocation>('BannerLocation', BannerLocationSchema);

export default BannerLocation;