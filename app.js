const express = require("express");
const app = express();
const router = express.Router();
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
var methodOverride = require("method-override");
dotenv.config();

mongoose
  .connect("mongodb://localhost:27017/GFG", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected...");
  });

const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname));

app.use(function (req, res, next) {
  res.locals.user = req.user;
  next();
});

app.use(express.json());
app.use(express.urlencoded());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(methodOverride("_method"));

app.use("/", require("./routes/index"));
// app.use('/doctor', require('./routes/doctor'));

app.listen(port, () => {
  console.log("You are listening on port 3000");
});
