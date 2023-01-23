//passport authenication file
//require in the .env file
require('dotenv').config();
//require in passport
const passport = require('passport');
import { doesNotMatch } from 'assert';
//import user from models
//import CurrentUser from '../../models/googleUserModel';
const GoogleUser = require('../../models/googleUserModel');
//require in googlestrategy
const GoogleStrategy = require('passport-google-oauth20');

//this gets attached to passport object
passport.use(
  new GoogleStrategy(
    {
      //options for the google strat
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: 'http://localhost:8080/api/google/oauth/redirect',
    },

    //refreshToken: refreshed the access token
    //profile: info that passport comes back with. Profile info
    //done: when done with callback function
    async function (
      accessToken: any,
      refreshToken: any,
      profile: any,
      done: any
    ) {
      //passport callback function
      //check to make sure firing
      console.log('passport callback function fired');
      console.log('profile', profile);

      try {
        const existingUser = await GoogleUser.findOne({
          id: profile.id,
        });
        if (existingUser) {
          return done(null, existingUser);
        }
        const newUser = await new GoogleUser({
          id: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
        }).save();
        done(null, newUser);
      } catch (error) {
        console.log('whoops');
        done(error, null);
      }
    }
  )
);

// used to serialize the user for the session
passport.serializeUser(function (user: any, done: any) {
  done(null, user);
});

// used to deserialize the user
passport.deserializeUser(function (user: any, done: any) {
  done(null, user);
});
