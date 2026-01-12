import { Router } from "express"
import AuthController from "../controllers/auth.controller"
import { validate } from "../middlewares/validate.middleware"
import { createUserSchema, loginUserSchema } from "../validators/auth.validator"
import { authenticate } from "../middlewares/auth.middleware"

const router = Router()

// Authentication routes
router.post('/register', validate(createUserSchema), AuthController.register)
router.post('/login', validate(loginUserSchema), AuthController.login)
router.post('/logout', authenticate, AuthController.logout)

export default router
