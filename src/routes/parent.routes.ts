import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import parentController from "../controllers/parent.controller";

const router = Router()

router.use(authenticate)

router.post('/', authorize('admin'), parentController.createParent)

export default router
