import { CONSTANTS } from "../config/constants";
import { env } from "../config/env";
import User from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { emailService } from "./email.service";
import { TokenService } from "./token.service";
import bcrypt from "bcryptjs";

class AuthService {
  async register(userData: any): Promise<any> {
    // Validate data (Done in a middleware)
    const { username, email, password, role } = userData

    // Check if user already exists
    const userExist = await User.findOne({ email })

    if (userExist) {
      throw new ApiError(
        CONSTANTS.STATUS_CODES.CONFLICT,
        CONSTANTS.ERROR_CODES.CONFLICT,
        CONSTANTS.ERRORS.EMAIL_EXISTS,
        { field: "email" }
      )
    }

    // profile image URL generation logic can be added here

    // encrypt password
    const salt = await bcrypt.genSalt(env.bcrypt.rounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
      profileImage: "",
      isActive: true,
      lastLogin: new Date(),
      isEmailVerified: false
    })

    // Generate email verification token
    const verificationToken = TokenService.generateEmailVerifyToken(user._id.toString(), user.email)

    // Send verification email
    await emailService.sendVerificationEmail(user.email, verificationToken)

    return { user }
  }

  async login(userdata: any): Promise<any> {
    const { email, password } = userdata

    // Find user with password field
    const user = await User.findOne({ email }).select('+password')

    if(!user) {
      throw new ApiError(
        CONSTANTS.STATUS_CODES.UNAUTHORIZED,
        CONSTANTS.ERROR_CODES.UNAUTHORIZED,
        CONSTANTS.ERRORS.INVALID_CREDENTIALS
      )
    }

    // Check if user is active
    if(!user.isActive) {
      throw new ApiError(
        CONSTANTS.STATUS_CODES.FORBIDDEN,
        CONSTANTS.ERROR_CODES.FORBIDDEN,
        CONSTANTS.ERRORS.FORBIDDEN
      )
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid) {
      throw new ApiError(
        CONSTANTS.STATUS_CODES.UNAUTHORIZED,
        CONSTANTS.ERROR_CODES.UNAUTHORIZED,
        CONSTANTS.ERRORS.INVALID_CREDENTIALS
      )
    }

    if(!user.isEmailVerified) {
      throw new ApiError(
        CONSTANTS.STATUS_CODES.FORBIDDEN,
        CONSTANTS.ERROR_CODES.FORBIDDEN,
        CONSTANTS.ERRORS.EMAIL_NOT_VERIFIED
      )
    }

    // Generate JWT token
    const accessToken = TokenService.generateAccessToken({
      _id: user._id.toString(),
      email: user.email,
      roles: [user.role]
    })
    const refreshToken = TokenService.generateRefreshToken({
      _id: user._id.toString(),
      email: user.email,
      roles: [user.role]
    })

    return { user, accessToken, refreshToken }
  }
}

export default new AuthService();
