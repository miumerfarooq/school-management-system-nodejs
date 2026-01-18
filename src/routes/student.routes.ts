import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import studentController from "../controllers/student.controller";

const router = Router()

// All student routes require authentication
router.use(authenticate)

router.post('/', studentController.createStudent)

export default router
