import { z } from "zod";
import { Gender, StudentStatus } from "../types";
import Section from "../models/section.model";

export const createStudentSchema = z.object({
  body: z.object({
    email: z.email("Invalid email address").toLowerCase().trim(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    firstName: z
      .string()
      .min(1, 'First name is required')
      .max(50, 'First name must not exceed 50 characters')
      .trim(),
    lastName: z
      .string()
      .min(1, 'Last name is required')
      .max(50, 'Last name must not exceed 50 characters')
      .trim(),
    gender: z.enum(Gender).optional(),
    dateOfBirth: z
      .date()
      .or(z.date())
      .refine(
        (date) => {
          const birthDate = new Date(date);
          const age = new Date().getFullYear() - birthDate.getFullYear();
          return age >= 5 && age <= 25;
        },
        'Student must be between 5 and 25 years old'
      ).optional(),
    grade: z
      .string()
      .min(1, 'Grade is required')
      .max(20)
      .trim(),
    registrationNumber: z
      .string()
      .min(1, 'Registration number is required')
      .max(50, 'Registration number must not exceed 50 characters')
      .trim(),
    address: z
      .string()
      .min(5, 'Address must be at least 5 characters')
      .max(200, 'Address must not exceed 200 characters')
      .trim()
      .optional(),
    phoneNumber: z
      .string()
      .regex(
        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
        'Invalid phone number format'
      )
      .optional(),
    sectionId: z.string().optional(),
    status: z
    .enum(StudentStatus)
    .default(StudentStatus.ACTIVE)
    .optional(),
    parents: z.array(z.string()).optional(),
  })
});

export const getAllStudentsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
  })
});

export type CreateStudentBody = z.infer<typeof createStudentSchema>['body']
export type GetAllStudentsQuery = z.infer<typeof getAllStudentsSchema>['query']
