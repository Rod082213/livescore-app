// src/models/Team.ts

import mongoose, { Schema, Document, models } from 'mongoose';

// Interface for our document
export interface ITeam extends Document {
  apiId: number;
  name: string;
  logoUrl: string;
  leagueName: string;
  // --- NEW ---
  countryName: string; // e.g., "England"
  countryCode: string; // e.g., "GB"

  // --- EXISTING FIELDS for TEAM DETAILS ---
  fixtures?: object[];     
  squad?: object[];        
  detailsLastUpdatedAt?: Date; 
}

const TeamSchema: Schema = new Schema({
  apiId: { type: Number, required: true, unique: true, index: true },
  name: { type: String, required: true },
  logoUrl: { type: String, required: true },
  leagueName: { type: String, required: true },
  // --- NEW FIELDS ---
  countryName: { type: String, required: true },
  countryCode: { type: String, required: true },
  
  // --- EXISTING FIELDS for TEAM DETAILS ---
  fixtures: { type: [Object], default: [] },
  squad: { type: [Object], default: [] },
  detailsLastUpdatedAt: { type: Date },
}, { 
  timestamps: true 
});

const Team = models.Team || mongoose.model<ITeam>('Team', TeamSchema);

export default Team;