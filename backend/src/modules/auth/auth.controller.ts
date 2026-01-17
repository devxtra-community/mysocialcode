import { Request, Response, NextFunction } from 'express';
import { logger } from '../../utils/logger';
import { registerSchema, phoneSchema, loginSchema } from './auth.schema';
import { sendOtpSms } from '../../Services/sms.service';
import { generateotp } from '../../utils/otp';
import { appDataSouce } from '../../data-source';
import { Otp } from '../../entities/opt';
import { User } from '../../entities/User';
import { signAccessToken } from '../../Services/jwt.service';
import { createRefreshTokenSession } from '../../Services/authToken';
import bcrypt from 'bcrypt';

export const sendOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    logger.info('reached');

    const result = phoneSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: 'validation failed',
        error: result.error.format(),
      });
    }

    const phoneNumber = result.data.phoneNumber;

    const userRepo = appDataSouce.getRepository(User);
    const otpRepo = appDataSouce.getRepository(Otp);

    const existingUser = await userRepo.findOne({
      where: { phoneNumber },
    });

    if (
      existingUser &&
      existingUser.isPhoneVerified === true &&
      existingUser.passwordHash
    ) {
      return res.status(409).json({
        success: false,
        next: 'login',
        message: 'Account already exists. Please login with password.',
      });
    }

    const otpCode = generateotp();
    logger.debug({ otpCode }, 'otp is');

    await sendOtpSms(phoneNumber, otpCode.toString());

    await otpRepo.delete({ phoneNumber });
    await otpRepo.save({
      phoneNumber,
      otp: otpCode.toString(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
    });
  } catch (err) {
    logger.error({ err }, 'error in sendOtp');
    next(err);
  }
};

export const verifyotp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(req.body);

  try {
    const { phoneNumber, otp } = req.body;
    if (!otp || !phoneNumber) {
      return res
        .status(400)
        .json({ message: ' otp and phoneNumber are required' });
    }
    const otpRepo = appDataSouce.getRepository(Otp);
    const otpRecord = await otpRepo.findOne({
      where: {
        phoneNumber,
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

    return res.status(200).json({
      success: true,
      userExists: false,
      message: 'OTP verified, new user',
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
        message: 'invalid registration data',
        errors: result.error.format(),
      });
    }

    const {
      otpId,
      name,
      age,
      gender,
      interests,
      email,
      password,
      confirmPassword,
    } = result.data;

    if (!otpId) {
      return res.status(400).json({ message: 'otpId required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: 'Passwords do not match',
      });
    }

    const otpRepo = appDataSouce.getRepository(Otp);
    const userRepo = appDataSouce.getRepository(User);

    const otpRecord = await otpRepo.findOne({
      where: { id: otpId },
    });

    if (!otpRecord || !otpRecord.verified) {
      return res.status(400).json({
        message: 'OTP not verified or invalid',
      });
    }

    const phoneNumber = otpRecord.phoneNumber;

    const existingUser = await userRepo.findOne({
      where: { phoneNumber },
    });

    if (existingUser && existingUser.passwordHash) {
      return res.status(409).json({
        message: 'User already exists',
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = userRepo.create({
      phoneNumber,
      name,
      age,
      gender,
      interests,
      email,
      passwordHash,
      isPhoneVerified: true,
    });

    await userRepo.save(user);

    await otpRepo.delete({ id: otpId });

    const accessToken = signAccessToken({
      userId: user.id,
    });

    const refreshToken = await createRefreshTokenSession(user);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      accessToken,
      refreshToken,
    });
  } catch (err) {
    logger.error({ err }, 'error in register');
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: 'Invalid login data',
        errors: result.error.format(),
      });
    }

    const { phoneNumber, password } = result.data;

    const userRepo = appDataSouce.getRepository(User);

    // 2️⃣ find user
    const user = await userRepo.findOne({
      where: { phoneNumber },
    });

    if (!user) {
      return res.status(401).json({
        message: 'Invalid phone number or password',
      });
    }

    // 3️⃣ block incomplete registration
    if (!user.passwordHash || !user.isPhoneVerified) {
      return res.status(403).json({
        message: 'Account not fully registered',
      });
    }

    // 4️⃣ compare password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid phone number or password',
      });
    }

    // 5️⃣ issue tokens
    const accessToken = signAccessToken({
      userId: user.id,
    });

    const refreshToken = await createRefreshTokenSession(user);

    return res.status(200).json({
      success: true,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    logger.error({ err }, 'error in login');
    next(err);
  }
};
