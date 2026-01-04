import mongoose, { Schema } from "mongoose"
import { SubjectDocument } from "../types/Subject"

const subjectSchema = new Schema<SubjectDocument>({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  department: {
    type: String
  },
  gradeLevel: {
    type: String
  }
}, {
  timestamps: true
})

const Subject = mongoose.model("Subject", subjectSchema)

export default Subject
