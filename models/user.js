const mongoose = require("mongoose");
const bycrept = require("bcrypt");
const jwt = require("jsonwebtoken");
const Article = require("./article");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
  },
  password: {
    required: true,
    type: String,
    minLength: [6, "Too few eggs"],
    trim: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bycrept.hash(user.password, 8);
  }

  // if (user.isModified("name")) {
  //   const allArticles = await Article.find({ owner: user._id });
  //   allArticles.map((article) => (article.ownerName = user.name));

  //   await allArticles.save();
  // }

  next();
});

userSchema.pre("remove", async function (next) {
  const user = this;
  await Article.deleteMany({ owner: user._id });
  next();
});

userSchema.methods.toJSON = function () {
  const user = this;
  const objectUser = user.toObject();

  delete objectUser.password;
  delete objectUser.tokens;

  return objectUser;
};

userSchema.methods.generateJWT = async function () {
  const user = this;
  const token = jwt.sign(
    { _id: user["_id"].toString(), name: user.name, email: user.email },
    "thisismyuser",
    {
      expiresIn: "7d",
    }
  );

  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.statics.findByCraditionals = async function (email, password) {
  const user = await User.findOne({ email: email });

  if (!user) {
    throw new Error("unable to login");
  }

  const passwordTest = await bycrept.compare(password, user.password);

  if (!passwordTest) {
    throw new Error("unable to login");
  }

  return user;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
