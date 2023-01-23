const express = require('express');
//create instance of router
import { Request, Response, Router } from 'express';

//import passport
const passport = require('passport');

//attach routes to router
const router = express.Router();

//login
//auth with google
//activate google strategy to authenticate a user and will redirect to google conscent screen

// router.get(
//   '/login',
//   // passport.authenticate('google', { scope: ['email', 'profile'] })
//   res.send('YAY')
// );

router.get('/login', (req: Request, res: Response) => {
  res.send('Youre in');
});

//callback route for google to redirect to
//authenticating again because this time we have a code in the url
//and will take the code and exchange the code for user info
//comes back to user info and goes to googleC and passport callback function will fire
//exchange code for profile info
router.get(
  '/redirect',
  passport.authenticate('google', {
    failureRedirect: '/auth/google/failure',
  }),
  (req: Request, res: Response) => {
    res.redirect('/');
  }
);

router.get('/failure', (req: Request, res: Response) => {
  res.send('Failure');
});

//auth logout
router.get('/glogout', (req: Request, res: Response) => {
  //handle with passport
  req.logout((err: any) => {
    return res.status(500).send(err);
  });
  res.status(200).send('logging out');
});

//export router
module.exports = router;
