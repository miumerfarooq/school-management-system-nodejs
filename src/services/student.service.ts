import { CONSTANTS } from "../config/constants"
import { env } from "../config/env"
import Student from "../models/student.model"
import User from "../models/user.model"
import { ApiError } from "../utils/ApiError"
import bcrypt from "bcryptjs"

class StudentService {
  async createStudent(studentData: any): Promise<any> {
    const { email, password } = studentData

    const userExist = await User.findOne({ email })

    if (userExist) {
      throw new ApiError(
        CONSTANTS.STATUS_CODES.CONFLICT,
        CONSTANTS.ERROR_CODES.CONFLICT,
        'User with this email already exists'
      )
    }

    // encrypt password
    const salt = await bcrypt.genSalt(env.bcrypt.rounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      email,
      password: hashedPassword,
      role: 'student',
      isEmailVerified: true
    })

    await user.save()

    const student = await Student.create({
      ...studentData,
      userId: user._id
    })

    return { user, student }
  }
}

export default new StudentService()
