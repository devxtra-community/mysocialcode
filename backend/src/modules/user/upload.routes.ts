import express from 'express';
import { uploadAvatar } from './user.controller';
import { requireAuth } from '../../middleware/auth.middleware';
import { upload } from '../../middleware/upload';

const uploadRouter = express.Router();

uploadRouter.post(
  '/avatar',
  upload.single('avatar'),
  requireAuth,
  uploadAvatar,
);

export default uploadRouter;
