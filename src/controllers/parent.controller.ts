import { Request, Response } from "express"
import { asyncHandler } from "../utils/asyncHandler"
import parentService from "../services/parent.service"
import { CONSTANTS } from "../config/constants"
import { ApiResponse } from "../utils/ApiResponse"
import { TypedRequest } from "../types/request"
import { CreateParentBody, GetAllParentsQuery } from "../validators/parent.validator"

class parentController {
  createParent = asyncHandler(async (req: TypedRequest<{}, {}, CreateParentBody>, res: Response) => {
    const parent = await parentService.createParent(req.body)

    res
      .status(CONSTANTS.STATUS_CODES.CREATED)
      .json(
        new ApiResponse(
          CONSTANTS.STATUS_CODES.CREATED,
          parent,
          'Parent created successfully'
        )
      )
  })

  getAllParents = asyncHandler(async (req: TypedRequest<{}, GetAllParentsQuery, {}>, res: Response) => {
    const { page, limit } = req.query
    const options = {
      page: page ? page : 1,
      limit: limit ? limit : 10,
    }

    const parents = await parentService.getAllParents(options)

    res
      .status(CONSTANTS.STATUS_CODES.OK)
      .json(
        new ApiResponse(
          CONSTANTS.STATUS_CODES.OK,
          parents,
          'Parents retrieved successfully'
        )
      )
  })

  getParentById = asyncHandler(async (req: Request, res: Response) => {
    const parent = await parentService.getParentById(req.params.id)

    res
      .status(CONSTANTS.STATUS_CODES.OK)
      .json(
        new ApiResponse(
          CONSTANTS.STATUS_CODES.OK,
          parent,
          'Parent retrieved successfully'
        )
      )
  })

  updateParent = asyncHandler(async (req: Request, res: Response) => {
    const parent = await parentService.updateParent(req.params.id, req.body)

    res
      .status(CONSTANTS.STATUS_CODES.OK)
      .json(
        new ApiResponse(
          CONSTANTS.STATUS_CODES.OK,
          parent,
          'Parent updated successfully'
        )
      )
  })

  deleteParent = asyncHandler(async (req: Request, res: Response) => {
    await parentService.deleteParent(req.params.id)

    res
      .status(CONSTANTS.STATUS_CODES.OK)
      .json(
        new ApiResponse(
          CONSTANTS.STATUS_CODES.OK,
          {},
          'Parent deleted successfully'
        )
      )
  })
}

export default new parentController()
