import { z } from "zod";
import { UserRole } from "../types";

export const createUserSchema = z.object({
  body: z.object({
    username: z
      .string()
      .min(1, 'Username must be atleast 1 character')
      .max(50, 'Username must not exceed 50 characters')
      .trim(),
    email: z.email("Invalid email address").toLowerCase().trim(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    role: z.enum(UserRole).default(UserRole.STUDENT),
    profileImage: z.url("Invalid URL").optional(),
    isActive: z.boolean().default(true),
    refreshToken: z.string().optional(),
    lastLogin: z.iso.datetime().optional(),
    isEmailVerified: z.boolean().default(false)
  })
})

export const updateUserSchema = z.object({
  body: z.object({
    username: z
      .string()
      .min(1, 'Username must be atleast 1 character')
      .max(50, 'Username must not exceed 50 characters')
      .trim()
      .optional(),
    email: z.email("Invalid email address").toLowerCase().trim().optional(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      )
      .optional(),
    role: z.enum(UserRole).optional(),
    profileImage: z.url("Invalid URL").optional(),
    isActive: z.boolean().optional(),
    refreshToken: z.string().optional(),
    lastLogin: z.iso.datetime().optional(),
    isEmailVerified: z.boolean().optional(),
  })
})

export const loginUserSchema = z.object({
  body: z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  }),
});

export type CreateBody = z.infer<typeof createUserSchema>['body']
export type UpdateBody = z.infer<typeof updateUserSchema>['body']
export type LoginBody = z.infer<typeof loginUserSchema>['body']
