import mongoose, { Schema } from "mongoose"
import { UserDocument } from "../types/User"
import { UserRole } from "../types/Role"

const userSchema = new Schema<UserDocument>({
  username: {
    type: String,
    required: [true, "Username is required"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    lowercase: true,
    index: true
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    select: false
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.STUDENT
  },
  profileImage: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: false
  },
  refreshToken: {
    type: String
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
})

const User = mongoose.model('User', userSchema)

export default User
