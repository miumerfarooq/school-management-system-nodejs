import { Document, Types } from "mongoose";
import { UserRole } from "./Role";
import { BaseDocument } from ".";

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
}

// IUserDocument → for actual database operations with Mongoose.
export interface UserDocument extends User, Document {}


// 🛠️ The role of Document
// In Mongoose, every model instance is a Mongoose Document.
// That means it carries not only your schema fields, but also built‑in methods like .save(), .remove(), .populate(), etc.
// If you want TypeScript to know about those methods, you extend from mongoose.Document.
