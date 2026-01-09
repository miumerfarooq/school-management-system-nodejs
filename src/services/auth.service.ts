import { CONSTANTS } from "../config/constants";
import { env } from "../config/env";
import User from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { emailService } from "./email.service";
import { TokenService } from "./token.service";
import brcypt from "bcryptjs";

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
    const salt = await brcypt.genSalt(env.bcrypt.rounds);
    const hashedPassword = await brcypt.hash(password, salt);

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
    const token = TokenService.generateEmailVerifyToken(user._id.toString(), user.email)

    // Send verification email
    await emailService.sendVerificationEmail(user.email, token)

    return {
      user,
      token
    };
  }
}

export default new AuthService();
