import express from 'express';
import { upload } from '../../middleware/upload';
import { uploadAvatar } from './user.controller';
import { getMyProfile, updateMyProfile } from './user.controller';
import { requireAuth } from '../../middleware/auth.middleware';
const userRouter = express.Router();

userRouter.put('/me/edit', requireAuth, updateMyProfile);
userRouter.get('/me', requireAuth, getMyProfile);
userRouter.post(
  '/me/avatar',
  requireAuth,
  upload.single('avatar'),
  uploadAvatar,
);

export default userRouter;
