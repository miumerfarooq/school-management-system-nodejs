import { Request, Response } from "express"
import { asyncHandler } from "../utils/asyncHandler"
import studentService from "../services/student.service"
import { CONSTANTS } from "../config/constants"
import { ApiResponse } from "../utils/ApiResponse"

class StudentController {
  createStudent = asyncHandler(async (req: Request, res: Response) => {
    const student = await studentService.createStudent(req.body)

    res
      .status(CONSTANTS.STATUS_CODES.CREATED)
      .json(
        new ApiResponse(
          CONSTANTS.STATUS_CODES.CREATED,
          student,
          'User created successfully'
        )
      )
  })
}

export default new StudentController()
