import express from 'express'
import passport from 'passport'
import { generateAuthUrl, getAccessToken } from '../server';

const router = express.Router()


// Define routes
router.get('/auth/url', async (req, res) => {
  const url = await generateAuthUrl(req, res);
  res.redirect(url);
});

router.get('/cb', async (req, res) => {
  await getAccessToken(req, res);
});


export { router as authRoutes }
