import mongoose, { Document, Schema, models } from 'mongoose';

export interface ICategory extends Document {
  name: string;
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
});

const Category = models.Category || mongoose.model<ICategory>('Category', CategorySchema);
export default Category;