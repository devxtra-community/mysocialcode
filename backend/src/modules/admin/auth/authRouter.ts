import express from 'express';
import { adminLogin } from './authcontroller';
const adminAuthRouter = express.Router();

adminAuthRouter.post('/login', adminLogin);

export default adminAuthRouter;
