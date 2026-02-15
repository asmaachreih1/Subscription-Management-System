import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { validate } from '../middlewares/validate';
import { userSchema } from '../middlewares/schemas';
import { protect, restrictTo } from '../middlewares/auth.middleware';

const router = Router();

// Protect all routes
router.use(protect as any);

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);

// Admin-only operations
router.use(restrictTo('admin') as any);
router.post('/', validate(userSchema), userController.createUser);
router.patch('/:id', validate(userSchema), userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;
