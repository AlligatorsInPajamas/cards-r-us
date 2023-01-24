const express = require('express');
const router = express.Router();
import dotenv from 'dotenv';

// LoginRouter
const authRouter = require('./auth.js');
//cardsRouter
const cardsRouter = require('./cards.js');
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

// auth route
router.use('/auth', authRouter);

//cardsRoute
router.use('/cards', cardsRouter);

//createRoute
router.use('/generate', aiGeneration);

// GitHub oauth
router.use('/oauth', oauthRouter);

//Google Oauth
router.use('/google/', googleOauth);

module.exports = router;
