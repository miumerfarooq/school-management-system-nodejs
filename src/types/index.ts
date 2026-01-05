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

export interface jwtPayload {
  _id: Types.ObjectId,
  email: string,
  role: UserRole
}
