import mongoose, { Schema } from "mongoose"
import { StudentDocument } from "../types/Student"

const studentSchema: Schema<StudentDocument> = new Schema({
  userId: {
    type: Schema.Types.ObjectId, ref: "User",
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
  dateOfBirth: {
    type: Date,
    required: true
  },
  grade: {
    type: String,
    required: true
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  address: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  parents: [
    {
      type: Schema.Types.ObjectId,
      ref: "Parent"
    }
  ],
},
{
  timestamps: true
})

const Student = mongoose.model<StudentDocument>('Student', studentSchema)

export default Student
