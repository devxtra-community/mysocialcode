import express from 'express'
import PinoHttp, { pinoHttp } from 'pino-http'
import { logger } from './utils/logger'
import { notFound } from './middleware/notFound'
import { errorHandler } from './middleware/errorHandler'
import Healthrouter from './routes/health'
import pino from 'pino'
const app = express()
app.use(express.json())
app.use(
    pinoHttp({
        logger,
        autoLogging:{
            ignore:(req)=>req.url==='health'
        }
    })
)
app.use('/health',Healthrouter)
app.use(notFound)
app.use(errorHandler)
export default app;