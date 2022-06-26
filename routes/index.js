const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const hospital = require("../models/hospital.js");
const patient = require("../models/patient.js");
const Doctor = require("../models/doctor.js");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const mongoose = require("mongoose");

const { findById, db } = require("../models/hospital.js");

router.use(cookieParser("secret"));
router.use(
  session({
    secret: "secret",
    maxAge: 3600000,
    resave: true,
    saveUninitialized: true,
  })
);
router.use(passport.initialize());
router.use(passport.session());

router.use(flash());
router.use(function (req, res, next) {
  res.locals.success_message = req.flash("success_message");
  res.locals.error_message = req.flash("error_message");
  res.locals.error = req.flash("error");
  next();
});

const ensureAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    res.set(
      "Cache-Control",
      "no-cache,private,no-store,must-revalidate,post-check=0,pre-check=0"
    );
    return next();
  } else res.redirect("/hospitalLogin");
};

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.use(express.json());
router.use(express.urlencoded());

router.get("/",(req,res)=>{
  res.render("landingPage");
});

router.get("/hospitalRegister", (req, res) => {
  res.render("hospitalRegister");
});

router.post("/hospitalRegister", (req, res) => {
  let { name, email, address,city,state,pin, password, confirmPassword } = req.body;
  if (!name || !email || !password || !confirmPassword || !address || !city || !state || !pin) {
    err = "Please fill all the fields";
    res.render("hospitalRegister", { err: err });
  }
  if (password != confirmPassword) {
    err = "Passwords dont match";
    res.render("hospitalRegister", {
      err: err,
      email: email,
      name: name,
      password: password,
      address:address,
      city:city,
      state:state,
      pin:pin
    });
  }
  if (typeof err == "undefined") {
    hospital.findOne({ email: email }, function (err, data) {
      if (err) throw err;
      if (data) {
        err = "Hospital already registered";
        res.render("hospitalRegister", { name: name, err: err });
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          if (err) throw err;
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;
            password = hash;
            hospital({
              name,
              email,
              password,
              address,
              city,
              state,
              pin
            }).save((err, data) => {
              if (err) throw err;
              req.flash("success_message", "Please Login to Continue");
              res.redirect("/hospitallogin");
            });
          });
        });
      }
    });
  }
});

var localStrategy = require("passport-local").Strategy;
passport.use(
  "hospital",
  new localStrategy({ usernameField: "email" }, (email, password, done) => {
    hospital.findOne({ email: email }, (err, data) => {
      if (err) throw err;
      if (!data) {
        return done(null, false, { message: "Hospital Not Registered" });
      }
      bcrypt.compare(password, data.password, (err, match) => {
        if (err) return done(null, false);
        if (!match)
          return done(null, false, { message: "Password is Incorrect" });
        if (match) return done(null, data);
      });
    });
  })
);


/*=======Patient Login=======*/

router.get("/patientRegister", (req, res) => {
  res.render("patientRegister");
});

router.post("/patientRegister", (req, res) => {
  let { name, email, address,city,state,pin, password, confirmPassword } = req.body;
  if (!name || !email || !password || !confirmPassword || !address || !city || !state || !pin) {
    err = "Please fill all the fields";
    res.render("patientRegister", { err: err });
  }
  if (password != confirmPassword) {
    err = "Passwords dont match";
    res.render("patientRegister", {
      err: err,
      email: email,
      name: name,
      password: password,
      address:address,
      city:city,
      state:state,
      pin:pin
    });
  }
  if (typeof err == "undefined") {
    patient.findOne({ email: email }, function (err, data) {
      if (err) throw err;
      if (data) {
        err = "Patient already registered";
        res.render("patientRegister", { name: name, err: err });
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          if (err) throw err;
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;
            password = hash;
            patient({
              name,
              email,
              password,
              address,
              city,
              state,
              pin
            }).save((err, data) => {
              if (err) throw err;
              req.flash("success_message", "Please Login to Continue");
              console.log(data);
              res.redirect("/patientlogin");
            });
          });
        });
      }
    });
  }
});

var localStrategy = require("passport-local").Strategy;
passport.use(
  "patient",
  new localStrategy({ usernameField: "email" }, (email, password, done) => {
    patient.findOne({ email: email }, (err, data) => {
      if (err) throw err;
      if (!data) {
        return done(null, false, { message: "Patient Not Registered" });
      }
      bcrypt.compare(password, data.password, (err, match) => {
        if (err) return done(null, false);
        if (!match)
          return done(null, false, { message: "Password is Incorrect" });
        if (match) return done(null, data);
      });
    });
  })
);

router.get("/patientlogin", (req, res) => {
  res.render("patientLogin");
});

router.post("/patientLogin", (req, res, next) => {
  passport.authenticate("patient", {
    failureRedirect: "/patientLogin",
    successRedirect: "/patientDashboard",
    failureFlash: true,
  })(req, res, next);
});

router.get("/patientDashboard", (req, res) => {
  console.log(req.user.city + " got")
  // db.collection("hospitals").find({city:new RegExp(req.user.city,"i")}).toArray(function(err,data){


  //   console.log(data);
  //   res.render("patientDashboard",{hospitals:data});
  // })
  hospital.find({city:req.user.city}).populate({path:"doctors",model:Doctor}).exec(function(err,data){
    if(err)res.send(err);
    else{
      console.log(data);
      res.send(data);
      // res.render("patientDashboard",{hospitals:data});
    }
  })
 
});


/*=======Patient Login End=========*/

passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
  hospital.findById(id, function (err, user) {
    if (err) cb(err);
    if (user) cb(null, user);
    else{
        patient.findById(id, function(err,user){
            if(err) cb(err);
            cb(null,user);
        })
    }
  });
});

router.get("/c",(req,res)=>{
  res.send("Success");
})

router.get("/hospitallogin", (req, res) => {
  res.render("hospitalLogin");
});

router.post("/hospitalLogin", (req, res, next) => {
  passport.authenticate("hospital", {
    failureRedirect: "/hospitalLogin",
    successRedirect: "/hospitalDashboard",
    failureFlash: true,
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/hospitalLogin");
});

router.get("/hospitalDashboard", ensureAuthenticated, (req, res) => {
  // doctors.find({}.populate, (err,data)=>{
  //     res.render('hospitalDashboard', {doctor: data});
  // })
  hospital
    .findOne({ _id: req.user._id })
    .populate({ path: "doctors", model: Doctor })
    .exec(function (err, data) {
      if (err) throw err;
      else {
        console.log(data.doctors);
        res.render("hospitalDashboard", { user: data });
      }
    });

  // hospital.findOne({_id:req.user._id}).populate({path:"doctors",model:Doctor}).then(user => {
  //     res.json(user);
  //  });

  // let hospital_id = req.user._id;
  // res.render('hospitalDashboard', {user:req.user});
  // console.log(req.user);
});

router.get("/get", ensureAuthenticated, (req, res) => {
  hospital
    .findOne({ _id: req.user._id })
    .populate({ path: "doctors", model: Doctor })
    .exec(function (err, data) {
      if (err) throw err;
      else {
        console.log(data.doctors);
        res.send(data);
      }
    });
});

router.get("/doctor/add/:id", ensureAuthenticated, (req, res) => {
  res.render("addDoctor", { user: req.user });
});

router.post("/add/:id", ensureAuthenticated, async (req, res) => {
  const reg = req.body.registration;
  const name = req.body.name;
  const spec = req.body.specialization;
  const patient_no = req.body.max_patient_no;
  console.log(req.body);

  hospital.findById(req.params.id, (err, hospital) => {
    if (err) throw err;
    else {
      Doctor.create(
        {
          registration: reg,
          name: name,
          specialization: spec,
          Max_no_of_patient: patient_no,
        },
        (err, data) => {
          if (err) throw err;
          else {
            console.log(data);
            hospital.doctors.push(data);
            hospital.save();
          }
          // if(data){
          //     err ='Doctor already registered';
          //     res.render('addDoctor');
          // }
        }
      );
    }
  });

  // hos.doctors.push(doc._id);
  res.redirect("/hospitalDashboard");
});

router.post("/a", function (req, res) {
  res.send(req.body);
});
module.exports = router;
