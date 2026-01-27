import { z } from "zod"
import { ParentRelationship } from "../types";
import mongoose from "mongoose"

export const createParentSchema = z.object({
  body: z.object({
    userId: z
      .string()
      .optional()
      .refine((val) => !val || mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid user ID",
      }),
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(50, "First name must not exceed 50 characters")
      .trim(),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(50, "Last name must not exceed 50 characters")
      .trim(),
    email: z
      .string()
      .email("Invalid email address")
      .toLowerCase()
      .trim(),
    phoneNumber: z
      .string()
      .min(7, "Phone number is required")
      .max(15, "Phone number must not exceed 15 characters")
      .trim(),
    address: z
      .string()
      .min(5, "Address must be at least 5 characters")
      .max(200, "Address must not exceed 200 characters")
      .trim()
      .optional(),
    relationship: z
      .enum(ParentRelationship)
      .optional(),
  })
});

export const getAllParentsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
  })
})

export const getParentByIdSchema = z.object({
  params: z.object({
    id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid parent ID",
    }),
  })
});

const updateParentBodySchema = z.object({
  firstName: z.string().min(1).max(50).trim().optional(),
  lastName: z.string().min(1).max(50).trim().optional(),
  email: z.string().email("Invalid email address").toLowerCase().trim().optional(),
  phoneNumber: z.string().min(7).max(15).trim().optional(),
  address: z.string().min(5).max(200).trim().optional(),
  relationship: z.enum(ParentRelationship).optional(),
});

export const updateParentSchema = z.object({
  params: z.object({
    id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid parent ID",
    }),
  }),
  body: updateParentBodySchema,
});

export const deleteParentSchema = z.object({
  params: z.object({
    id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid parent ID",
    }),
  }),
});

export type CreateParentBody = z.infer<typeof createParentSchema>["body"]
export type GetAllParentsQuery = z.infer<typeof getAllParentsSchema>["query"]
export type GetParentByIdParams = z.infer<typeof getParentByIdSchema>["params"]
export type UpdateParentParams = z.infer<typeof updateParentSchema>["params"]
export type UpdateParentBody = z.infer<typeof updateParentSchema>["body"]
export type DeleteParentParams = z.infer<typeof deleteParentSchema>["params"]
