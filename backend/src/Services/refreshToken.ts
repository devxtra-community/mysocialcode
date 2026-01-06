import crypto from 'crypto'
export const generateRefreshToken = ():string=>{
    return crypto.randomBytes(64).toString()
}
export const hashRefreshToken = (token:string)=>{
    return crypto.createHash("sha256").update(token).digest("hex")
}