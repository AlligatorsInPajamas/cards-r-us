const express = require('express');
const router = express.Router();

// LoginRouter
const authRouter = require('./auth.js');
//cardsRouter
const cardsRouter = require('./cards.js');
// oauth router
const oauthRouter = require('./oauth/oauth');
// Ai generation router
const aiGeneration = require('./generation/generation');
//google oath router
// auth route
router.use('/auth', authRouter);

//cardsRoute
router.use('/cards', cardsRouter);

//createRoute
router.use('/generate', aiGeneration);

// GitHub oauth
router.use('/oauth', oauthRouter);

//Google Oauth
//router.use('/google/oauth', googleOath);

module.exports = router;
