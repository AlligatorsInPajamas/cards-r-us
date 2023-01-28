const GitSession = require('../models/sessionsModel.js');
const User = require('../models/UserModel.js');
const GoogleUsers = require('../models/googleUserModel');
import { NextFunction, Request, Response, Router } from 'express';
import session from 'express-session';
const Session = require('../models/sessionsModel');

const sessionController = {};

/**
 * isLoggedIn - find the appropriate session for this request in the database, then
 * verify whether or not the session is still valid.
 */
sessionController.isLoggedIn = (req, res, next) => {
  console.log('req.cookiessss', req.cookies);

  console.log('yay');
  //for github
  const { SSID } = req.cookies;
  //for google
  const token = req.session.id;
  console.log('token', token);
  console.log('SSID', SSID);
  if (!SSID && !token) {
    return next({
      log: `sessionController.isLoggedIn: No session found.`,
      status: 401,
      message: { err: 'No SSID session found.' },
    });
  }

  if (!SSID) {
    console.log('google route!');
    let user = req.session.passport.user;
    GoogleUsers.findOne({ _id: user }, (err, user) => {
      console.log('Google user find one');
      if (err)
        return next({
          log: `sessionController.isLoggedIn: ${err}`,
          status: 500,
          message: { err: 'An error occurred' },
        });
      console.log('after if');
      console.log('user', user);
      res.locals.user = user;
      console.log('res', res.locals.user);
      return next();
    });
  }
  //github
  else {
    console.log('made it to findOne for git');
    GitSession.findOne({ _id: SSID }, async (err, records) => {
      console.log('records', records);
      if (err)
        return next({
          log: `sessionController.isLoggedIn: ${err}`,
          status: 500,
          message: { err: 'An error occurred' },
        });

      if (records === null || records?.userId === null)
        return next({
          log: `sessionController.isLoggedIn: Records is null`,
          status: 401,
          message: { err: 'No session found.' },
        });

      User.findOne({ _id: records.userId }, (err, user) => {
        console.log('user find one');
        if (err)
          return next({
            log: `sessionController.isLoggedIn: ${err}`,
            status: 500,
            message: { err: 'An error occurred' },
          });
        console.log('after if');
        console.log('user', user);
        res.locals.user = user;
        console.log('res', res.locals.user);
        return next();
      });
    });
  }
  //google
};

/**
 * startSession - create and save a new Session into the database.
 */
sessionController.startSession = (req, res, next) => {
  console.log('startSession??');
  const { SSID } = req.cookies;
  console.log('SSID', SSID);
  // If there is already an SSID cookie, go ahead an authenticate it.
  // if (SSID) return sessionController.isLoggedIn(req, res, next);

  Session.create({ userId: res.locals.user.id }, (err, newSession) => {
    if (err)
      return next({
        log: `sessionController.startSession: ${err}`,
        status: 500,
        message: { err: 'An error occurred' },
      });

    if (newSession === null)
      return next({
        log: `sessionController.isLoggedIn: New session is null`,
        status: 500,
        message: { err: 'An error occured.' },
      });

    res.cookie('SSID', newSession._id, {
      maxAge: 1800000, // 30 mins
      httpOnly: true,
    });
    return next();
  });
};

module.exports = sessionController;
