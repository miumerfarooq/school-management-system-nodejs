import mongoose, { Schema, Types } from "mongoose"
import { StudentDocument } from "../types/Student"
import { Gender, StudentStatus } from "../types"

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
  gender: {
    type: String,
    enum: Object.values(Gender)
  },
  dateOfBirth: {
    type: Date,
    required: true
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
