import { CONSTANTS } from "../config/constants"
import { env } from "../config/env"
import Student from "../models/student.model"
import User from "../models/user.model"
import Parent from "../models/parent.model"
import Section from "../models/section.model"
import { ApiError } from "../utils/ApiError"
import { StudentDocument } from "../types/Student"
import { CreateStudentBody } from "../validators/student.validator"
import { UserRole } from "../types"
import bcrypt from "bcryptjs"
import { Types } from "mongoose"

class StudentService {
  async createStudent(studentData: CreateStudentBody): Promise<{ student: StudentDocument }> {
    const { email, password, firstName, lastName, registrationNumber, sectionId, parents } = studentData

    const userExist = await User.findOne({ email })

    if (userExist) {
      throw new ApiError(
        CONSTANTS.STATUS_CODES.CONFLICT,
        CONSTANTS.ERROR_CODES.EMAIL_EXISTS,
        'User with this email already exists'
      )
    }

    const studentExist = await Student.findOne({ registrationNumber })

    if (studentExist) {
      throw new ApiError(
        CONSTANTS.STATUS_CODES.CONFLICT,
        CONSTANTS.ERROR_CODES.DUPLICATE_ENTRY,
        'Student with this registration number already exists',
      )
    }

    // Validate section exists if provided
    if (sectionId) {
      const section = await Section.findById(sectionId)
      if (!section) {
        throw new ApiError(
          CONSTANTS.STATUS_CODES.NOT_FOUND,
          CONSTANTS.ERROR_CODES.NOT_FOUND,
          'Section not found',
        )
      }
    }

    // Validate all parents exist if provided
    if (parents && parents.length > 0) {  // Only run if parents array is provided and non-empty
      const parentIds = parents.map(id => new Types.ObjectId(id))  // Convert string IDs to MongoDB ObjectId types (required for queries)
      const foundParents = await Parent.countDocuments({ _id: { $in: parentIds } })  // Count how many Parent docs match the IDs
      if (foundParents !== parents.length) {  // If count doesn't match input length, at least one ID is invalid/missing
        throw new ApiError(
          CONSTANTS.STATUS_CODES.NOT_FOUND,
          CONSTANTS.ERROR_CODES.NOT_FOUND,
          'One or more parents not found',
        )
      }
    }

    // Generate next student ID (sequence number)
    const lastStudent = await Student.findOne().sort({ studentId: -1 }).select('studentId')
    const nextStudentId = (lastStudent?.studentId || 0) + 1

    // Encrypt password
    const salt = await bcrypt.genSalt(env.bcrypt.rounds)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const user = await User.create({
      username: `${firstName.toLowerCase()}${lastName.toLowerCase()}`,
      email,
      password: hashedPassword,
      role: UserRole.STUDENT,
      isEmailVerified: true
    })

    if (!user) {
      throw new ApiError(
        CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR,
        CONSTANTS.ERROR_CODES.INTERNAL_SERVER_ERROR,
        CONSTANTS.ERRORS.USER_CREATION_FAILED
      )
    }

    // Create student
    const student = await Student.create({
      ...studentData,
      userId: user._id,
      studentId: nextStudentId,
      enrollmentDate: new Date(),
      parents: studentData.parents?.map(parentId => new Types.ObjectId(parentId)) || []
    })

    if (!student) {
      // Rollback: delete created user if student creation fails
      await User.findByIdAndDelete(user._id)
      throw new ApiError(
        CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR,
        CONSTANTS.ERROR_CODES.INTERNAL_SERVER_ERROR,
        'Failed to create student record'
      )
    }

    // Populate user reference
    const populatedStudent = await Student.findById(student._id)
      .populate('userId', '-password')
      .populate('sectionId')
      .populate('parents')
      .exec()

    return { student: populatedStudent as StudentDocument }
  }

  async getStudents(): Promise<StudentDocument[]> {
    const students = await Student.find()
      .populate('userId', '-password')
      .populate('sectionId')
      .populate('parents')
      .exec()

    return students as StudentDocument[]
  }
}

export default new StudentService()
