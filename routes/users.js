const express = require("express");
const router = express.Router();
const User = require("../models/user");
const auth = require("../helpers/auth");
const Article = require("../models/article");

// Get User
router.get("/me", auth, async (req, res) => {
  res.status(200).send(req.user);
});

// Create User
router.post("/register", async (req, res) => {
  try {
    const user = User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    await user.save();

    const token = await user.generateJWT();

    res.status(201).json({ token });
  } catch (error) {
    res.status(400).send("Problem in Your Data, Try again :(");
  }
});

// Lofin
router.post("/login", async (req, res) => {
  try {
    const user = await User.findByCraditionals(
      req.body.email,
      req.body.password
    );

    const token = await user.generateJWT();

    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json("Password or Email is Not Correct!");
  }
});

// Logout
router.post("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.status(200).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Logout all
router.post("/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update User
router.patch("/me", auth, async (req, res) => {
  if (req.body.name) {
    req.user.name = req.body.name;
  }

  if (req.body.email) {
    req.user.email = req.body.email;
  }

  if (req.body.password) {
    req.user.password = req.body.password;
  }

  try {
    const updatedUser = await req.user.save();
    const token = await updatedUser.generateJWT();
    const myArticles = await Article.find({ owner: req.user._id });
    for (let art of myArticles) {
      art.ownerName = updatedUser.name;
      await art.save();
    }

    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json("Problem in Your Data, Try again :(");
  }
});

// Delete One
router.delete("/me", auth, async (req, res) => {
  req.user.remove();
  res.status(200).json({ message: "User is  Deleted" });
});

module.exports = router;
