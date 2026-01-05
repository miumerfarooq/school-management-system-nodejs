import { Document, Types } from "mongoose";
import { BaseDocument } from ".";

export interface Subject extends BaseDocument {
  name: string;
  code: string;
  description?: string;
  department?: string;
  gradeLevel?: string;
  isActive: boolean;
}

export interface SubjectDocument extends Subject, Document {}
