import { Document, Types } from "mongoose";
import { BaseDocument } from ".";

export interface Teacher extends BaseDocument {
  userId: Types.ObjectId;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address?: string;
  subjectIds: Types.ObjectId[]; // Array of subject IDs the teacher teaches
  department?: string;
  hireDate: Date;
}

export interface TeacherDocument extends Teacher, Document {}
