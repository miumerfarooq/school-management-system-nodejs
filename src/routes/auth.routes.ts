import { Router } from "express"
import AuthController from "../controllers/auth.controller"
import { validate } from "../middlewares/validate.middleware"
import { changePasswordSchema, createUserSchema, loginUserSchema, verifyEmailSchema } from "../validators/auth.validator"
import { authenticate } from "../middlewares/auth.middleware"

const router = Router()

// Authentication routes
router.post('/register', validate(createUserSchema), AuthController.register)
router.post('/login', validate(loginUserSchema), AuthController.login)

router.post('/refresh-token', AuthController.refreshToken)
router.get('/verify-email', validate(verifyEmailSchema), AuthController.verifyEmail)
// Protected routes
router.post('/logout', authenticate, AuthController.logout)
router.post('/change-password', authenticate, validate(changePasswordSchema), AuthController.changePassword)
router.get('/me', authenticate, AuthController.getCurrentUser)

export default router
