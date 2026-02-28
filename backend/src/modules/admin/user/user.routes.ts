import { Router } from 'express';
import { getUserDetails, listUsers, toggleUserStatus } from './user.controller';
import { requireAdmin } from '../../../middleware/auth.middleware';

const adminUserRouter = Router();

adminUserRouter.get('/', requireAdmin, listUsers);

adminUserRouter.get('/:id', requireAdmin, getUserDetails);
adminUserRouter.put('/:userId/status', requireAdmin, toggleUserStatus);

export default adminUserRouter;
