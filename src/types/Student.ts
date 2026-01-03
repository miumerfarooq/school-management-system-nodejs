import { Document, Types } from "mongoose";
import { BaseDocument } from ".";

export interface Student extends BaseDocument {
  userId: Types.ObjectId;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  grade: string;
  enrollmentDate: Date;
  address: string;
  phoneNumber: string;
  parents: Types.ObjectId[]; // Array of parent IDs
}

export interface StudentDocument extends Student, Document {}
