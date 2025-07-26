import mongoose, { Document, Schema, Model } from 'mongoose';

// Defines the structure of a single team object inside the cache
const TeamSchema = new Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  logo: { type: String, required: true },
}, { _id: false });

// Defines the structure of a league and its array of teams
const LeagueWithTeamsSchema = new Schema({
  leagueName: { type: String, required: true },
  teams: [TeamSchema],
}, { _id: false });

// This is the interface for the entire document that will be stored in MongoDB
export interface ILeagueListCache extends Document {
  identifier: string; // A static ID, e.g., "all-leagues", to easily find this document
  leagueData: {
    leagueName: string;
    teams: { id: number; name: string; logo: string; }[];
  }[];
  lastUpdated: Date; // A timestamp to check if the cache is old
}

// The main Mongoose Schema that enforces the structure
const LeagueListCacheSchema: Schema = new Schema({
  identifier: { type: String, required: true, unique: true, index: true },
  leagueData: [LeagueWithTeamsSchema],
  lastUpdated: { type: Date, required: true },
});

// Create the Mongoose model, preventing recompilation in development environments
const LeagueListCacheModel: Model<ILeagueListCache> = 
  mongoose.models.LeagueListCache || mongoose.model<ILeagueListCache>('LeagueListCache', LeagueListCacheSchema);

export default LeagueListCacheModel;