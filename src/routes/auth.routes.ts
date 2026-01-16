import { Router } from "express"
import AuthController from "../controllers/auth.controller"
import { authenticate } from "../middlewares/auth.middleware"
import { validate } from "../middlewares/validate.middleware"
import {
  changePasswordSchema,
  createUserSchema,
  forgotPasswordSchema,
  loginUserSchema,
  resetPasswordSchema,
  verifyEmailSchema
} from "../validators/auth.validator"
import {
  authLimiter,
  emailVerificationLimiter,
  passwordResetLimiter
} from "../middlewares/rateLimiter.middleware"

const router = Router()

// Authentication routes
router.post('/register', authLimiter, validate(createUserSchema), AuthController.register)
router.post('/login', authLimiter, validate(loginUserSchema), AuthController.login)
router.post('/logout', authenticate, AuthController.logout)
router.get('/me', authenticate, AuthController.getCurrentUser)

// Password & Email routes
router.post('/change-password', authenticate, validate(changePasswordSchema), AuthController.changePassword)
router.post('/forgot-password', passwordResetLimiter, validate(forgotPasswordSchema), AuthController.forgotPassword)
router.post('/reset-password', validate(resetPasswordSchema), AuthController.resetPassword)
router.post('/verify-email', validate(verifyEmailSchema), AuthController.verifyEmail)
router.post('/resend-verification-email', emailVerificationLimiter, validate(forgotPasswordSchema), AuthController.resendVerificationEmail)

// Token routes
router.post('/refresh-token', AuthController.refreshToken)

export default router
