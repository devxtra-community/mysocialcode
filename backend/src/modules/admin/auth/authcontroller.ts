import { Request, Response } from 'express';
import { appDataSource } from '../../../data-source';
// import { User, UserRole } from '../../../entities/User';
import { logger } from '../../../utils/logger';
import { signAccessToken } from '../../../Services/jwt.service';
import { Admin } from '../../../entities/Admin';


const adminRepo = appDataSource.getRepository(Admin);

export const adminLogin = async (req: Request, res: Response) => {
  try {
    logger.info('reached here at admin login');

    const { email, password } = req.body;
console.log('admin login attempt with email:', email);
console.log('admin login attempt with password:', password);
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const admin = await adminRepo.findOne({ where: { email } });
console.log('admin found:', admin);
    if (!admin) {
      return res.status(401).json({ message: 'no admin found' });
    }

    // const isMatch = await bcrypt.compare(password, admin.passwordHash);
console.log('password match result:', password === admin.passwordHash);
    if (password !== admin.passwordHash) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signAccessToken(
      { id: admin.id, type: 'ADMIN' },
    );
console.log('generated token:', token);
    res.status(200).json({ success: true, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// const adminRepo = appDataSource.getRepository(User);

// export const adminLogin = async (req: Request, res: Response) => {
//   try {
//     logger.info('reached here at admin login');

//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: 'Email and password required' });
//     }

//     const admin = await adminRepo.findOne({ where: { email, role: UserRole.ADMIN } });

//     if (!admin) {
//       return res.status(401).json({ message: 'no admin found' });
//     }

//     const isMatch = await bcrypt.compare(password, admin.passwordHash);

//     if (!isMatch) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const token = signAccessToken(
//       { userId: admin.id, role: admin.role as UserRole.ADMIN },
//     );

//     res.status(200).json({ success: true, token });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// export const adminRegister = async (req: Request, res: Response) => {
//   try {
//     const { name, email, password } = req.body;

//     if (!name || !email || !password) {
//       return res.status(400).json({ message: 'Name, email and password required' });
//     }

//     const existingAdmin = await adminRepo.findOne({ where: { email, role: UserRole.ADMIN } });

//     if (existingAdmin) {
//       return res.status(400).json({ message: 'Admin with this email already exists' });
//     }

//     const passwordHash = await bcrypt.hash(password, 10);

//     const newAdmin = adminRepo.create({
//       name,
//       email,
//       passwordHash,
//       role: UserRole.ADMIN,
//     });

//     await adminRepo.save(newAdmin);

//     res.status(201).json({ success: true, message: 'Admin registered successfully' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Internal server error' }); 
//   }
// };