import { z } from "zod";

//  1. USER VALIDATION SCHEMA
export const registerUserSchema = z.object({
  body: z.object({
    personalDetails: z.object({
      name: z
        .string()
        .min(1, "First name is required")
        .min(2, "Name is too short"),
      surname: z
        .string()
        .min(1, "Surname is required")
        .min(2, "Surname is too short"),
      age: z
        .number({ message: "Age must be a number" })
        .min(16, "Must be at least 16 to join a syndicate"),
      gender: z.enum(["Male", "Female", "Other"], {
        message: "Gender must be Male, Female, or Other",
      }),
    }),
    contactDetails: z.object({
      phone: z
        .string()
        .min(1, "Primary phone number is required")
        .min(10, "SA Phone numbers must be at least 10 digits")
        .regex(
          /^(?:\+27|0)[6-8][0-9]{8}$/,
          "Invalid South African phone number format",
        ),
      whatsappNumber: z.string().optional(),
      email: z
        .string()
        .email("Invalid email address format")
        .optional()
        .or(z.literal("")),
      facebookLink: z
        .string()
        .url("Invalid Facebook link format")
        .optional()
        .or(z.literal("")),
    }),
    address: z.object({
      isigodi: z
        .string()
        .min(1, "Isigodi / Section reference is required")
        .min(2),
      landmarkReference: z
        .string()
        .min(1, "A local landmark reference is required")
        .min(3, "Landmark reference is too short"),
      istobhi: z
        .string()
        .min(1, "Your primary taxi stop (istobhi) is required for grouping")
        .min(2),
      routeDescription: z
        .string()
        .min(1, "A brief walking route description is required")
        .min(5),
      coordinates: z
        .object({
          latitude: z.number(),
          longitude: z.number(),
        })
        .optional(),
    }),
  }),
});

// 2. SYNDICATE GROUP VALIDATION SCHEMA
export const createSyndicateSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Syndicate group name is required").min(3),
    adminName: z.string().min(1, "Group Admin name is required").min(2),
    location: z.object({
      isigodi: z
        .string()
        .min(1, "Target community section (isigodi) is required")
        .min(2),
      istobhi: z
        .string()
        .min(1, "Central pickup taxi stop (istobhi) is required")
        .min(2),
    }),
    wholesalerName: z.string().optional(),
    products: z
      .array(z.string())
      .min(1, "You must list at least one bulk product for this syndicate"),
    whatsappLink: z
      .string()
      .url("Invalid WhatsApp group invite link format")
      .optional()
      .or(z.literal("")),
  }),
});
