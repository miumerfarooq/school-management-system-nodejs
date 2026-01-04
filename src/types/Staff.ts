import { Document, Types } from "mongoose";
import { BaseDocument } from ".";

export interface Staff extends BaseDocument {
  userId: Types.ObjectId;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address?: string;
  department?: string;
  position: string;
  hireDate: Date;
}

export interface StaffDocument extends Staff, Document {}
