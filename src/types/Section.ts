import { Document, Types } from "mongoose";
import { BaseDocument } from ".";

export interface Section extends BaseDocument {
  name: string;
  grade: string;
  description?: string;
}

export interface SectionDocument extends Section, Document {}
