const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const {jwtVerify} = require("./security/jwt.security");
const cors = require('cors');
const {resolve} = require("node:path");

require('dotenv').config({ path: resolve(__dirname, '.env') });

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
  origin: '*',
  methods: 'GET',
  credentials: true, // Needed if cookies or Authorization headers are used
}));

app.use('/images', jwtVerify, express.static(process.env.IMAGES_FOLDER_PATH,{
  index: false,        // Don't serve index.html files by default
  dotfiles: 'deny',    // Block hidden files (e.g., .env, .htaccess)
  maxAge: '1d'         // Browser cache for 1 day
}));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
