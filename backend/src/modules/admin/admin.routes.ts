import { Router } from 'express';
import adminAuthRouter from './auth/authRouter';
import adminUserRouter from './user/user.routes';

const adminRouter = Router();

adminRouter.use('/auth', adminAuthRouter);

adminRouter.use('/users', adminUserRouter);

export default adminRouter;
