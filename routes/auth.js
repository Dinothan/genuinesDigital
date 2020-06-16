const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers["authorization"];
  // Check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    // Split at the space
    const bearer = bearerHeader.split(" ");
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    console.log(req.headers);
    // Forbidden
    res.sendStatus(403);
  }
}

// router.get("/login", authController.getLogin);

// router.get("/signup", authController.getSignup);

router.post("/login", authController.postLogin);

router.post("/signup", authController.postSignup);

router.post("/logout", verifyToken, authController.postLogout);

module.exports = router;