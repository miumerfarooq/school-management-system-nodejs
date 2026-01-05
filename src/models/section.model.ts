import mongoose, { Schema } from "mongoose"
import { SectionDocument } from "../types/Section"

const sectionSchema = new Schema<SectionDocument>({
  name: {
    type: String,
    required: true
  },
  grade: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

const Section = mongoose.model("Section", sectionSchema)

export default Section
