import { Schema, model, Document } from "mongoose";

interface IPersonalDetails {
  name: string;
  surname: string;
  age: number;
  gender: "Male" | "Female" | "Other";
}

interface IContactDetails {
  phone: string;
  whatsappNumber?: string; // Optional if it is the same as phone
  email?: string; // Optional since email isn't common everywhere
  facebookLink?: string;
}

interface ICommunityAddress {
  isigodi: string; // Section / Area name
  landmarkReference: string; // e.g., "Next to Zamokuhle Tavern", "Near Faith Mission Church"
  istobhi: string; // Main taxi stop name used
  routeDescription: string; // e.g., "Take the gravel road past the primary school, 3rd house on the left"
  coordinates?: {
    // Saved from the one-time GPS capture
    latitude: number;
    longitude: number;
  };
}

export interface IUser extends Document {
  personalDetails: IPersonalDetails;
  contactDetails: IContactDetails;
  address: ICommunityAddress;
}

// 2. MONGOOSE SCHEMAS (For MongoDB validation)

const personalDetailsSchema = new Schema<IPersonalDetails>(
  {
    name: { type: String, required: true, trim: true },
    surname: { type: String, required: true, trim: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  },
  { _id: false },
); // _id: false stops Mongoose from adding a random ID to this sub-document

const contactDetailsSchema = new Schema<IContactDetails>(
  {
    phone: { type: String, required: true, unique: true, trim: true },
    whatsappNumber: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    facebookLink: { type: String, trim: true },
  },
  { _id: false },
);

const communityAddressSchema = new Schema<ICommunityAddress>(
  {
    isigodi: { type: String, required: true, trim: true },
    landmarkReference: { type: String, required: true, trim: true },
    istobhi: { type: String, required: true, trim: true },
    routeDescription: { type: String, required: true, trim: true },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
  },
  { _id: false },
);

const userSchema = new Schema<IUser>(
  {
    personalDetails: { type: personalDetailsSchema, required: true },
    contactDetails: { type: contactDetailsSchema, required: true },
    address: { type: communityAddressSchema, required: true },
  },
  { timestamps: true },
);

export const User = model<IUser>("User", userSchema);
