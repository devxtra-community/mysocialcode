import express from 'express';
// import { upload } from '../../middleware/upload';
import { getMyProfile, updateMyProfile } from './user.controller';
import { requireAuth } from '../../middleware/auth.middleware';
const userRouter = express.Router();

userRouter.put('/me/edit', requireAuth, updateMyProfile);
userRouter.get('/me', requireAuth, getMyProfile);

export default userRouter;
