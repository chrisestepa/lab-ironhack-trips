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


const upload = multer({
  dest: './public/uploads/'
});

const router = require('express').Router();
//
// router.get('/', (req, res) => {
//   console.log("(·)(·)", req.user);
//   res.render('index', {
//   user: req.user
// });
// });



router.get("/my-trips", (req, res) => {
  console.log("8======(·)", req.user);

  res.render("trips/trips", {user: req.user});
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/my-trips/new", (req, res, next) => {
  console.log("8======(·)", req.user);
  res.render("trips/create", {user: req.user});
});

router.post("/my-trips/new", upload.single('pic_path'), (req, res, next) => {
  const destination = req.body.destination;
  const description = req.body.description;
  const pic_path = req.body.pic_path;
  const user = req.user;


  if (destination === "" || description === "") {
    res.render("trips/create", {
      message: "Indicate destination and description"
    });
    return;
  }

  console.log("REQ.USER: " + req.user);

  const newTrip = new Trip({
      user_id: req.user._id,
      user_name: req.user.facebook_name,
      destination,
      description,
      pic_path
    })
    .save()
    .then(trip => res.redirect('/'))
    .catch(e => res.render("trips/create", {
      message: "Something went wrong"
    }));

});

router.get("/auth/facebook", passport.authenticate("facebook"));
router.get("/auth/facebook/callback", passport.authenticate("facebook", {
  successRedirect: "/my-trips",
  failureRedirect: "/"
}));


module.exports = router;
