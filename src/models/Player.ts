import mongoose, { Document, Schema, Model } from 'mongoose';

// Interface describing the properties of a Player document
export interface IPlayer extends Document {
  playerId: number; // The unique ID from the external API
  name: string;
  photo: string;
  age: number;
  nationality: string;
  team: {
    name: string;
    logo: string;
  };
  stats: {
    appearences: number;
    goals: number;
    assists: number | null;
  };
  lastUpdated: Date; // A timestamp to check how old the cached data is
}

// Mongoose Schema corresponding to the IPlayer interface
const PlayerSchema: Schema = new Schema({
  playerId: { type: Number, required: true, unique: true, index: true },
  name: { type: String, required: true },
  photo: { type: String, required: true },
  age: { type: Number, required: true },
  nationality: { type: String, required: true },
  team: {
    name: { type: String },
    logo: { type: String },
  },
  stats: {
    appearences: { type: Number },
    goals: { type: Number },
    assists: { type: Number, default: null },
  },
  lastUpdated: { type: Date, required: true },
});

// Create and export the Mongoose model.
// This pattern prevents Mongoose from recompiling the model on every hot-reload in development.
const PlayerModel: Model<IPlayer> = mongoose.models.Player || mongoose.model<IPlayer>('Player', PlayerSchema);

export default PlayerModel;