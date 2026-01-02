import { Request, Response, NextFunction } from 'express';
import { logger } from '../../utils/logger';
import { emailSchema } from './auth.schema';
import { sendOtpEmail } from '../../Services/email.service';
import { generateotp } from '../../utils/otp';
import { appDataSouce } from '../../data-source';
import { Otp } from '../../entities/opt';
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
        .json({ message: 'validation vailed', error: result.error?.format() });}
        const otpRep = appDataSouce.getRepository(Otp)
      const otpcode = generateotp()
      logger.debug({otpcode},"otp is")
      const email = result.data?.email;
      await sendOtpEmail(email.toString(),otpcode.toString())
      await otpRep.delete({email})
      await otpRep.save({
        email,
        otp:otpcode.toString(),
        expiresAt: new Date(Date.now()+5*60*1000)

      })
    res.status(200).json({ message: "otp sent success fully ",success:true });
  } catch (err) {
    logger.error('error in register');
    next(err);
  }
};
