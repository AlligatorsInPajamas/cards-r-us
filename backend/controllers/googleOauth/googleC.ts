//passport authenication file
//require in the .env file
require('dotenv').config();
//require in passport
const mongoose = require('mongoose');
//import googleuser model
const GoogleUsers = require('../../models/googleUserModel');
//require in googlestrategy

const GoogleStrategy = require('passport-google-oauth20').Strategy;

module.exports = function (passport: any) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/api/google/callback',
        passReqToCallback: true,
      },
      async (
        request: any,
        accessToken: any,
        refreshToken: any,
        profile: any,
        done: any
      ) => {
        console.log('profile', profile);
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          username: profile.name.givenName,
          avatar: profile.photos[0].value,
          gallery: [],
        };
        try {
          let gUser = await GoogleUsers.findOne({ googleId: profile.id });
          if (gUser) {
            done(null, gUser);
          } else {
            gUser = await GoogleUsers.create(newUser);
            done(null, gUser);
          }
        } catch (err) {
          console.error(err);
        }
      }
    )
  );

  // // used to serialize the user for the session
  //determines which data of the user object should be stored in the session
  //req.session.passport.user = {id: '..'}
  passport.serializeUser(function (user: any, done: any) {
    done(null, user.id);
  });

  // used to deserialize the user
  //The user id (you provide as the second argument of the done function)
  //is saved in the session and is later used to retrieve the whole object
  // via the deserializeUser function.
  passport.deserializeUser(function (user: any, done: any) {
    done(null, user);
  });
};
