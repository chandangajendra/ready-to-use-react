var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/Users');
var jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
require("dotenv").config({ path: "../config.env" });
const fetchuser = require('../middleware/fetchuser.js');
const { findById } = require('../models/Users');
const JWT_SECRET = process.env.SECRET

//  ROUTE 1 ----    Creatitina A  User 
router.post('/createuser', [
  body('email', "please enter a valid email").isEmail(),
  body('password', "length of pass must greter then 5 ").isLength({ min: 5 }),
  body('name', "length of name must greter then 3 ").isLength({ min: 3 }),
], async (req, res) => {

  console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {

    // findone  user with these email
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ error: "Sorry a user with this email already exists" })
    }

    const salt = await bcrypt.genSaltSync(10);
    const hashedpass = await bcrypt.hashSync(req.body.password, salt);
    //  create a new user
    user = await User.create({
      name: req.body.name,
      password: hashedpass,
      email: req.body.email,
    })
    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    res.json({ authtoken });

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occured")
  }
},
);
//  ROUTE 2 ----   Logging In User 
try {



  router.post('/login', [
    body('email', "please enter a valid email").isEmail(),
    body('password', "length of pass must greter then 5 ").isLength({ min: 5 }),
  ], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ errors: "please try to login with correct creadential" })
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(400).json({ error: "please try to login with correct creadential" });
    }

    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    res.json({ authtoken })

  })
} catch {
  console.error(error.message);
  res.status(500).send("Internal Server Error");
}

// ROUTE 3: Get loggedin User Details using: POST "/api/auth/getuser". Login required

router.post('/getuser', fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

module.exports = router;
