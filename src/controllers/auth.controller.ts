import { NextFunction, Request, Response } from "express"
import { asyncHandler } from "../utils/asyncHandler"
import authService from "../services/auth.service"
import { CONSTANTS } from "../config/constants"

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

class AuthController {
  // POST /api/v1/auth/register
  register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
      const result = await authService.register(req.body)
      res
        .status(CONSTANTS.STATUS_CODES.CREATED)
        .cookie('refreshToken', result.token, cookieOptions)
        .json({
          success: true,
          message: "User registered successfully. Please check your email to verify your account.",
          data: result
        })
  })
}

export default new AuthController()
/**
 * Validate date(req.body)
 * Check user already exits
 * create user
 * generate token
 * send response
 */
