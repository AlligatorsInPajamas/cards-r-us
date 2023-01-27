const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
//require in specific keys
require('dotenv').config();
const { DB_URI } = process.env;
const { COOKIE_KEY } = process.env;
import { NextFunction, Request, Response } from 'express';
const session = require('express-session');
import passport from 'passport';
const MongoStore = require('connect-mongo')(session);
const cookieSession = require('cookie-session');
const Gcards = require('./routes/Gcards');

const PORT = 3000;

// api router
const apiRouter = require('./routes/api');

//googleC config
require('./controllers/googleOauth/googleC')(passport);

//implement express session
const app = express();
app.use(cookieParser());
app.set('trust proxy', 1); // trust first proxy
app.use(
  session({
    secret: 'keyboard cat',
    //store: cardStorage,
    //dont want to save session if nothing is changed
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 360000,
      secure: false, // this should be true only when you don't want to show it for security reason
    },
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

//set passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use('/', express.static(path.resolve('./dist')));

// app.use(passport.initialize());
// app.use(passport.session());

mongoose.set('strictQuery', false);

//connect to mongoose
mongoose
  .connect(DB_URI)
  .then(() => {
    console.log('Connected to DB ✅');
    app.listen(PORT, console.log(`Listening at http://localhost:${PORT}/ ✅`));
  })
  .catch(console.error);

// Main page
app.get('/', (req: Request, res: Response) => {
  res.status(200).sendFile(path.resolve('./dist/index.html'));
});

// All api routes
app.use('/api', apiRouter);

// app.get('/auth/google/callback', (req: Request, res: Response) => {
//   console.log('in');
//   res.render('you got in');
// });

// 404 redirect to index.html for react router
app.use((req: Request, res: Response) =>
  res.status(200).sendFile(path.resolve('./dist/index.html'))
);

// Express error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: `Express global error handler caught unhandled middleware error: ${err}`,
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});
