const User = require("../models/User");
const Trip = require("../models/Trip");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const path = require('path');
const passport = require('passport');
const debug = require('debug')("app:auth:local");
const flash = require("connect-flash");
const ensureLogin = require("connect-ensure-login");
const multer = require('multer');
const upload = multer({  dest: './public/uploads/'});

const router = require('express').Router();



router.get("/my-trips", (req, res, next) => {
  res.render("auth/signup");
});

router.get("/my-trips/new", (req, res, next) => {
  res.render("trips/create");
});

router.post("/my-trips/new", upload.single('pic_path'), (req, res, next) => {
  const destination = req.body.destination;
  const description = req.body.description;
  const pic_path = req.body.pic_path;

  if (destination === "" || description === "") {
    res.render("trips/create", { message: "Indicate destination and description" });
    return;
  }

    const newTrip = new Trip({
      destination,
      description,
      pic_path
    })
    .save()
    .then(trip => res.redirect('/'))
    .catch(e => res.render("trips/create", { message: "Something went wrong" }));

});

router.get("/my-trips/edit/:trip_id", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/my-trips/edit/:trip_id", (req, res, next) => {
  res.render("auth/signup");
});

router.get("/my-trips/delete/:trip_id", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/my-trips/delete/:trip_id", (req, res, next) => {
  res.render("auth/signup");
});


module.exports = router;
