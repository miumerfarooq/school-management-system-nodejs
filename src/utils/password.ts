import bcrypt from "bcryptjs"
import { env } from "../config/env"

/**
 * Hash a password using bcrypt
 * @param password - The plain text password to hash
 * @returns Promise<string> - The hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(env.bcrypt.rounds)
  const hashedPassword = await bcrypt.hash(password, salt)
  return hashedPassword
}

/**
 * Compare a plain text password with a hashed password
 * @param password - The plain text password to check
 * @param hashedPassword - The hashed password to compare against
 * @returns Promise<boolean> - True if passwords match, false otherwise
 */
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}
