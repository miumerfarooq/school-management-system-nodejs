import { Types } from "mongoose";
import { BaseDocument } from ".";

export interface Parent extends BaseDocument {
  userId: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  relationship: string; // e.g., "mother", "father", "guardian"
  students: Types.ObjectId[]; // Array of student IDs this parent is associated with
}

export interface ParentDocument extends Parent, Document {}
