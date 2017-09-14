const express = require("express");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const flash = require("connect-flash");
const MongoStore = require("connect-mongo")(session);
const {dbURL} = require('./config/db');
const multer = require('multer');
const passport = require('passport');

const authRoutes = require('./routes/auth');


mongoose.connect(dbURL, {
    useMongoClient: true
  })
  .then(() => console.log('Conectado al a BBDD'));

// Middlewares configuration
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// View engine configuration
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layout");
app.use(express.static(path.join(__dirname, "public")));

app.use(passport.initialize());
app.use(passport.session());

require('./passport/serializers');
require('./passport/local');
require('./passport/facebook');

// Authentication

app.use(session({
  secret: "ironhack-trips",
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  })
}));

// Routes
app.use('/', authRoutes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
