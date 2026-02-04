import express from 'express';
import { upload } from '../../middleware/upload';
import { requireAuth } from '../../middleware/auth.middleware';
import { uploadAvatar } from './user.controller';

const uploadRouter = express.Router();

uploadRouter.post(
  '/avatar',
  upload.single('avatar'),
  requireAuth,
  uploadAvatar,
);

export default uploadRouter;
