import { Request, Response } from "express"
import sectionService from "../services/section.service"
import { asyncHandler } from "../utils/asyncHandler"
import { CONSTANTS } from "../config/constants"
import { ApiResponse } from "../utils/ApiResponse"
import { TypedRequest } from "../types/request"
import {
  CreateSectionBody,
  GetAllSectionsQuery,
  UpdateSectionBody,
} from "../validators/section.validator"

class SectionController {
  createSection = asyncHandler(
    async (req: TypedRequest<{}, {}, CreateSectionBody>, res: Response) => {
      const section = await sectionService.createSection(req.body)

      res.status(CONSTANTS.STATUS_CODES.CREATED).json(
        new ApiResponse(
          CONSTANTS.STATUS_CODES.CREATED,
          section,
          'Section created successfully'
        )
      )
    }
  )

  getAllSections = asyncHandler(
    async (req: TypedRequest<{}, GetAllSectionsQuery, {}>, res: Response) => {
      const { page, limit, grade, isActive } = req.query
      const options = {
        page: page ? page : 1,
        limit: limit ? limit : 10,
        grade: grade,
        isActive: isActive,
      }

      const result = await sectionService.getAllSections(options)

      res.status(CONSTANTS.STATUS_CODES.OK).json(
        new ApiResponse(
          CONSTANTS.STATUS_CODES.OK,
          result,
          'Sections retrieved successfully'
        )
      )
    }
  )

  getSectionById = asyncHandler(async (req: Request, res: Response) => {
    const section = await sectionService.getSectionById(req.params.id)

    res.status(CONSTANTS.STATUS_CODES.OK).json(
      new ApiResponse(
        CONSTANTS.STATUS_CODES.OK,
        section,
        'Section retrieved successfully'
      )
    )
  })

  updateSection = asyncHandler(async (req: Request, res: Response) => {
      const section = await sectionService.updateSection(req.params.id, req.body)

      res.status(CONSTANTS.STATUS_CODES.OK).json(
        new ApiResponse(
          CONSTANTS.STATUS_CODES.OK,
          section,
          'Section updated successfully'
        )
      )
    }
  )

  deleteSection = asyncHandler(async (req: Request, res: Response) => {
    await sectionService.deleteSection(req.params.id)

    res.status(CONSTANTS.STATUS_CODES.OK).json(
      new ApiResponse(
        CONSTANTS.STATUS_CODES.OK,
        {},
        'Section deleted successfully'
      )
    )
  })

  getSectionsByGrade = asyncHandler(async (req: Request, res: Response) => {
    const grade = req.query.grade as string
    const sections = await sectionService.getSectionsByGrade(grade)

    res.status(CONSTANTS.STATUS_CODES.OK).json(
      new ApiResponse(
        CONSTANTS.STATUS_CODES.OK,
        sections,
        `Sections for grade ${grade} retrieved successfully`
      )
    )
  })

  getActiveSections = asyncHandler(async (req: Request, res: Response) => {
    const sections = await sectionService.getActiveSections()

    res.status(CONSTANTS.STATUS_CODES.OK).json(
      new ApiResponse(
        CONSTANTS.STATUS_CODES.OK,
        sections,
        'Active sections retrieved successfully'
      )
    )
  })
}

export default new SectionController()
