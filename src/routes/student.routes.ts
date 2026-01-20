import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import studentController from "../controllers/student.controller";
import { validate } from "../middlewares/validate.middleware";
import { createStudentSchema } from "../validators/student.validator";

const router = Router()

// All student routes require authentication
router.use(authenticate)

router.post('/', authorize('admin'), validate(createStudentSchema), studentController.createStudent)

export default router
