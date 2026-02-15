import { Router } from 'express';
import * as planController from '../controllers/plan.controller';
import { validate } from '../middlewares/validate';
import { planSchema } from '../middlewares/schemas';
import { protect, restrictTo } from '../middlewares/auth.middleware';

const router = Router();

// Protect all routes
router.use(protect as any);

router.get('/', planController.getAllPlans);
router.get('/:id', planController.getPlanById);

// Admin-only operations
router.use(restrictTo('admin') as any);
router.post('/', validate(planSchema), planController.createPlan);
router.patch('/:id', validate(planSchema), planController.updatePlan);
router.delete('/:id', planController.deletePlan);

export default router;
