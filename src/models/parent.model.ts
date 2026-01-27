import mongoose, { Schema } from "mongoose"
import { ParentDocument } from "../types/Parent"
import { ParentRelationship } from "../types"

const parentSchema = new Schema<ParentDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User"
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
    unique: true,
    required: true
  },
  address: {
    type: String
  },
  relationship: {
    type: String,
    enum: Object.values(ParentRelationship),
    default: ParentRelationship.FATHER
  }
}, {
  timestamps: true
})

const Parent = mongoose.model("Parent", parentSchema)

export default Parent
