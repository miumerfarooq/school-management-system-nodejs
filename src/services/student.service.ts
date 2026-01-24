import { CONSTANTS } from "../config/constants"
import { env } from "../config/env"
import Student from "../models/student.model"
import User from "../models/user.model"
import Parent from "../models/parent.model"
import Section from "../models/section.model"
import { ApiError } from "../utils/ApiError"
import { StudentDocument } from "../types/Student"
import { CreateStudentBody } from "../validators/student.validator"
import { StudentStatus, UserRole } from "../types"
import { hashPassword } from "../utils/password"
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
    const hashedPassword = await hashPassword(password)

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

  async getAllStudents(options: { page: number; limit: number }): Promise<{ students: StudentDocument[]; total: number; page: number; pages: number }> {
    const { page, limit } = options
    const skip = (page - 1) * limit

    const [students, total] = await Promise.all([
      Student.find()
        .skip(skip)
        .limit(limit)
        .populate('userId', '-password')
        .populate('sectionId')
        .populate('parents')
        .sort({ createdAt: -1 })
        .exec(),
      Student.countDocuments()
    ])

    if(!students || students.length === 0) {
      throw new ApiError(
        CONSTANTS.STATUS_CODES.NOT_FOUND,
        CONSTANTS.ERROR_CODES.NOT_FOUND,
        'No students found'
      )
    }

    const pages = Math.ceil(total / limit)

    return { students: students as StudentDocument[], total, page, pages }
  }

  async getStudentById(id: string): Promise<StudentDocument | null> {
    // Learning multiple ways to fetch student

    // const student = await Student.findById(id)
    //   .populate('userId', '-password')
    //   .populate('sectionId')
    //   .populate('parents')
    //   .exec()

    const student = await Student.aggregate([
      // Stage 1: Match by student ID
      {
        $match: {
          _id: new Types.ObjectId(id)
        }
      },
      // Stage 2: Join with users collection
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "studentAccountDetail",
          pipeline: [
            {
              $project: {
                _id: 1,
                username: 1,
                email: 1,
                role: 1
              }
            }
          ]
        }
      },
      // Flatten the studentAccountDetail array returned by $lookup into a single object.
      {
        $unwind: {
          path: "$studentAccountDetail",
          preserveNullAndEmptyArrays: true
        }
      },
      // Stage 3: Join with sections collection
      {
        $lookup: {
          from: "sections",
          localField: "sectionId",
          foreignField: "_id",
          as: "sectionDetail"
        }
      },
      // Flatten the sectionDetail array returned by $lookup into a single object.
      // $arrayElemAt picks the first element (index 0) so instead of sectionDetail: [{}],
      // you get sectionDetail: {} directly.
      {
        $addFields: {
          sectionDetail: {
            $arrayElemAt: ["$sectionDetail", 0]
          }
        }
      },
      // Stage 4: Join with parents collection
      {
        $lookup: {
          from: "parents",
          localField: "parents",
          foreignField: "_id",
          as: "parentDetails"
        }
      },
      {
        $addFields: {
          parentDetails: {
            $arrayElemAt: ["$parentDetails", 0]
          }
        }
      },
      // Stage 5: Optional projection to keep fields and hide sensitive fields
      // {
      //   $project: {
      //     // parentDetails: 1,
      //     "studentAccountDetail.password": 0,
      //     "studentAccountDetail.isActive": 0,
      //     "studentAccountDetail.isEmailVerified": 0,
      //     "studentAccountDetail.failedLoginAttempts": 0,
      //     "studentAccountDetail.lockUntil": 0
      //   }
      // }
    ])

    if (!student || student.length === 0) {
      throw new ApiError(
        CONSTANTS.STATUS_CODES.NOT_FOUND,
        CONSTANTS.ERROR_CODES.NOT_FOUND,
        'Student not found'
      )
    }

    return student[0] as StudentDocument
  }

  // - Partial<T> is a built-in TypeScript utility type.
  // - It takes a type T (StudentDocument) and makes all of its properties optional.
  async updateStudent(id: string, updateData: any): Promise<StudentDocument | null> {
    // Check if student exists
    const existingStudent = await Student.findById(id)

    if (!existingStudent) {
      throw new ApiError(
        CONSTANTS.STATUS_CODES.NOT_FOUND,
        CONSTANTS.ERROR_CODES.NOT_FOUND,
        'Student not found'
      )
    }

    // Extract email if provided (email belongs to User model, not Student)
    const { email, ...studentUpdateData } = updateData

    // Validate email uniqueness if email is being updated
    if (email) {
      const user = await User.findById(existingStudent.userId)
      if (email !== user?.email) {
        const emailExists = await User.findOne({ email })
        if (emailExists) {
          throw new ApiError(
            CONSTANTS.STATUS_CODES.CONFLICT,
            CONSTANTS.ERROR_CODES.EMAIL_EXISTS,
            'User with this email already exists'
          )
        }
      }
    }

    // Validate registration number uniqueness if being updated
    if (studentUpdateData.registrationNumber && studentUpdateData.registrationNumber !== existingStudent.registrationNumber) {
      const regNumberExists = await Student.findOne({ registrationNumber: studentUpdateData.registrationNumber })
      if (regNumberExists) {
        throw new ApiError(
          CONSTANTS.STATUS_CODES.CONFLICT,
          CONSTANTS.ERROR_CODES.DUPLICATE_ENTRY,
          'Student with this registration number already exists'
        )
      }
    }

    // Validate section exists if being updated
    if (studentUpdateData.sectionId) {
      const section = await Section.findById(studentUpdateData.sectionId)
      if (!section) {
        throw new ApiError(
          CONSTANTS.STATUS_CODES.NOT_FOUND,
          CONSTANTS.ERROR_CODES.NOT_FOUND,
          'Section not found'
        )
      }
    }

    // Validate all parents exist if being updated
    if (studentUpdateData.parents && studentUpdateData.parents.length > 0) {
      const parentIds = studentUpdateData.parents.map((id: any) => new Types.ObjectId(id))
      const foundParents = await Parent.countDocuments({ _id: { $in: parentIds } })
      if (foundParents !== studentUpdateData.parents.length) {
        throw new ApiError(
          CONSTANTS.STATUS_CODES.NOT_FOUND,
          CONSTANTS.ERROR_CODES.NOT_FOUND,
          'One or more parents not found'
        )
      }
    }

    // Update user email if it's being changed
    if (email) {
      await User.findByIdAndUpdate(existingStudent.userId, { email })
    }

    // runValidators: true tells Mongoose to apply schema validation rules to the updateData before saving.
    const student = await Student.findByIdAndUpdate(id, studentUpdateData, { new: true, runValidators: true })
      .populate('userId', '-password')
      .populate('sectionId')
      .populate('parents')
      .exec()

    if (!student) {
      throw new ApiError(
        CONSTANTS.STATUS_CODES.NOT_FOUND,
        CONSTANTS.ERROR_CODES.NOT_FOUND,
        'Student update failed'
      )
    }

    return student as StudentDocument
  }

  async deleteStudent(id: string): Promise<void> {
    const student = await Student.findById(id)

    if (!student) {
      throw new ApiError(
        CONSTANTS.STATUS_CODES.NOT_FOUND,
        CONSTANTS.ERROR_CODES.NOT_FOUND,
        'Student not found'
      )
    }

    await User.findByIdAndUpdate(student.userId, { isActive: false })
    await Student.findByIdAndUpdate(student._id, { status: StudentStatus.INACTIVE })


  }

  async getProfile(userId: string): Promise<StudentDocument | null> {
    const student = await Student.findOne({ userId })
      .populate('userId', '-password')
      .populate('sectionId')
      .populate('parents')
      .exec()

    if (!student) {
      throw new ApiError(
        CONSTANTS.STATUS_CODES.NOT_FOUND,
        CONSTANTS.ERROR_CODES.NOT_FOUND,
        'Student profile not found'
      )
    }

    return student as StudentDocument
  }
}

export default new StudentService()
