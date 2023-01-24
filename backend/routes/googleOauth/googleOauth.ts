const express = require('express');
const session = require('express-session');
//create instance of router
import { Request, Response, Router } from 'express';

//import passport
//const passport = require('passport');
import passport from 'passport';
//import passport from 'passport';

//attach routes to router
const router = express.Router();

//googleC config
require('../../controllers/googleOauth/googleC')(passport);

//implement express session
var app = express();
app.set('trust proxy', 1); // trust first proxy
app.use(
  session({
    secret: 'keyboard cat',
    //dont want to save session if nothing is changed
    resave: false,
    saveUninitialized: false,
  })
);
//set passport middleware
router.use(passport.initialize());
router.use(passport.session());

//login
//auth with google
//activate google strategy to authenticate a user and will redirect to google conscent screen

router.get(
  '/login',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

router.get(
  '/callback',
  passport.authenticate('google', {
    failureRedirect: '/api/google/failure',
  }),
  (req: Request, res: Response) => {
    res.redirect('http://localhost:8080/cards');
  }
);

//works
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
