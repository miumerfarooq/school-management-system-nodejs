import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import studentController from "../controllers/student.controller";
import { validate } from "../middlewares/validate.middleware";
import { createStudentSchema, getAllStudentsSchema, getStudentByIdSchema } from "../validators/student.validator";

const router = Router()

// All student routes require authentication
router.use(authenticate)

router.post('/', authorize('admin'), validate(createStudentSchema), studentController.createStudent)
router.get('/', authorize('admin', 'teacher'), validate(getAllStudentsSchema), studentController.getAllStudents)
router.get('/:id', authorize('admin', 'teacher', 'student'), validate(getStudentByIdSchema), studentController.getStudentById)

export default router
