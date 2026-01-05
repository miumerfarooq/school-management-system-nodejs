import jwt from "jsonwebtoken"
import { jwtPayload } from "../types"
import { env } from "../config/env"

export class TokenService {
  static generateRefreshToken(payload: jwtPayload): string {
    return jwt.sign(payload, env.jwt.refreshSecret, { expiresIn: env.jwt.refreshExpiry })
    // return jwt.sign(payload, env.jwt.refreshSecret, { expiresIn: env.jwt.refreshExpiry as SignOptions['expiresIn'] })
  }
}
