import { PrismaClient } from '@prisma/client';
import express from 'express';

const router = express.Router();
const prisma = new PrismaClient();

/* GET users listing. */
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({message: 'Internal server error'})
  }
  
});

export {router as userRoutes};
