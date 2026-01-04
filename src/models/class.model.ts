import mongoose, { Schema } from "mongoose"
import { ClassDocument } from "../types/Class"

const classSchema = new Schema<ClassDocument>({
  name: {
    type: String,
    required: true
  },
  grade: {
    type: String,
    required: true
  },
  sectionId: {
    type: Schema.Types.ObjectId,
    ref: "Section",
    required: true
  },
  teacherId: {
    type: Schema.Types.ObjectId,
    ref: "Teacher",
    required: true
  },
  subjectIds: [
    {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true
    }
  ],
  academicYear: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
})

const Class = mongoose.model("Class", classSchema)

export default Class
