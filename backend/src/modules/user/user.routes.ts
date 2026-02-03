import express from 'express';
import { upload } from '../../middleware/upload';
import { getMyProfile, updateMyProfile, uploadAvatar } from './user.controller';
import { requireAuth } from '../../middleware/auth.middleware';
const userRouter = express.Router();
userRouter.post('/me/avatar', requireAuth, upload.single('avatar'), uploadAvatar);
userRouter.put('/me/edit', requireAuth, updateMyProfile);
userRouter.get('/me', requireAuth, getMyProfile);

export default userRouter;
