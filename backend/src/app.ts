import express from 'express'
import { logger } from './middleware/logger'
import { notFound } from './middleware/notFound'
import { errorHandler } from './middleware/errorHandler'
const app = express()
app.use(express.json())
app.use(logger)
app.get('/health',(req,res)=>{
    res.json({status:"ok"})
})
app.use(notFound)
app.use(errorHandler)
export default app;