import cors from 'cors'
import dotenv from 'dotenv'
import express from "express"
import morgan from 'morgan'
import { corsConfig } from './config/cors'
import { connectDB } from './config/db'
import { authenticate } from './middleware/auth'
import AuthRoutes from './routes/authRoutes'
import ProjectRoutes from './routes/projectRoutes'


dotenv.config()
connectDB()
const app = express()
app.use(cors(corsConfig))
app.use(express.json())

app.use(morgan('dev'))

app.use('/api/auth', AuthRoutes)
app.use('/api/projects', authenticate ,ProjectRoutes)



export default app