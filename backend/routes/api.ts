const express = require('express');
const router = express.Router();
import dotenv from 'dotenv';

import { NextFunction, Request, Response } from 'express';

// LoginRouter
const authRouter = require('./auth.js');
//cardsRouter
const cardsRouter = require('./cards');
// github oauth router
const oauthRouter = require('./oauth/oauth');
//google oauth router

const googleOauth = require('./googleOauth/googleOauth');
// Ai generation router
const aiGeneration = require('./generation/generation');

//require in the googleOath route to get passport to run
// const passportSetUp = require('../controllers/googleOauth/googleC');

import '../controllers/googleOauth/googleC';

dotenv.config();

import passport from 'passport';
const session = require('express-session');

//pull in the google auth
const {
  ensureAuth,
  ensureGuest,
} = require('../controllers/googleOauth/gAuthC');

// router.set('trust proxy', 1); // trust first proxy
// router.use(
//   session({
//     secret: 'keyboard cat',
//     //dont want to save session if nothing is changed
//     resave: false,
//     saveUninitialized: false,
//   })
// );
// //set passport middleware
// router.use(passport.initialize());
// router.use(passport.session());

// auth route
router.use('/auth', authRouter);

//cardsRoute
//router.use('/cards', cardsRouter);

router.get('/cards', (req: Request, res: Response) => {
  res.render('cards', {
    name: req.user.firstName,
  });
});
//createRoute
router.use('/generate', aiGeneration);

// GitHub oauth
router.use('/oauth', oauthRouter);

//Google Oauth
router.use('/google', googleOauth);

module.exports = router;
