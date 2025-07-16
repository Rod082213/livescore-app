import mongoose, { Document, Schema, models } from 'mongoose';

export interface ITag extends Document {
  name: string;
}

const TagSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
});

const Tag = models.Tag || mongoose.model<ITag>('Tag', TagSchema);
export default Tag;