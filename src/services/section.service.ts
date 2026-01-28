import { CONSTANTS } from "../config/constants"
import Section from "../models/section.model"
import { SectionDocument } from "../types/Section"
import { ApiError } from "../utils/ApiError"
import { CreateSectionBody, UpdateSectionBody } from "../validators/section.validator"

class SectionService {
  async createSection(sectionData: CreateSectionBody): Promise<SectionDocument> {
    // Check if section with same name and grade already exists
    const existingSection = await Section.findOne({
      name: sectionData.name,
      grade: sectionData.grade,
    })

    if (existingSection) {
      throw new ApiError(
        CONSTANTS.STATUS_CODES.CONFLICT,
        CONSTANTS.ERROR_CODES.DUPLICATE_ENTRY,
        'Section with this name and grade already exists'
      )
    }

    const newSection = await Section.create(sectionData)

    if (!newSection) {
      throw new ApiError(
        CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR,
        CONSTANTS.ERROR_CODES.INTERNAL_SERVER_ERROR,
        'Failed to create section'
      )
    }

    return newSection
  }

  async getAllSections(options: {
    page: number
    limit: number
    grade?: string
    isActive?: boolean
  }): Promise<{
    sections: SectionDocument[]
    total: number
    page: number
    pages: number
  }> {
    const { page, limit, grade, isActive } = options
    const skip = (page - 1) * limit

    // Build filter object
    const filter: any = {}
    if (grade) filter.grade = grade
    if (isActive !== undefined) filter.isActive = isActive

    const [sections, total] = await Promise.all([
      Section.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      Section.countDocuments(filter),
    ])

    if (!sections || sections.length === 0) {
      throw new ApiError(
        CONSTANTS.STATUS_CODES.NOT_FOUND,
        CONSTANTS.ERROR_CODES.NOT_FOUND,
        'No sections found'
      )
    }

    const pages = Math.ceil(total / limit)

    return { sections: sections as SectionDocument[], total, page, pages }
  }

  async getSectionById(id: string): Promise<SectionDocument> {
    const section = await Section.findById(id)

    if (!section) {
      throw new ApiError(
        CONSTANTS.STATUS_CODES.NOT_FOUND,
        CONSTANTS.ERROR_CODES.NOT_FOUND,
        'Section not found'
      )
    }

    return section
  }

  async updateSection(id: string, updateData: Partial<UpdateSectionBody>): Promise<SectionDocument> {
    // Check if updating name/grade combination
    if (updateData.name || updateData.grade) {
      const existingSection = await Section.findOne({
        _id: { $ne: id },
        name: updateData.name,
        grade: updateData.grade,
      })

      if (existingSection) {
        throw new ApiError(
          CONSTANTS.STATUS_CODES.CONFLICT,
          CONSTANTS.ERROR_CODES.DUPLICATE_ENTRY,
          'Section with this name and grade already exists'
        )
      }
    }

    const updatedSection = await Section.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })

    if (!updatedSection) {
      throw new ApiError(
        CONSTANTS.STATUS_CODES.NOT_FOUND,
        CONSTANTS.ERROR_CODES.NOT_FOUND,
        'Section not found'
      )
    }

    return updatedSection
  }

  async deleteSection(id: string): Promise<void> {
    const section = await Section.findByIdAndDelete(id)

    if (!section) {
      throw new ApiError(
        CONSTANTS.STATUS_CODES.NOT_FOUND,
        CONSTANTS.ERROR_CODES.NOT_FOUND,
        'Section not found'
      )
    }
  }

  async getSectionsByGrade(grade: string): Promise<SectionDocument[]> {
    const sections = await Section.find({ grade, isActive: true }).exec()

    if (!sections || sections.length === 0) {
      throw new ApiError(
        CONSTANTS.STATUS_CODES.NOT_FOUND,
        CONSTANTS.ERROR_CODES.NOT_FOUND,
        `No sections found for grade ${grade}`
      )
    }

    return sections
  }

  async getActiveSections(): Promise<SectionDocument[]> {
    const sections = await Section.find({ isActive: true })
      .sort({ grade: 1, name: 1 })
      .exec()

    if (!sections || sections.length === 0) {
      throw new ApiError(
        CONSTANTS.STATUS_CODES.NOT_FOUND,
        CONSTANTS.ERROR_CODES.NOT_FOUND,
        'No active sections found'
      )
    }

    return sections
  }
}

export default new SectionService()
