import express from 'express'
import { PrismaClient } from '@prisma/client'
import { authRoutes } from './routes/auth'
import dotenv from 'dotenv'
import { userRoutes } from './routes/users'
import { Issuer, generators } from 'openid-client';

dotenv.config()

const app = express()
const prisma = new PrismaClient()
const PORT = process.env.PORT || 3001

const code_verifier = generators.codeVerifier();

const initAuthClient = async () => {
  const googleIssuer = await Issuer.discover('https://accounts.google.com');
  console.log('Discovered issuer %s %O', googleIssuer.issuer, googleIssuer.metadata);

  return await new googleIssuer.Client({
    client_id: process.env.GOOGLE_CLIENT_ID || '',
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uris: ['http://localhost:3000/cb'],
    response_types: ['code'],
    // id_token_signed_response_alg (default "RS256")
    // token_endpoint_auth_method (default "client_secret_basic")
  }); 
}

export const generateAuthUrl = async(req: any, res: any) => {
  // store the code_verifier in your framework's session mechanism, if it is a cookie based solution
  // it should be httpOnly (not readable by javascript) and encrypted.
  
  const code_challenge = generators.codeChallenge(code_verifier);
  
  const client = await initAuthClient();
  
  return  client.authorizationUrl({
    scope: 'openid email profile',
    // resource: 'https://my.api.example.com/resource/32178',
    code_challenge,
    code_challenge_method: 'S256',
  });
}

export const getAccessToken = async (req: any, res: any) => {
  const client = await initAuthClient();

  const params = client.callbackParams(req);
  const tokenSet = await client.callback('http://localhost:3000/cb', params, { code_verifier });

  console.log('received and validated tokens %j', tokenSet);
  console.log('validated ID Token claims %j', tokenSet.claims());
}

// Middleware
app.use(express.json())

// Routes
app.use('/', authRoutes)
// app.use('/api', userRoutes)

app.get('/', (req, res) => {
    res.send('Welcome to the Auth Demo')
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
