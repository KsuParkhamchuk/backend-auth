import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import { TokenSet, UserinfoResponse } from 'openid-client';
import dotenv from 'dotenv'
import { CustomRequest } from './routes/auth';
import authRouter from './routes/auth';

dotenv.config();

// Extend express-session types
declare module 'express-session' {
  interface SessionData {
    tokenSet?: TokenSet;
    userInfo?: UserinfoResponse;
  }
}

const app = express();

app.use(session({
  secret: process.env.SESSION_SECRET || '',
  resave: false,
  saveUninitialized: true
}));

function ensureAuthenticated(req: CustomRequest, res: Response, next: NextFunction) {
  if (req.session.userInfo) {
    return next();
  }
  res.redirect('/login');
}

app.get('/protected', ensureAuthenticated, (req: Request, res: Response) => {
  res.send('This is a protected route');
});

async function startServer() {
  app.use('/', authRouter);

  app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
  });
}

startServer().catch(console.error);