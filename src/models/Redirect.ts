// models/Redirect.js
import mongoose from 'mongoose';

const RedirectSchema = new mongoose.Schema({
  source: {
    type: String,
    required: [true, 'Please provide a source path.'],
    unique: true,
  },
  destination: {
    type: String,
    required: [true, 'Please provide a destination URL.'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Redirect || mongoose.model('Redirect', RedirectSchema);