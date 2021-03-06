const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const User = require("../models/user");
const Session = require("../models/sessions");
const jwt = require("jsonwebtoken");
const API_KEY = require("../apikey");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: API_KEY,
    },
  })
);

// exports.getLogin = (req, res, next) => {
//   let message = req.flash("error");

//   if (message.length > 0) {
//     message = message[0];
//   } else {
//     message = null;
//   }
//   res.send(req);
//   // res.render("auth/login", {
//   //   path: "/login",
//   //   pageTitle: "Login",
//   //   isAuthenticated: false,
//   //   errorMessage: message
//   // });
// };

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  //send user info
  //   jwt.verify(req.token, "secretkey", (err, authData) => {
  //     if (err) {
  //       res.sendStatus(403);
  //     } else {
  //       res.json({
  //         message: "Post created...",
  //         authData
  //       });
  //     }
  //   });
  // //send jwt
  //   jwt.sign({user}, 'secretkey', { expiresIn: '30s' }, (err, token) => {
  //     res.json({
  //       token
  //     });
  //   });
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        // req.flash("error", "Invalid email or password.");
        return res.redirect("/login");
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            console.log("loddddddddd");
            jwt.sign(
              { user },
              "secretkey",
              // { expiresIn: "30s" },
              (err, token) => {
                res.json({
                  token,
                });
                // req.session.isLoggedIn = true;
                req.session.user = user;
                req.session.token = token;
                return req.session.save((err) => {
                  console.log("err sess:", err);
                });
              }
            );

            // console.log(err);
            // res.send(req.session.user);
            // jwt.sign(
            //   { user },
            //   "secretkey",
            //   // { expiresIn: "30s" },
            //   (err, token) => {
            //     res.json({
            //       token
            //     });
            //   }
            // );
            // });
          }
          // req.flash("error", "Invalid email or password.");
          // res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};

exports.getSignup = (req, res, next) => {
  // let message = req.flash("error");
  // if (message.length > 0) {
  //   message = message[0];
  // } else {
  //   message = null;
  // }
  // res.render("auth/signup", {
  //   path: "/signup",
  //   pageTitle: "Signup",
  //   isAuthenticated: false,
  //   errorMessage: message
  // });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  // const confirmPassword = req.body.confirmPassword;

  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        // req.flash(
        //   "error",
        //   "E-Mail exists already, please pick a different one."
        // );
        return res.send("User already exist");
        // return res.redirect("/signup");
      }
      return bcrypt
        .hash(password, 12)
        .then((hashPassword) => {
          const user = new User({
            email: email,
            password: hashPassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then((result) => {
          console.log("result :", result);
          return res.send("successfully created");
          // res.redirect("/login");
          // return transporter.sendMail({
          //   to: email,
          //   from: "dinothan1@gmail.com",
          //   subject: "Signup succeeded!",
          //   html: "<h1>You successfully signed up!</h1>"
          // });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  // req.session.destroy(err => {
  //   console.log("destroy :",err);
  //   req.token = null;
  //   res.send();
  //   // res.redirect('/');
  // });
  // req.session.destroy(err => {
  //   if (err) {
  //     console.log("err :", err);
  //   } else {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    // if (err) {
    //   res.sendStatus(403);
    // } else {
    let token = req.token;
    Session.deleteOne({ "session.token": token })
      .then((response) => {
        req.token = null;
        res.send();
        // if(res.session.token === token){
        // res.session.destory()
        console.log("res.session :", response);
        // }else{
        // console.log("no session")
        // }
      })
      .catch((err) => console.log("err :", err));
    // req.session.destroy();
    // req.token = null;
    // res.send();
    // }
  });
  // }

  // res.redirect("/");
  // });
};
