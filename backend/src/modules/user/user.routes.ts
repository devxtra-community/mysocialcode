import express from 'express';
import { upload } from '../../middleware/upload';
import { uploadAvatar } from './user.controller';
const userRouter = express.Router();
userRouter.post('/me/avatar', upload.single('avatar'), uploadAvatar);
export default userRouter;
