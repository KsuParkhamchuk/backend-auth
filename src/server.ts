import express from 'express'
import { PrismaClient } from '@prisma/client'
import { authRoutes } from './routes/auth'
import dotenv from 'dotenv'
import { userRoutes } from './routes/users'

dotenv.config()

const app = express()
const prisma = new PrismaClient()
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api', userRoutes)

app.get('/', (req, res) => {
    res.send('Welcome to the Auth Demo')
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
