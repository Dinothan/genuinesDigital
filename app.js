const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
// const csrf = require('csurf');
const cors = require("cors");
// const flash = require("connect-flash");

const errorController = require("./controllers/error");
const User = require("./models/user");
const MONGODB_URI = require("./mongoUrl");

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});
// const csrfProtection = csrf();

app.set("view engine", "ejs");
app.set("views", "views");
app.use(cors());
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
// app.use(csrfProtection);
// app.use(flash());

app.use((req, res, next) => {
  console.log("req :",req)
  if (!req.session.user) {
    console.log("user no :")
    return next();
  }
  console.log("user1 :",req.session.user)
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      console.log("user :",user)
      next();
    })
    .catch((err) => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  // res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(9000);
  })
  .catch((err) => {
    console.log(err);
  });
