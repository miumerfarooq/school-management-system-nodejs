import { CONSTANTS } from "../config/constants";
import { env } from "../config/env";
import User from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { formatDate } from "../utils/dateFormatter";
import { emailService } from "./email.service";
import { TokenService } from "./token.service";
import { hashPassword, comparePassword } from "../utils/password";

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
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
      profileImage: ""
    })

    const createdUser = await User.findById(user._id)

    if (!createdUser) {
      throw new ApiError(
        CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR,
        CONSTANTS.ERROR_CODES.INTERNAL_SERVER_ERROR,
        CONSTANTS.ERRORS.USER_CREATION_FAILED
      )
    }

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

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > new Date()) {
      throw new ApiError(
        CONSTANTS.STATUS_CODES.FORBIDDEN,
        CONSTANTS.ERROR_CODES.FORBIDDEN,
        "Account is temporarily locked due to multiple failed login attempts."
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
    const isPasswordValid = await comparePassword(password, user.password)

    if(!isPasswordValid) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1

      // Lock account if too many failed attempts
      if (user.failedLoginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 5 * 60 * 1000); // lock for 5 minutes
        user.failedLoginAttempts = 0; // reset counter after lock
      }

      throw new ApiError(
        CONSTANTS.STATUS_CODES.UNAUTHORIZED,
        CONSTANTS.ERROR_CODES.UNAUTHORIZED,
        CONSTANTS.ERRORS.INVALID_CREDENTIALS
      )
    }

    // Reset failed attempts on successful login
    user.failedLoginAttempts = 0;
    user.lockUntil = null;

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

    // Update user with refresh token and last login
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();

    const loggedInUser = await User.findById(user._id)

    return { user: loggedInUser, accessToken, refreshToken }
  }

  async logout(userId: string): Promise<void> {
    await User.findByIdAndUpdate(
      userId,
      {
        $unset: {
          refreshToken: 1 // this removes the field from document
        }
      },
      { new: true }
    )
    // Option 1
    // await User.findByIdAndUpdate(userId, { refreshToken: null });

    // Option 2
    // const user = await User.findById(userId)

    // if (!user) {
    //   throw new ApiError(
    //     CONSTANTS.STATUS_CODES.NOT_FOUND,
    //     CONSTANTS.ERROR_CODES.NOT_FOUND,
    //     CONSTANTS.ERRORS.USER_NOT_FOUND
    //   )
    // }

    // user.refreshToken = null
    // await user.save()

    // Option 3
    // const user = await User.findByIdAndUpdate(userId, { refreshToken: null });

    // if (!user) {
    //   throw new ApiError(
    //     CONSTANTS.STATUS_CODES.NOT_FOUND,
    //     CONSTANTS.ERROR_CODES.NOT_FOUND,
    //     CONSTANTS.ERRORS.USER_NOT_FOUND
    //   )
    // }
  }

  async refreshToken(oldRefreshToken: string): Promise<any> {
    if (!oldRefreshToken) {
      throw new ApiError(
        CONSTANTS.STATUS_CODES.UNAUTHORIZED,
        CONSTANTS.ERROR_CODES.INVALID_TOKEN,
        CONSTANTS.ERRORS.INVALID_TOKEN
      )
    }

    try {
      const payload = TokenService.verifyRefreshToken(oldRefreshToken)

      if (!payload) {
        throw new ApiError(
          CONSTANTS.STATUS_CODES.UNAUTHORIZED,
          CONSTANTS.ERROR_CODES.INVALID_TOKEN,
          "Refresh token verification failed: token payload is invalid or corrupted"
        )
      }

      const user = await User.findById(payload._id).select('+refreshToken')

      if (!user) {
        throw new ApiError(
          CONSTANTS.STATUS_CODES.UNAUTHORIZED,
          CONSTANTS.ERROR_CODES.UNAUTHORIZED,
          "User associated with refresh token does not exist"
        )
      }

      if (user.refreshToken !== oldRefreshToken) {
        // Debug: Log token comparison
        // console.log('Token Mismatch Debug:');
        // console.log('Incoming token length:', oldRefreshToken.length);
        // console.log('Stored token length:', user.refreshToken?.length);
        // console.log('Incoming token (first 50 chars):', oldRefreshToken.substring(0, 50));
        // console.log('Stored token (first 50 chars):', user.refreshToken?.substring(0, 50));

        throw new ApiError(
          CONSTANTS.STATUS_CODES.UNAUTHORIZED,
          CONSTANTS.ERROR_CODES.UNAUTHORIZED,
          "Refresh token does not match the stored token"
        )
      }

      // Generate new tokens
      const accessToken = TokenService.generateAccessToken({
        _id: user._id.toString(),
        email: user.email,
        roles: [user.role]
      });
      const refreshToken = TokenService.generateRefreshToken({
        _id: user._id.toString(),
        email: user.email,
        roles: [user.role]
      });

      // Update user with new refresh token
      user.refreshToken = refreshToken
      await user.save()

      return { accessToken, refreshToken }
    } catch (error) {
      throw new ApiError(
        CONSTANTS.STATUS_CODES.UNAUTHORIZED,
        CONSTANTS.ERROR_CODES.INVALID_TOKEN,
        "Failed to refresh token: " + (error as Error).message
      )
    }
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await User.findById(userId).select('+password');

    if (!user) {
      throw new ApiError(
        CONSTANTS.STATUS_CODES.NOT_FOUND,
        CONSTANTS.ERROR_CODES.NOT_FOUND,
        CONSTANTS.ERRORS.USER_NOT_FOUND
      );
    }

    // Verify current password
    const isPasswordValid = await comparePassword(currentPassword, user.password);

    if (!isPasswordValid) {
      throw new ApiError(
        CONSTANTS.STATUS_CODES.UNAUTHORIZED,
        CONSTANTS.ERROR_CODES.UNAUTHORIZED,
        CONSTANTS.ERRORS.INVALID_PASSWORD
      );
    }

    // Prevent reusing the same password
    if (currentPassword === newPassword) {
      throw new ApiError(
        CONSTANTS.STATUS_CODES.BAD_REQUEST,
        CONSTANTS.ERROR_CODES.PASSWORD_MISMATCH,
        CONSTANTS.ERRORS.PASSWORD_MISMATCH
      );
    }

    // const isSamePassword = await comparePassword(newPassword, user.password);
    // if (isSamePassword) {
    //   throw new ApiError(
    //     CONSTANTS.STATUS_CODES.BAD_REQUEST,
    //     CONSTANTS.ERROR_CODES.PASSWORD_MISMATCH,
    //     CONSTANTS.ERRORS.PASSWORD_MISMATCH
    //   );
    // }

    // Hash new password before saving
    const hashedNewPassword = await hashPassword(newPassword)

    // Update password
    user.password = hashedNewPassword;

    // Invalidate refresh token(s) so user must re-login
    // user.refreshToken = null;

    await user.save();
  }

  async getCurrentUser(userId: string): Promise<any> {
    const user = await User.findById(userId)

    if (!user) {
      throw new ApiError(
        CONSTANTS.STATUS_CODES.NOT_FOUND,
        CONSTANTS.ERROR_CODES.NOT_FOUND,
        CONSTANTS.ERRORS.USER_NOT_FOUND
      )
    }

    return user
  }

  async verifyEmail(token: string): Promise<any> {
    const payload = TokenService.verifyAccessToken(token);

    if (!payload) {
      throw new ApiError(
        CONSTANTS.STATUS_CODES.BAD_REQUEST,
        CONSTANTS.ERROR_CODES.INVALID_TOKEN,
        CONSTANTS.ERRORS.INVALID_TOKEN
      );
    }

    if (payload.type !== 'email-verify') {
      throw new ApiError(
        CONSTANTS.STATUS_CODES.BAD_REQUEST,
        CONSTANTS.ERROR_CODES.VALIDATION_ERROR,
        CONSTANTS.ERRORS.INVALID_TOKEN_TYPE
      );
    }

    const user = await User.findById(payload._id);

    if (!user) {
      throw new ApiError(
        CONSTANTS.STATUS_CODES.NOT_FOUND,
        CONSTANTS.ERROR_CODES.NOT_FOUND,
        CONSTANTS.ERRORS.USER_NOT_FOUND
      );
    }

    if (user.isEmailVerified) {
      throw new ApiError(
        CONSTANTS.STATUS_CODES.BAD_REQUEST,
        CONSTANTS.ERROR_CODES.VALIDATION_ERROR,
        CONSTANTS.ERRORS.EMAIL_ALREADY_VERIFIED
      );
    }

    user.isEmailVerified = true
    await user.save()

    // Send welcome email after successful verification
    await emailService.sendWelcomeEmail(user.email, user.username);

    // return user;
  }

  async resendVerificationEmail(email: string): Promise<void> {
    const user = await User.findOne({ email })

    // Silently fail to avoid leaking information
    if (!user) return
    if (user.isEmailVerified) return

    // if (!user) {
    //   throw new ApiError(
    //     CONSTANTS.STATUS_CODES.NOT_FOUND,
    //     CONSTANTS.ERROR_CODES.NOT_FOUND,
    //     CONSTANTS.ERRORS.USER_NOT_FOUND
    //   );
    // }

    // if (user.isEmailVerified) {
    //   throw new ApiError(
    //     CONSTANTS.STATUS_CODES.BAD_REQUEST,
    //     CONSTANTS.ERROR_CODES.VALIDATION_ERROR,
    //     CONSTANTS.ERRORS.EMAIL_ALREADY_VERIFIED
    //   );
    // }

    const verificationToken = TokenService.generateEmailVerifyToken(user._id.toString(), user.email)

    await emailService.sendVerificationEmail(user.email, verificationToken)
  }

  async forgotPassword(email: string) {
    const user = await User.findOne({ email })

    if (!user) {
      // Silently fail to avoid leaking user existence
      return
    }

    const resetToken = TokenService.generateResetPasswordToken(user._id.toString(), user.email)

    await emailService.sendPasswordResetEmail(user.email, resetToken)
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const payload = TokenService.verifyAccessToken(token);

    if (!payload) {
      throw new ApiError(
        CONSTANTS.STATUS_CODES.BAD_REQUEST,
        CONSTANTS.ERROR_CODES.INVALID_TOKEN,
        CONSTANTS.ERRORS.INVALID_TOKEN
      );
    }

    if (payload.type !== 'reset-password') {
      throw new ApiError(
        CONSTANTS.STATUS_CODES.BAD_REQUEST,
        CONSTANTS.ERROR_CODES.VALIDATION_ERROR,
        CONSTANTS.ERRORS.INVALID_TOKEN_TYPE
      );
    }

    const user = await User.findById(payload._id);

    if (!user) {
      throw new ApiError(
        CONSTANTS.STATUS_CODES.NOT_FOUND,
        CONSTANTS.ERROR_CODES.NOT_FOUND,
        CONSTANTS.ERRORS.USER_NOT_FOUND
      );
    }

    // Hash new password before saving
    const hashedNewPassword = await hashPassword(newPassword)

    // Update password
    user.password = hashedNewPassword;
    await user.save();

    await emailService.sendPasswordChangeConfirmationEmail(user.email, user.username, formatDate(new Date()));
  }
}

export default new AuthService();
