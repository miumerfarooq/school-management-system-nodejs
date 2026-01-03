import mongoose, { Schema } from "mongoose"
import { ParentDocument } from "../types/Parent"

const parentSchema = new Schema<ParentDocument>({
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
  email: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  relationship: {
    type: String,
    required: true
  },
  students: [
    {
      type: Schema.Types.ObjectId,
      ref: "Student"
    }
  ]
}, {
  timestamps: true
})

const Parent = mongoose.model("Parent", parentSchema)

export default Parent
