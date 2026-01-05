import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import authService from "../services/auth.service";

class AuthController {
  // POST /api/v1/auth/register
  register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
      const result = await authService.register(req.body);
      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: result
      });
  })
}

export default new AuthController();
/**
 * Validate date(req.body)
 * Check user already exits
 * create user
 * generate token
 * send response
 */
