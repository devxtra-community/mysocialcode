import { NextFunction, Request, Response } from 'express';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2 } from '../../utils/r2';
import { appDataSouce } from '../../data-source';
import { User } from '../../entities/User';
import { logger } from '../../utils/logger';
export const uploadAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Avatar is required' });
    }
    const userId = req.body.userId; // this is temp
    const file = req.file;
    const key = `avatars/${userId}-${Date.now()}`;
    await r2.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );
    const imageUrl = `${process.env.R2_ENDPOINT}/${process.env.R2_BUCKET_NAME}/${key}`;
    const userRepo = appDataSouce.getRepository(User);
    await userRepo.update(userId, { profileImageUrl: imageUrl });
    res
      .status(200)
      .json({ message: 'profile picture uploaded', url: imageUrl });
  } catch (err) {
    logger.error({ err }, 'error in upload image');
    next(err);
  }
};
