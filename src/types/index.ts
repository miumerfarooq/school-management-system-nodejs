import { Request } from "express";
import { Types } from "mongoose";

export interface BaseDocument {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN   = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
  STAFF   = 'staff',
  PARENT  = 'parent'
}

export enum Gender {
  MALE   = 'male',
  FEMALE = 'female',
  OTHER  = 'other'
}

export enum StudentStatus {
  ACTIVE    = 'active',
  INACTIVE  = 'inactive',
  GRADUATED = 'graduated',
  SUSPENDED = 'suspended'
}

export enum ParentRelationship {
  MOTHER   = 'mother',
  FATHER   = 'father',
  GUARDIAN = 'guardian',
  OTHER    = 'other'
}

// _id: Types.ObjectId,
export interface jwtPayload {
  _id: string;
  email: string;
  roles: UserRole[];
  type?: 'access' | 'refresh' | 'reset-password' | 'email-verify';
}

export interface AuthRequest extends Request {
  user?: jwtPayload;
}
