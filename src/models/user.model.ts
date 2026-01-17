import mongoose, { Schema } from "mongoose"
import { UserDocument } from "../types/User"
import { UserRole } from "../types"

const userSchema = new Schema<UserDocument>({
  username: {
    type: String,
    required: [true, "Username is required"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
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
    default: true
  },
  refreshToken: {
    type: String,
    select: false
  },
  lastLogin: {
    type: Date
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  failedLoginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
})

const User = mongoose.model('User', userSchema)

export default User
