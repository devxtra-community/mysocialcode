import { NextFunction, Request, Response } from 'express';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2 } from '../../utils/r2';
import { appDataSource } from '../../data-source';
import { User } from '../../entities/User';
import { logger } from '../../utils/logger';

export const uploadAvatar = async (req: Request, res: Response) => {
  try {
    console.log('uploadAvatar controller HIT');

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'Avatar is required' });
    }

    // console.log('uploading to R2...');

    const key = `avatars/${userId}-${Date.now()}.jpg`;

    await r2.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    const imageUrl = `${process.env.R2_PUBLIC_URL}/${key}`;
    // console.log('saving image url to DB:', imageUrl);

    await appDataSource
      .getRepository(User)
      .update({ id: userId }, { profileImageUrl: imageUrl });

    // console.log('avatar upload complete');

    return res.status(200).json({ url: imageUrl });
  } catch (err) {
    console.error('upload avatar failed:', err);
    return res.status(500).json({ message: 'Upload failed' });
  }
};

export const getMyProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = req.user?.id;

    const userRepo = appDataSource.getRepository(User);

    const user = await userRepo.findOne({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        phoneNumber: true,
        name: true,
        age: true,
        gender: true,
        interests: true,
        profileImageUrl: true,
        isPhoneVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    logger.error({ err }, 'error in getMyProfile');
    next(err);
  }
};

export const updateMyProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = req.user.id;

    const { name, age, gender, interests, email, phoneNumber } = req.body;

    const userRepo = appDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ id: userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (email !== undefined) user.email = email;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (name !== undefined) user.name = name;
    if (age !== undefined && age !== '') {
      user.age = Number(age);
    }

    if (gender !== undefined) user.gender = gender;

    if (Array.isArray(interests)) {
      user.interests = interests;
    }

    await userRepo.save(user);

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
    });
  } catch (err) {
    logger.error({ err }, 'error updating profile');
    next(err);
  }
};
