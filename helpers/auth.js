const User = require("../models/user");
const jwt = require("jsonwebtoken");

async function auth(req, res, next) {
  try {
    if (!req.header("Authorization")) {
      throw new Error("Please add Yoru Token");
    }

    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "thisismyuser");
    const user = await User.findOne({
      _id: decoded._id,
    });

    if (!user) {
      return res.status(404).send("User not Found!");
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).send("User is not Un Authunticate!");
  }
}

module.exports = auth;
