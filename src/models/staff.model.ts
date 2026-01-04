import mongoose, { Schema } from "mongoose"
import { StaffDocument } from "../types/Staff"

const staffSchema = new Schema<StaffDocument>({
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
  department: {
    type: String
  },
  position: {
    type: String,
    required: true
  },
  hireDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

const Staff = mongoose.model("Staff", staffSchema)

export default Staff
