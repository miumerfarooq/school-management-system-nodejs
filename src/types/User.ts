import { Document } from "mongoose";
import { BaseDocument, UserRole } from ".";

// IUser → for type-checking user objects throughout the application.
// IUser → for API contracts, validation, DTOs.
export interface User extends BaseDocument {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  profileImage?: string;
  isActive: boolean;
  refreshToken?: string;
  lastLogin?: Date;
  isEmailVerified?: boolean;
  failedLoginAttempts?: number;
  lockUntil?: Date | null;
}

// IUserDocument → for actual database operations with Mongoose.
export interface UserDocument extends User, Document {}


// 🛠️ The role of Document
// In Mongoose, every model instance is a Mongoose Document.
// That means it carries not only your schema fields, but also built‑in methods like .save(), .remove(), .populate(), etc.
// If you want TypeScript to know about those methods, you extend from mongoose.Document.


// ✅ Flow
// Request comes in → validated by Zod schema.
// Validated data → passed to service / controller.
// Controller → calls Mongoose model to save/retrieve data.
// Types ensure TypeScript knows the correct shape everywhere.

// This way you get:
// Type safety (User interface)
// DB integrity (User Mongoose model)
// API input validation (Zod schema)
