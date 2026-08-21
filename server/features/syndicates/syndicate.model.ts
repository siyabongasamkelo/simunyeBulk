import { Schema, model, Document, Types } from "mongoose";

// 1. TYPESCRIPT INTERFACE (For autocomplete and strict type safety)
export interface ISyndicateGroup extends Document {
  name: string;
  adminName: string; // Name of the community leader running this group
  location: {
    isigodi: string; // The main area/section this group operates in
    istobhi: string; // Central taxi stop reference for the group
  };
  wholesalerName?: string; // e.g., "Makro", "Cambridge Food", or a local cash & carry
  products: string[]; // List of items they buy in bulk (e.g., ["10kg Rice", "5L Oil"])
  members: Types.ObjectId[]; // Array of User IDs belonging to this group
  whatsappLink?: string; // The invite link to their offline coordination group
  status: "active" | "completed"; // Active means still recruiting, completed means full/closed
}

// 2. MONGOOSE SCHEMA (For MongoDB validation)
const syndicateGroupSchema = new Schema<ISyndicateGroup>(
  {
    name: { type: String, required: true, trim: true },
    adminName: { type: String, required: true, trim: true },
    location: {
      isigodi: { type: String, required: true, trim: true },
      istobhi: { type: String, required: true, trim: true },
    },
    wholesalerName: { type: String, trim: true },
    products: [{ type: String, required: true }], // Array of text strings for simple item tracking
    members: [{ type: Schema.Types.ObjectId, ref: "User" }], // Populates user profiles directly
    whatsappLink: { type: String, trim: true },
    status: { type: String, enum: ["active", "completed"], default: "active" },
  },
  { timestamps: true },
);

// Indexing location fields for blazing fast matchmaking lookups later
syndicateGroupSchema.index({ "location.isigodi": 1, "location.istobhi": 1 });

export const SyndicateGroup = model<ISyndicateGroup>(
  "SyndicateGroup",
  syndicateGroupSchema,
);
