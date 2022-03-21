// Imports
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const articlesRouter = require("./routes/articles");
const usersRouter = require("./routes/users");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();

// Allow Cors
var whitelist = ["http://localhost:3000"];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || whitelist.indexOf(origin) !== 1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
app.use(cors(corsOptions));

// Connect to Database
mongoose
  .connect(
    process.env.MONGODB_CONNECTION_STRING ||
      "mongodb+srv://mohamed:95123574@cluster0.1bxam.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    // "mongodb://localhost/blog",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("connected to database succefully"))
  .catch((error) => console.log(error));

// Handle Boody Parse
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

// App Routes
app.use("/api/users", usersRouter);
app.use("/api/articles", articlesRouter);

// Lesten to Server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listeining to port ${port}`));
