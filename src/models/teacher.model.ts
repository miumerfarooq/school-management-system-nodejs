import mongoose, { Schema } from "mongoose"
import { TeacherDocument } from "../types/Teacher"

const teacherSchema = new Schema<TeacherDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  subjectIds: [
    {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true
    }
  ],
  department: {
    type: String
  },
  hireDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

const Teacher = mongoose.model("Teacher", teacherSchema)

export default Teacher
