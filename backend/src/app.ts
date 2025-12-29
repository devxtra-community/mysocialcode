import express from 'express'
import { logger } from './middleware/logger'
import { notFound } from './middleware/notFound'
const app = express()
app.use(express.json())
app.use(logger)
app.get('/health',(req,res)=>{
    res.json({status:"ok"})
})
app.use(notFound)
export default app;