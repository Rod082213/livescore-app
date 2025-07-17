// src/models/Highlight.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface for our document
export interface IHighlight extends Document {
  matchId: number;
  matchDate: Date;
  homeTeamName: string;
  homeTeamLogo: string;
  awayTeamName: string;
  awayTeamLogo: string;
  score: string;
  leagueName: string;
  leagueLogo: string;
  highlightId: string; // YouTube Video ID
  highlightTitle: string;
  highlightEmbedUrl: string;
}

// Mongoose Schema
const HighlightSchema: Schema = new Schema({
  matchId: { type: Number, required: true, unique: true, index: true },
  matchDate: { type: Date, required: true },
  homeTeamName: { type: String, required: true },
  homeTeamLogo: { type: String, required: true },
  awayTeamName: { type: String, required: true },
  awayTeamLogo: { type: String, required: true },
  score: { type: String, required: true },
  leagueName: { type: String, required: true },
  leagueLogo: { type: String, required: true },
  highlightId: { type: String, required: true },
  highlightTitle: { type: String, required: true },
  highlightEmbedUrl: { type: String, required: true },
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

// This prevents Mongoose from recompiling the model on every hot-reload
const HighlightModel: Model<IHighlight> = mongoose.models.Highlight || mongoose.model<IHighlight>('Highlight', HighlightSchema);

export default HighlightModel;