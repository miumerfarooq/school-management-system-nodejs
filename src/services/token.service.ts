import jwt from "jsonwebtoken"
import { jwtPayload } from "../types"
import { env } from "../config/env"

export class TokenService {
  static generateAccessToken(payload: jwtPayload): string {
    return jwt.sign(
      { ...payload, type: 'access' },
      env.jwt.accessSecret,
      { expiresIn: env.jwt.accessExpiry }
    );
  }

  static generateRefreshToken(payload: jwtPayload): string {
    return jwt.sign(
      { ...payload, type: 'refresh' },
      env.jwt.refreshSecret,
      { expiresIn: env.jwt.refreshExpiry }
    );
  }

  // static generateAccessToken(payload: jwtPayload): string {
  //   return jwt.sign(payload, env.jwt.accessSecret, { expiresIn: env.jwt.accessExpiry })
  // }

  // static generateRefreshToken(payload: jwtPayload): string {
  //   return jwt.sign(payload, env.jwt.refreshSecret, { expiresIn: env.jwt.refreshExpiry })
  //   // return jwt.sign(payload, env.jwt.refreshSecret, { expiresIn: env.jwt.refreshExpiry as SignOptions['expiresIn'] })
  // }

  static generateEmailVerifyToken(userId: string, email: string): string {
    return jwt.sign(
      { userId, email, type: 'email-verify' },
      env.jwt.accessSecret,
      { expiresIn: env.jwt.emailVerifyExpiry }
    );
  }

  static verifyAccessToken(token: string): jwtPayload {
    return jwt.verify(token, env.jwt.accessSecret) as jwtPayload;
  }

  static verifyRefreshToken(token: string): jwtPayload {
    return jwt.verify(token, env.jwt.refreshSecret) as jwtPayload;
  }
}
