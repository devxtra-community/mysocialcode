import Twilio from 'twilio'
import { logger } from '../utils/logger';
const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const fromNumber = process.env.TWILIO_FROM_NUMBER!;
const client = Twilio(accountSid,authToken)
export const sendOtpSms = async(phoneNumber:string,otp:string)=>{
    try{
        await client.messages.create({
            body:`otp is ${otp}`,
            from:fromNumber,
            to:phoneNumber
        })

    }catch(err){
        logger.error({err},"failed to send otp")
        throw new Error('failed to send')
    }
}