import express, {Request, Response} from 'express'
import session from 'express-session';
import { Client, Issuer, TokenSet, UserinfoResponse } from 'openid-client';

const router = express.Router()

// Create a custom Request type that includes the session
export interface CustomRequest extends Request {
  session: session.Session & Partial<session.SessionData> & {
    tokenSet?: TokenSet;
    userInfo?: UserinfoResponse;
  };
}

async function configureOIDC(): Promise<Client> { 
  const issuer = await Issuer.discover('https://accounts.google.com/.well-known/openid-configuration');
  const client = new issuer.Client({
    client_id: process.env.GOOGLE_CLIENT_ID || '',
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uris: ['http://localhost:3000/auth/callback'],
    response_types: ['code']
  });

  return client;
}

const params = {
  scope: 'openid profile email'
};

router.get('/login', async (req: Request, res: Response) => {
  const client = await configureOIDC();
  res.redirect(client.authorizationUrl(params));
});

router.get('/auth/callback', async (req: CustomRequest, res: Response) => {
  const client = await configureOIDC();
  const tokenSet = await client.callback('http://localhost:3000/auth/callback', req.query as any);
  req.session.tokenSet = tokenSet;
  req.session.userInfo = await client.userinfo(tokenSet.access_token!);
  res.redirect('/');
});

router.get('/', (req: CustomRequest, res: Response) => {
  if (!req.session.userInfo) {
    return res.redirect('/login');
  }
  res.json(req.session.userInfo);
});

router.get('/logout', (req: CustomRequest, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/');
  });
});

export default router