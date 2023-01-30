const express = require('express');
const session = require('express-session');
//create instance of router
import { Request, Response, Router, NextFunction } from 'express';

module.exports = {
  //ensure auth
  ensureAuth: function (req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect('/cards');
    }
  },
  //ensure Guest
  ensureGuest: function (req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
      //back to dashboard
      res.redirect('/cards');
    } else {
      return next();
    }
  },
};
