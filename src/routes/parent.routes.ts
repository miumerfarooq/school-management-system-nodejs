import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import parentController from "../controllers/parent.controller";
import { validate } from "../middlewares/validate.middleware";
import {
	createParentSchema,
	getAllParentsSchema,
	getParentByIdSchema,
	updateParentSchema,
	deleteParentSchema,
} from "../validators/parent.validator";

const router = Router()

router.use(authenticate)

router.get('/', authorize('admin'), validate(getAllParentsSchema), parentController.getAllParents)
router.get('/:id', authorize('admin'), validate(getParentByIdSchema), parentController.getParentById)
router.post('/', authorize('admin'), validate(createParentSchema), parentController.createParent)
router.put('/:id', authorize('admin'), validate(updateParentSchema), parentController.updateParent)
router.delete('/:id', authorize('admin'), validate(deleteParentSchema), parentController.deleteParent)

export default router
