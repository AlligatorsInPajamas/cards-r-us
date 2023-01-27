const express = require('express');
const session = require('express-session');
//create instance of router
import { Request, Response, Router } from 'express';

//import passport
import passport from 'passport';
//import passport from 'passport';

//attach routes to router
const router = express.Router();

//pull in the google auth
const {
  ensureAuth,
  ensureGuest,
} = require('../../controllers/googleOauth/gAuthC');

//router.use(passport.session());

//login
//auth with google
//activate google strategy to authenticate a user and will redirect to google conscent screen

router.get(
  '/login',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

//dashboard route
router.get(
  '/callback',
  passport.authenticate('google', {
    failureRedirect: '/api/google/failure',
  }),
  (req: Request, res: Response) => {
    console.log('YAYAYAYYAY');
    res.redirect('/cards');
  }
);

//works
router.get('/failure', (req: Request, res: Response) => {
  res.send('Failure');
});

//auth logout
router.get('/logout', (req: Request, res: Response) => {
  //handle with passport
  //logout
  req.logout();
  res.redirect('/');
});

//export router
module.exports = router;
