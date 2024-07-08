import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import { TokenSet, UserinfoResponse } from 'openid-client';
import dotenv from 'dotenv'
import { CustomRequest } from './routes/auth';
import authRouter from './routes/auth';
import cors from 'cors'

dotenv.config();

declare module 'express-session' {
  interface SessionData {
    tokenSet?: TokenSet;
    userInfo?: UserinfoResponse;
  }
}

const app = express();

app.use(cors({
  origin: 'http://localhost:8000',
  credentials: true
}))

app.use(session({
  secret: process.env.SESSION_SECRET || '',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' 
  }
}));

app.use('/', authRouter);

async function startServer() {
  app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
  });
}

startServer().catch(console.error);