import { Request, Response, NextFunction } from 'express';
import { logger } from '../../utils/logger';
import { emailSchema, registerSchema } from './auth.schema';
import { sendOtpEmail } from '../../Services/email.service';
import { generateotp } from '../../utils/otp';
import { appDataSouce } from '../../data-source';
import { Otp } from '../../entities/opt';
import { User } from '../../entities/User';

export const sendOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    logger.info('reached');
    const result = emailSchema.safeParse(req.body);
    if (!result.success) {
      return res
        .status(400)
        .json({ message: 'validation vailed', error: result.error?.format() });
    }
    const otpRep = appDataSouce.getRepository(Otp);
    const otpcode = generateotp();
    logger.debug({ otpcode }, 'otp is');
    const email = result.data?.email;
    await sendOtpEmail(email.toString(), otpcode.toString());
    await otpRep.delete({ email });
    await otpRep.save({
      email,
      otp: otpcode.toString(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });
    res.status(200).json({ message: 'otp sent success fully ', success: true });
  } catch (err) {
    logger.error('error in register');
    next(err);
  }
};

export const verifyotp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, otp } = req.body;
    if (!otp || !email) {
      return res.status(400).json({ message: ' otp and email are required' });
    }

    const otpRepo = appDataSouce.getRepository(Otp);
    const otpRecord = await otpRepo.findOne({
      where: {
        email,
        verified: false,
      },
      order: {
        createdAt: 'DESC',
      },
    });
    if (!otpRecord) {
      return res.status(400).json({
        messge: 'Ivalid or expired OTP',
      });
    }

    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }
    if (otpRecord.otp != otp.toString()) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    otpRecord.verified = true;
    await otpRepo.save(otpRecord);
    res.status(200).json({
      message: 'OTP verified successfully',
      success: true,
      otpId: otpRecord.id,
    });
  } catch (err) {
    logger.error({ err }, 'error in verify-otp');
    next(err);
  }
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: 'invalid registation data',
        errors: result.error.format(),
      });
    }
    const { otpId, name, age, gender, interests } = result.data;
    if (!otpId) {
      return res.status(400).json({ message: 'otpid requuired' });
    }
    const otpRepo = appDataSouce.getRepository(Otp);
    const userRepo = appDataSouce.getRepository(User);

    const otpRecord = await otpRepo.findOne({
      where: { id: otpId },
    });
    if (!otpRecord) {
      return res.status(400).json({ message: 'invalid registration ' });
    }
    if (!otpRecord.verified) {
      return res.status(400).json({
        message: 'OTP not verified',
      });
    }

    const email = otpRecord.email;

    const existingUser = await userRepo.findOne({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const user = userRepo.create({ email, name, age, gender, interests });

    await userRepo.save(user);
    await otpRepo.delete({ id: otpId });
    return res
      .status(201)
      .json({ message: 'User registered successfully', success: true });
  } catch (err) {
    logger.error({ err }, 'error in register');
    next(err);
  }
};
