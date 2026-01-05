import { CONSTANTS } from "../config/constants";
import User from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { TokenService } from "./token.service";

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

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      role,
      profileImage: "",
      isActive: true,
      lastLogin: new Date(),
      isEmailVerified: false
    })

    // Generate email verification token
    const token = TokenService.generateRefreshToken({ _id: user._id, email: user.email, role: user.role })

    // Send verification email

    return {
      user: userData, // replace with newUser in real implementation
      token
    };
  }
}

export default new AuthService();
