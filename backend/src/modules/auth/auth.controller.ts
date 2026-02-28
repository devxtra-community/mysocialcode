import { Request, Response, NextFunction } from 'express';
import { logger } from '../../utils/logger';
import { generateotp } from '../../utils/otp';
import { appDataSource } from '../../data-source';
import { Otp } from '../../entities/otp';
import { User } from '../../entities/User';
import { signAccessToken } from '../../Services/jwt.service';
import { createRefreshTokenSession } from '../../Services/authToken';
import bcrypt from 'bcrypt';
import { hashRefreshToken } from '../../Services/refreshToken';
import { publish } from '../../messaging/rabbitmq/publish';
import { v4 as uuid } from 'uuid';
import { refreshAccessTokenService } from './auth.service';
import { RefreshTokenEntity } from '../../entities/refreshToken';
import { sendLinkEmail, sendOtpEmail } from '../../Services/email.service';
import {
  signPasswordResetToken,
  verifyPasswordResetToken,
} from '../../Services/passwordReset.service';
import { redisClient } from '../../utils/redis';
import { env } from '../../config/env';
// import { Admin } from '../../entities/Admin';

export const sendOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    logger.info('reached');

    const phoneNumber = req.body.phoneNumber.trim();

    const userRepo = appDataSource.getRepository(User);
    const otpRepo = appDataSource.getRepository(Otp);

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

    const lastOtp = await otpRepo.findOne({
      where: { phoneNumber },
      order: { createdAt: 'DESC' },
    });

    if (lastOtp && Date.now() - lastOtp.createdAt.getTime() < 60_000) {
      return res.status(429).json({
        message: 'Please wait before requesting another OTP',
      });
    }

    const otpCode = generateotp().toString();
    logger.debug('OTP generated');

    const hashedOtp = await bcrypt.hash(otpCode, 10);

    const requestId = uuid();

    await otpRepo.delete({ phoneNumber });

    await otpRepo.save({
      phoneNumber,
      otp: hashedOtp,
      requestId,
      sent: false,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await publish('SEND_OTP', {
      phone: phoneNumber,
      otp: otpCode.toString(),
      purpose: 'login',
      retryCount: 0,
      requestId,
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
  try {
    const { phoneNumber, otp } = req.body;

    const normalizedPhone = phoneNumber.trim();
    const otpInput = String(otp).trim();

    const otpRepo = appDataSource.getRepository(Otp);

    const otpRecord = await otpRepo.findOne({
      where: {
        phoneNumber: normalizedPhone,
        consumed: false,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    if (!otpRecord) {
      return res.status(400).json({
        message: 'Invalid or expired OTP',
      });
    }

    if (otpRecord.expiresAt < new Date()) {
      otpRecord.consumed = true;
      await otpRepo.save(otpRecord);

      return res.status(400).json({
        message: 'Invalid or expired OTP',
      });
    }

    if (otpRecord.attempts >= 5) {
      otpRecord.consumed = true;
      await otpRepo.save(otpRecord);

      return res.status(429).json({
        message: 'Too many invalid attempts',
      });
    }

    const isValid = await bcrypt.compare(otpInput, otpRecord.otp);

    if (!isValid) {
      otpRecord.attempts += 1;
      await otpRepo.save(otpRecord);
      return res.status(400).json({
        message: 'Invalid or expired OTP',
      });
    }

    otpRecord.verified = true;
    otpRecord.consumed = true;
    await otpRepo.save(otpRecord);

    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
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
    const {
      otpId,
      name,
      age,
      gender,
      interests,
      email,
      password,
      confirmPassword,
    } = req.body;

    if (!otpId) {
      return res.status(400).json({ message: 'otpId required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: 'Passwords do not match',
      });
    }

    const otpRepo = appDataSource.getRepository(Otp);
    const userRepo = appDataSource.getRepository(User);

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
      id: user.id,
      type: 'USER',
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
    // const result = loginSchema.safeParse(req.body);
    // if (!result.success) {
    //   return res.status(400).json({
    //     message: 'Invalid login data',
    //     errors: result.error.format(),
    //   });
    // }

    const { phoneNumber, password } = req.body;

    const userRepo = appDataSource.getRepository(User);

    const user = await userRepo.findOne({
      where: { phoneNumber },
    });

    if (!user) {
      return res.status(401).json({
        message: 'user not found',
      });
    }

    if (!user.passwordHash || !user.isPhoneVerified) {
      return res.status(401).json({
        message: 'not verified',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    }

    const accessToken = signAccessToken({
      id: user.id,
      type: 'USER',
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

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.error('reached thee logout api');
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        message: 'Refresh token required',
      });
    }

    const refreshTokenRepo = appDataSource.getRepository(RefreshTokenEntity);
    const hashToken = hashRefreshToken(refreshToken);

    await refreshTokenRepo.delete({
      tokenHash: hashToken,
    });

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (err) {
    logger.error({ err }, 'error in logout');
    next(err);
  }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: 'refresh token missing' });
    }

    const newAccessToken = await refreshAccessTokenService(refreshToken);

    return res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res
      .status(403)
      .json({ message: 'Invalid refresh token', error: err });
  }
};

export const forgetPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    console.log('email' + 'req.body');
    console.log(email, req.body);

    const userRepo = appDataSource.getRepository(User);

    const user = await userRepo.findOne({
      where: { email },
    });

    if (!user) {
      return res
        .status(200)
        .json({ message: 'If email exists, reset link sent' });
    }

    console.log('user' + 'userRepo');
    console.log(user, userRepo);

    const resetToken = signPasswordResetToken(user.id);

    const redis = await redisClient.set(
      `password_reset:${resetToken}`,
      user.id.toString(),
      {
        EX: 900,
      },
    );

    console.log('redis: ' + redis);
    console.log('resetToken: ' + resetToken);

    const resetLink = `${env.FRONTEND_URL}/reset-password?token=${encodeURIComponent(resetToken)}`;

    const m = await sendLinkEmail(email, resetLink);

    console.log('resetLink: ' + resetLink);
    console.log('sendpasswordreset email: ' + m);

    return res
      .status(200)
      .json({ message: 'If account exists, reset link sent' });
  } catch (err) {
    console.error(err);

    return res.status(500).json({ message: 'Failed to send reset email' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and password required' });
    }

    const decoded = verifyPasswordResetToken(token);

    if (decoded.purpose !== 'password_reset') {
      return res.status(400).json({ message: 'Invalid token purpose' });
    }

    const userId = decoded.userId;

    const redisUserId = await redisClient.get(`password_reset:${token}`);

    if (!redisUserId || redisUserId !== userId) {
      return res.status(400).json({ message: 'Token is expired or invalid' });
    }

    const userRepo = appDataSource.getRepository(User);

    const user = await userRepo.findOne({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const samePassword = await bcrypt.compare(newPassword, user.passwordHash!);

    if (samePassword) {
      return res.status(400).json({
        message: 'New password cannot be same as old password',
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    if (user.passwordHash === hashedPassword) {
      return res
        .status(400)
        .json({ message: "password can't be same as last 3 passwords" });
    }

    user.passwordHash = hashedPassword;

    await userRepo.save(user);

    await redisClient.del(`password_reset:${token}`);

    return res.status(200).json({ message: 'password reset successfully' });
  } catch (err) {
    console.error(err);

    return res.status(400).json({ message: 'invalid or expired token' });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    console.log('USERID:', userId);
    console.log('REQ.USERID:', req.user?.id, typeof req.user?.id, req.user);
    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    console.log('BODY:', req.body);
    console.log('currentPassword:', currentPassword);
    console.log('newPassword:', newPassword);
    console.log('confirmNewPassword:', confirmNewPassword);

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({
        message: 'All password fields are required',
      });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        message: 'New password and confirm new password do not match',
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters',
      });
    }

    const userRepo = appDataSource.getRepository(User);

    const user = await userRepo.findOne({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    console.log('USER:', user);
    console.log('passwordHash:', user.passwordHash);
    console.log('type:', typeof user.passwordHash);

    const key = `change_password_attempts:${userId}`;

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash!);

    if (!isMatch) {
      const attempts = await redisClient.incr(key);

      // rate limiting
      if (attempts === 1) {
        await redisClient.expire(key, 300);
      }

      if (attempts > 5) {
        return res
          .status(429)
          .json({ message: 'Too many attempts. Try again later.' });
      }

      return res.status(400).json({
        message: 'Current password is incorrect',
      });
    }

    const samePassword = await bcrypt.compare(newPassword, user.passwordHash!);

    if (samePassword) {
      return res.status(400).json({
        message: 'New password cannot be same as old password',
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.passwordHash = hashedPassword;

    await userRepo.save(user);

    const refreshTokenRepo = appDataSource.getRepository(RefreshTokenEntity);

    await refreshTokenRepo.delete({
      user: { id: userId },
    });

    console.log('MATCHED:', isMatch);
    console.log('SAMEPASSWORD:', samePassword);
    console.log('HASHED:', hashedPassword);

    await redisClient.del(key);
    return res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: 'Failed to change password',
    });
  }
};

export const sendEmailVerificationOtp = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const userRepo = appDataSource.getRepository(User);

    const user = await userRepo.findOne({
      where: { id: userId },
    });

    if (!user || !user.email) {
      return res.status(404).json({
        message: 'User not found or email not set',
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        message: 'Email already verified',
      });
    }

    const sendAttemptKey = `email_verify_send_attempt:${userId}`;

    const sendAttempts = await redisClient.incr(sendAttemptKey);

    if (sendAttempts === 1) {
      await redisClient.expire(sendAttemptKey, 30); // 30 sec
    }

    if (sendAttempts > 1) {
      return res.status(429).json({
        message: 'Please wait before requesting another OTP',
      });
    }

    const otpCode = generateotp().toString();

    const hashedOtp = await bcrypt.hash(otpCode, 10);

    const redisKey = `email_verify:${userId}`;

    await redisClient.set(redisKey, hashedOtp, {
      EX: 300,
    });

    const sendOtpEmailResult = await sendOtpEmail(user.email, Number(otpCode));
    console.log('sendOtpEmailResult: ' + sendOtpEmailResult);

    return res.status(200).json({
      success: true,
      message: 'Email verification OTP sent successfully',
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: 'Failed to send email verification OTP',
    });
  }
};

export const verifyEmailOtp = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ message: 'OTP is required' });
    }

    const redisKey = `email_verify:${userId}`;
    const attemptKey = `email_verify_attempts:${userId}`;

    const storedHash = await redisClient.get(redisKey);

    if (!storedHash) {
      return res.status(400).json({ message: 'OTP expired or invalid' });
    }

    const attempts = await redisClient.incr(attemptKey);

    if (attempts === 1) {
      await redisClient.expire(attemptKey, 300); //5 mins
    }

    if (attempts > 5) {
      return res
        .status(429)
        .json({ message: 'Too many attempts. Try again later.' });
    }

    const isValid = await bcrypt.compare(otp.toString(), storedHash);

    if (!isValid) {
      return res.status(400).json({ message: 'OTP expired or invalid' });
    }

    const userRepo = appDataSource.getRepository(User);

    const user = await userRepo.findOne({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    user.isEmailVerified = true;

    await userRepo.save(user);

    await redisClient.del(redisKey);
    await redisClient.del(attemptKey);

    return res.status(200).json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Failed to verify OTP',
    });
  }
};
