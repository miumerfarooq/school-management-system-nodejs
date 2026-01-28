import { z } from "zod";
import mongoose from "mongoose";

export const createSectionSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, 'Section name is required')
      .max(50, 'Section name must not exceed 50 characters')
      .trim(),
    grade: z
      .string()
      .min(1, 'Grade is required')
      .max(20, 'Grade must not exceed 20 characters')
      .trim(),
    description: z
      .string()
      .max(500, 'Description must not exceed 500 characters')
      .trim()
      .optional(),
    isActive: z.boolean().default(true).optional(),
  }),
});

export const getAllSectionsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
    grade: z.string().optional(),
    isActive: z.coerce.boolean().optional(),
  }),
});

export const getSectionByIdSchema = z.object({
  params: z.object({
    id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid section ID",
    }),
  }),
});

export const updateSectionSchema = z.object({
  params: z.object({
    id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid section ID",
    }),
  }),
  body: z.object({
    name: z
      .string()
      .min(1, 'Section name is required')
      .max(50, 'Section name must not exceed 50 characters')
      .trim()
      .optional(),
    grade: z
      .string()
      .min(1, 'Grade is required')
      .max(20, 'Grade must not exceed 20 characters')
      .trim()
      .optional(),
    description: z
      .string()
      .max(500, 'Description must not exceed 500 characters')
      .trim()
      .optional(),
    isActive: z.boolean().optional(),
  }),
});

export const deleteSectionSchema = z.object({
  params: z.object({
    id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid section ID",
    }),
  }),
});

export type CreateSectionBody = z.infer<typeof createSectionSchema>["body"];
export type GetAllSectionsQuery = z.infer<typeof getAllSectionsSchema>["query"];
export type UpdateSectionBody = z.infer<typeof updateSectionSchema>["body"];
