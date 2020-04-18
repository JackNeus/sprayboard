const express = require("express");
const connectDB = require("./config/db");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");

const users = require("./routes/api/users");
const library = require("./routes/api/library");

const app = express();

app.use(cors());

// Bodyparser middleware
app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: false,
	})
);

// Connect Database
connectDB();

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);

// Routes
app.use("/api/users", users);
app.use("/api", library);
app.get("/", (req, res) => res.send("Hello world!"));

module.exports = app;
