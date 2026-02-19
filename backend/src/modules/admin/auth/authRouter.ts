import express from 'express'
import { adminLogin } from './authcontroller'
const adminRouter = express.Router()
adminRouter.post('/login',adminLogin)
export default adminRouter
