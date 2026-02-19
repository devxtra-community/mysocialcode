import { Request,Response } from "express"
import bcrypt from 'bcrypt'
import { appDataSource } from "../../../data-source";
import { Admin } from "../../../entities/Admin";
import jwt from "jsonwebtoken";
import { logger } from "../../../utils/logger";
const adminRepo = appDataSource.getRepository(Admin)
export const adminLogin = async(req:Request,res:Response)=>{
    try {
        logger.info("reached here at admin login")
    const { email, password } = req.body;

    const admin = await adminRepo.findOne({ where: { email } });

    if (!admin) {
      return res.status(401).json({ message: 'no admin found' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { adminId: admin.id },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: '1d' }
    );

    res.json({ success: true, token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}