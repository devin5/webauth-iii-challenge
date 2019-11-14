const express = require("express").Router();
const bcrypt = require("bcryptjs"); // npm i bcryptjs
const auth = require("./authModel");
const jwt = require('jsonwebtoken');
const requiresAuth = require("../middleware/requires-auth-middleware");
// const auth = require('./scheme-model.js');


function generateToken(user) {
    const payload = {
      username: user.username,
      id: user.id,
    };
    const options = {
      expiresIn: '1d',
    };
    return jwt.sign(payload, process.env.JWT_SECRET || 'lkajsdlkjaskldj', options);
  }

express.post("/register", (req, res) => {
  let userInformation = req.body;

  //   bcrypt.hash(userInformation.password, 12, (err, hashedPasswod) => {
  //     userInformation.password = hashedPasswod;
  const hash = bcrypt.hashSync(userInformation.password, 12);
  userInformation.password = hash;

  auth
    .add(userInformation)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});
// });

express.post("/login", (req, res) => {
  let { username, password } = req.body;

  auth
    .findBy({ username })
    .first()
    .then(user => {
      // check that the password is valid
      if (user && bcrypt.compareSync(password, user.password)) {
          const token = generateToken(user); 
        res.status(200).json({
             message: `Welcome ${user.username}!` ,
             token
            });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch(error => {
      console.log("login error", error);
      res.status(500).json(error);
    });
});

express.get("/", requiresAuth,(req, res) => {
  auth
    .find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

module.exports = express;
