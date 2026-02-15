import { Router } from 'express';
import * as subscriptionController from '../controllers/subscription.controller';
import { validate } from '../middlewares/validate';
import { subscriptionSchema } from '../middlewares/schemas';
import { protect, restrictTo } from '../middlewares/auth.middleware';

const router = Router();

// Protect all routes
router.use(protect as any);

router.get('/', subscriptionController.getAllSubscriptions);
router.get('/:id', subscriptionController.getSubscriptionById);

// Admin-only operations
router.use(restrictTo('admin') as any);
router.post('/', validate(subscriptionSchema), subscriptionController.createSubscription);
router.patch('/:id', validate(subscriptionSchema), subscriptionController.updateSubscription);
router.delete('/:id', subscriptionController.deleteSubscription);

export default router;
