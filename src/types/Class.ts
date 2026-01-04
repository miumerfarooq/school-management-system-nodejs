import { Document, Types } from "mongoose";
import { BaseDocument } from ".";

export interface Class extends BaseDocument {
  name: string;
  grade: string;
  sectionId: Types.ObjectId; // Reference to Section
  teacherId: Types.ObjectId; // Reference to Teacher
  subjectIds: Types.ObjectId[]; // Array of subject IDs
  academicYear: string;
  capacity: number;
  status: string; // e.g., 'active', 'inactive'
}

export interface ClassDocument extends Class, Document {}
