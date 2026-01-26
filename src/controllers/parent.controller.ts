import { Request, Response } from "express"
import { asyncHandler } from "../utils/asyncHandler"
import parentService from "../services/parent.service"
import { CONSTANTS } from "../config/constants"
import { ApiResponse } from "../utils/ApiResponse"

class parentController {
  createParent = asyncHandler(async (req: Request, res: Response) => {
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
}

export default new parentController()
