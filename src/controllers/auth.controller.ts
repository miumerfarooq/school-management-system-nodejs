import { Request, Response } from "express"
import { asyncHandler } from "../utils/asyncHandler"
import authService from "../services/auth.service"
import { CONSTANTS } from "../config/constants"
import { ApiResponse } from "../utils/ApiResponse";
import { AuthRequest } from "../types";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

class AuthController {
  // POST /api/v1/auth/register
  register = asyncHandler(async (req: Request, res: Response) => {
    const { user } = await authService.register(req.body)

    res
      .status(CONSTANTS.STATUS_CODES.CREATED)
      .json(
        new ApiResponse(CONSTANTS.STATUS_CODES.CREATED,
        { user },
        'User registered successfully. Please check your email to verify your account.')
      )
  })

  login = asyncHandler(async (req: Request, res: Response) => {
    const { user, accessToken, refreshToken } = await authService.login(req.body)

    res
      .status(CONSTANTS.STATUS_CODES.OK)
      .cookie('accessToken', accessToken, cookieOptions)
      .cookie('refreshToken', refreshToken, cookieOptions)
      .json(
        new ApiResponse(
          CONSTANTS.STATUS_CODES.OK,
          { user, accessToken, refreshToken },
          CONSTANTS.SUCCESS.LOGIN
        )
      )
  })

  logout = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as AuthRequest).user?._id;

    await authService.logout(userId!);

    res
      .status(CONSTANTS.STATUS_CODES.OK)
      .clearCookie('accessToken', cookieOptions)
      .clearCookie('refreshToken', cookieOptions)
      .json(
        new ApiResponse(
          CONSTANTS.STATUS_CODES.OK,
          {}, // null
          CONSTANTS.SUCCESS.LOGOUT
        )
      )
  })

  refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken: cookieRefreshToken } = req.cookies; // oldRefreshToken
    const { refreshToken: bodyRefreshToken } = req.body;

    const incomingRefreshToken = cookieRefreshToken || bodyRefreshToken;

    const { accessToken, refreshToken } = await authService.refreshToken(incomingRefreshToken);
    //const { accessToken, refreshToken } = await authService.refreshToken(oldRefreshToken);

    res
      .status(CONSTANTS.STATUS_CODES.OK)
      .cookie('accessToken', accessToken, cookieOptions)
      .cookie('refreshToken', refreshToken, cookieOptions)
      .json(
        new ApiResponse(
          CONSTANTS.STATUS_CODES.OK,
          { accessToken, refreshToken },
          'Token refreshed successfully'
        )
      )
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
