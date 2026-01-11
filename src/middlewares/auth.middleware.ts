import { NextFunction, Request, Response } from "express";
import { TokenService } from "../services/token.service";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { CONSTANTS } from "../config/constants";
import { AuthRequest } from "../types";

export const authenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Get token from header
    // const token = req.cookies['accessToken'] || req.headers['authorization']?.split(' ')[1];
    const authHeader = req.headers.authorization
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : req.cookies?.accessToken

    if (!token) {
      throw new ApiError(
        CONSTANTS.STATUS_CODES.UNAUTHORIZED,
        CONSTANTS.ERROR_CODES.UNAUTHORIZED,
        CONSTANTS.ERRORS.UNAUTHORIZED
      )
      // return res.status(401).json({ message: 'Authentication token missing' });
    }
    try {
      // Verify token
      const decoded = TokenService.verifyAccessToken(token);
      console.log('Decoded Token:', decoded);
      // Attach user to request
      (req as AuthRequest).user = decoded;
      next();
    } catch (error) {
      throw new ApiError(
        CONSTANTS.STATUS_CODES.UNAUTHORIZED,
        CONSTANTS.ERROR_CODES.INVALID_TOKEN,
        CONSTANTS.ERRORS.INVALID_TOKEN
      )
      // return res.status(401).json({ message: 'Invalid authentication token' });
    }
  }
);

export const authorize = (...allowedRoles: string[]) =>
  asyncHandler(async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const user = (req as AuthRequest).user;

    if (!user) {
      throw new ApiError(
        CONSTANTS.STATUS_CODES.UNAUTHORIZED,
        CONSTANTS.ERROR_CODES.UNAUTHORIZED,
        CONSTANTS.ERRORS.UNAUTHORIZED
      );
    }

    const hasRole = user.roles?.some((role: string) => allowedRoles.includes(role));

    if (!hasRole) {
      throw new ApiError(
        CONSTANTS.STATUS_CODES.FORBIDDEN,
        CONSTANTS.ERROR_CODES.FORBIDDEN,
        CONSTANTS.ERRORS.PERMISSION_DENIED
      );
    }

    next();
  });
