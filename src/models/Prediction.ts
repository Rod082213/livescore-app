// src/models/Prediction.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

// Interface for the Prediction document
export interface IPrediction extends Document {
  matchId: number;
  homeTeamName: string;
  awayTeamName: string;
  odds: {
    home: number;
    draw: number;
    away: number;
  };
  percentages: {
    home: number;
    draw: number;
    away: number;
  };
  predictedOutcome: 'home' | 'draw' | 'away';
  confidence: number;
}

// Mongoose Schema
const PredictionSchema: Schema<IPrediction> = new Schema({
  matchId: { type: Number, required: true, unique: true, index: true },
  homeTeamName: { type: String, required: true },
  awayTeamName: { type: String, required: true },
  odds: {
    home: { type: Number, required: true },
    draw: { type: Number, required: true },
    away: { type: Number, required: true },
  },
  percentages: {
    home: { type: Number, required: true },
    draw: { type: Number, required: true },
    away: { type: Number, required: true },
  },
  predictedOutcome: { type: String, required: true, enum: ['home', 'draw', 'away'] },
  confidence: { type: Number, required: true },
}, { timestamps: true });

// Prevent model overwrite in Next.js hot-reloading
const Prediction: Model<IPrediction> = mongoose.models.Prediction || mongoose.model<IPrediction>('Prediction', PredictionSchema);

export default Prediction;