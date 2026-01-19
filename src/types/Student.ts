import { Document, Types } from "mongoose";
import { BaseDocument, Gender, StudentStatus } from ".";

export interface Student extends BaseDocument {
  userId: Types.ObjectId;
  studentId: number;
  firstName: string;
  lastName: string;
  gender?: Gender;
  dateOfBirth?: Date;
  grade: string;
  sectionId?: Types.ObjectId; // Reference to Section
  enrollmentDate: Date;
  registrationNumber: string;
  status: StudentStatus;
  address?: string;
  phoneNumber?: string;
  parents?: Types.ObjectId[]; // Array of parent IDs
}

export interface StudentDocument extends Student, Document {}
