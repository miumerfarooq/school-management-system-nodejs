import { Request, Response } from "express"
import { asyncHandler } from "../utils/asyncHandler"
import studentService from "../services/student.service"
import { CONSTANTS } from "../config/constants"
import { ApiResponse } from "../utils/ApiResponse"
import { TypedRequest } from "../types/request"
import { CreateStudentBody, GetAllStudentsQuery } from "../validators/student.validator"

class StudentController {
  createStudent = asyncHandler(async (req: TypedRequest<{}, {}, CreateStudentBody>, res: Response) => {
    const { student } = await studentService.createStudent(req.body)

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

  getAllStudents = asyncHandler(async (req: TypedRequest<{}, GetAllStudentsQuery, {}>, res: Response) => {
    const { page, limit } = req.query
    const options = {
      page: page ? page : 1,
      limit: limit ? limit : 10,
    };

    const students = await studentService.getAllStudents(options)

    res
      .status(CONSTANTS.STATUS_CODES.OK)
      .json(
        new ApiResponse(
          CONSTANTS.STATUS_CODES.OK,
          students,
          'Students retrieved successfully'
        )
      )
  })

  getStudentById = asyncHandler(async (req: Request, res: Response) => {
    const student = await studentService.getStudentById(req.params.id)

    res
      .status(CONSTANTS.STATUS_CODES.OK)
      .json(
        new ApiResponse(
          CONSTANTS.STATUS_CODES.OK,
          student,
          'Student retrieved successfully'
        )
      )
  })

  updateStudent = asyncHandler(async (req: Request, res: Response) => {
    const student = await studentService.updateStudent(req.params.id, req.body)

    res
      .status(CONSTANTS.STATUS_CODES.OK)
      .json(
        new ApiResponse(
          CONSTANTS.STATUS_CODES.OK,
          student,
          'Student updated successfully'
        )
      )
  })

  deleteStudent = asyncHandler(async (req: Request, res: Response) => {
    const student = await studentService.deleteStudent(req.params.id)

    res
      .status(CONSTANTS.STATUS_CODES.OK)
      .json(
        new ApiResponse(
          CONSTANTS.STATUS_CODES.OK,
          student,
          'Student deleted successfully' // 'Student deactivated successfully'
        )
      )
  })
}

export default new StudentController()
