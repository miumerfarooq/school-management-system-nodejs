import Parent from "../models/parent.model";
import User from "../models/user.model";
import { ParentDocument } from "../types/Parent";
import { ApiError } from "../utils/ApiError";
import { CONSTANTS } from "../config/constants";
import { Types } from "mongoose";
import { UpdateParentBody } from "../validators/parent.validator";

class parentService {
  async createParent(parentData: any): Promise<ParentDocument> {
    const { userId, email, phoneNumber } = parentData

    // if a userId is provided, ensure the referenced User exists
    if (userId) {
      const user = await User.findById(userId)
      if (!user) {
        throw new ApiError(
          CONSTANTS.STATUS_CODES.NOT_FOUND,
          CONSTANTS.ERROR_CODES.NOT_FOUND,
          'User (owner) not found'
        )
      }
      parentData.userId = new Types.ObjectId(userId)
    } else {
      // ensure we don't insert empty string or invalid value
      delete parentData.userId
    }

    // uniqueness checks
    const emailExists = await Parent.findOne({ email })
    if (emailExists) {
      throw new ApiError(
        CONSTANTS.STATUS_CODES.CONFLICT,
        CONSTANTS.ERROR_CODES.DUPLICATE_ENTRY,
        'Parent with this email already exists'
      )
    }

    const phoneExists = await Parent.findOne({ phoneNumber })
    if (phoneExists) {
      throw new ApiError(
        CONSTANTS.STATUS_CODES.CONFLICT,
        CONSTANTS.ERROR_CODES.DUPLICATE_ENTRY,
        'Parent with this phone number already exists'
      )
    }

    const newParent = await Parent.create({
      ...parentData
    })

    const populated = await Parent.findById(newParent._id).populate('userId', '-password')

    return populated as ParentDocument
  }

  async getAllParents(options: { page: number; limit: number }): Promise<{ parents: ParentDocument[]; total: number; page: number; pages: number }> {
    const { page, limit } = options
    const skip = (page - 1) * limit

    const [parents, total] = await Promise.all([
      Parent.find()
        .skip(skip)
        .limit(limit)
        .populate('userId', '-password')
        .sort({ createdAt: -1 })
        .exec(),
      Parent.countDocuments()
    ])

    if (!parents || parents.length === 0) {
      throw new ApiError(
        CONSTANTS.STATUS_CODES.NOT_FOUND,
        CONSTANTS.ERROR_CODES.NOT_FOUND,
        'No parents found'
      )
    }

    const pages = Math.ceil(total / limit)

    return { parents: parents as ParentDocument[], total, page, pages }
  }

  async getParentById(id: string): Promise<ParentDocument | null> {
    const parent = await Parent.findById(id).populate('userId', '-password').exec()

    if (!parent) {
      throw new ApiError(
        CONSTANTS.STATUS_CODES.NOT_FOUND,
        CONSTANTS.ERROR_CODES.NOT_FOUND,
        'Parent not found'
      )
    }

    return parent as ParentDocument
  }

  async updateParent(id: string, updateData: Partial<UpdateParentBody>): Promise<ParentDocument | null> {
    const existing = await Parent.findById(id)

    if (!existing) {
      throw new ApiError(
        CONSTANTS.STATUS_CODES.NOT_FOUND,
        CONSTANTS.ERROR_CODES.NOT_FOUND,
        'Parent not found'
      )
    }

    const { email, phoneNumber, ...rest } = updateData

    // validate email uniqueness
    if (email && email !== existing.email) {
      const emailExists = await Parent.findOne({ email })
      if (emailExists) {
        throw new ApiError(
          CONSTANTS.STATUS_CODES.CONFLICT,
          CONSTANTS.ERROR_CODES.DUPLICATE_ENTRY,
          'Parent with this email already exists'
        )
      }
      // also update linked user email if a linked user exists
      if (existing.userId) {
        await User.findByIdAndUpdate(existing.userId, { email })
      }
    }

    // validate phone uniqueness
    if (phoneNumber && phoneNumber !== existing.phoneNumber) {
      const phoneExists = await Parent.findOne({ phoneNumber })
      if (phoneExists) {
        throw new ApiError(
          CONSTANTS.STATUS_CODES.CONFLICT,
          CONSTANTS.ERROR_CODES.DUPLICATE_ENTRY,
          'Parent with this phone number already exists'
        )
      }
    }

    const updated = await Parent.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .populate('userId', '-password')
      .exec()
      //{ ...rest, email, phoneNumber, userId }

    if (!updated) {
      throw new ApiError(
        CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR,
        CONSTANTS.ERROR_CODES.INTERNAL_SERVER_ERROR,
        'Parent update failed'
      )
    }

    return updated as ParentDocument
  }

  async deleteParent(id: string): Promise<void> {
    const parent = await Parent.findById(id)

    if (!parent) {
      throw new ApiError(
        CONSTANTS.STATUS_CODES.NOT_FOUND,
        CONSTANTS.ERROR_CODES.NOT_FOUND,
        'Parent not found'
      )
    }

    // deactivate linked user

    if (parent.userId) {
      await User.findByIdAndUpdate(parent.userId, { isActive: false })
    }

    // remove parent record
    await Parent.findByIdAndDelete(parent._id)
  }
}

export default new parentService()
