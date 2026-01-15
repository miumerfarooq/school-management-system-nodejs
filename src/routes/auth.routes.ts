import { Router } from "express"
import AuthController from "../controllers/auth.controller"
import { validate } from "../middlewares/validate.middleware"
import { changePasswordSchema, createUserSchema, forgotPasswordSchema, loginUserSchema, resetPasswordSchema, verifyEmailSchema } from "../validators/auth.validator"
import { authenticate } from "../middlewares/auth.middleware"

const router = Router()

// Authentication routes
router.post('/register', validate(createUserSchema), AuthController.register)
router.post('/login', validate(loginUserSchema), AuthController.login)

router.post('/refresh-token', AuthController.refreshToken)
router.post('/verify-email', validate(verifyEmailSchema), AuthController.verifyEmail)
// Protected routes
router.post('/logout', authenticate, AuthController.logout)
router.post('/change-password', authenticate, validate(changePasswordSchema), AuthController.changePassword)
router.get('/me', authenticate, AuthController.getCurrentUser)
router.post('/forgot-password', validate(forgotPasswordSchema), AuthController.forgotPassword)
router.post('/reset-password', validate(resetPasswordSchema), AuthController.resetPassword)

export default router
