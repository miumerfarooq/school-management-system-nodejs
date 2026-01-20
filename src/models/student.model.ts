import mongoose, { Schema, Types } from "mongoose"
import { StudentDocument } from "../types/Student"
import { Gender, StudentStatus } from "../types"

const studentSchema: Schema<StudentDocument> = new Schema({
  userId: {
    type: Schema.Types.ObjectId, ref: "User",
    required: true
  },
  studentId: {
    type: Number,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: Object.values(Gender)
  },
  dateOfBirth: {
    type: Date
  },
  grade: {
    type: String,
    required: true
  },
  sectionId: {
    type: Schema.Types.ObjectId,
    ref: "Section"
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: Object.values(StudentStatus),
    default: StudentStatus.ACTIVE
  },
  address: {
    type: String
  },
  phoneNumber: {
    type: String
  },
  parents: [
    {
      type: Schema.Types.ObjectId,
      ref: "Parent"
    }
  ],
}, {
  timestamps: true
})

const Student = mongoose.model<StudentDocument>('Student', studentSchema)

export default Student
