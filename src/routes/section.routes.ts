import { Router } from "express"
import { authenticate, authorize } from "../middlewares/auth.middleware"
import sectionController from "../controllers/section.controller"
import { validate } from "../middlewares/validate.middleware"
import {
  createSectionSchema,
  getAllSectionsSchema,
  getSectionByIdSchema,
  updateSectionSchema,
  deleteSectionSchema,
} from "../validators/section.validator"

const router = Router()

// All section routes require authentication
router.use(authenticate)

// Public endpoints (accessible to authenticated users)
router.get(
  '/active',
  sectionController.getActiveSections
)

router.get(
  '/by-grade/:grade',
  sectionController.getSectionsByGrade
)

// Admin-only endpoints
router.post(
  '/',
  authorize('admin'),
  validate(createSectionSchema),
  sectionController.createSection
)

router.get(
  '/',
  authorize('admin', 'teacher'),
  validate(getAllSectionsSchema),
  sectionController.getAllSections
)

router.get(
  '/:id',
  authorize('admin', 'teacher'),
  validate(getSectionByIdSchema),
  sectionController.getSectionById
)

router.put(
  '/:id',
  authorize('admin'),
  validate(updateSectionSchema),
  sectionController.updateSection
)

router.delete(
  '/:id',
  authorize('admin'),
  validate(deleteSectionSchema),
  sectionController.deleteSection
)

export default router
