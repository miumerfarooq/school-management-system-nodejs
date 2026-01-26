import { Request, Response, Router } from "express"
import authRoutes from "./auth.routes"
import studentRoutes from "./student.routes"
import parentRoutes from "./parent.routes"

const router = Router()

router.use('/auth', authRoutes)
router.use('/students', studentRoutes)
router.use('/parents', parentRoutes)

router.get("/health", (_req: Request, res: Response) => {
  res
  .status(200)
  .json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  })
})

export default router
