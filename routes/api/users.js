const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../models/User");
const passport = require("passport");

const usernotfound = { usernotfound: "User not found" };
const emailnotfound = { emailnotfound: "Email not found" };
const emailexists = { email: "Email already exists" };
const incorrectpassword = { password: "Incorrect password" };

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
	// Form validation
	const { errors, isValid } = validateRegisterInput(req.body);
	//console.log(req);
	// Check validation
	if (!isValid) {
		return res.status(400).json(errors);
	}

	User.findOne({ email: req.body.email }).then((user) => {
		if (user) {
			return res.status(400).json(emailexists);
		} else {
			const newUser = new User({
				name: req.body.name,
				email: req.body.email,
				password: req.body.password,
			});

			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(newUser.password, salt, (err, hash) => {
					if (err) throw err;
					newUser.password = hash;
					newUser
						.save()
						.then((user) => res.json(user))
						.catch((err) => console.log(err));
				});
			});
		}
	});
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
	// Form validation
	const { errors, isValid } = validateLoginInput(req.body);

	// Check validation
	if (!isValid) {
		return res.status(400).json(errors);
	}

	// Find user by email
	User.findOne({ email: req.body.email }).then((user) => {
		// Check if user exists
		if (!user) {
			return res.status(404).json(emailnotfound);
		}

		// Check password
		bcrypt.compare(req.body.password, user.password).then((isMatch) => {
			if (isMatch) {
				// User matched
				// Create JWT payload
				const payload = {
					_id: user.id,
					isAdmin: user.isAdmin,
				};

				// Sign token
				jwt.sign(
					payload,
					keys.secretOrKey,
					{
						expiresIn: 7 * 24 * 60 * 60, // 1 week in seconds
					},
					(err, token) => {
						res.json({
							success: true,
							token: "Bearer " + token,
						});
					}
				);
			} else {
				return res.status(400).json(incorrectpassword);
			}
		});
	});
});

const summaryFields = "_id email name isAdmin";

// @route GET api/users/
// @desc Get all user data
// @access Admin
router.get(
	"/",
	passport.authenticate("admin-strategy", { session: false }),
	(req, res) => {
		User.find({}, summaryFields, { limit: 100 }).then((users) => {
			return res.status(200).json({ users: users });
		});
	}
);

// @route GET api/users/:id
// @desc Get user. Admins can get only users, regular users can only get themselves.
// @access User
// TODO: Test
router.get(
	"/:id",
	passport.authenticate("user-strategy", { session: false }),
	(req, res) => {
		// Can only access own information if not admin.
		if (req.params.id != req.user._id && !req.user.isAdmin) {
			return res.send(401);
		}
		User.findOne({ _id: req.params.id }, summaryFields).then((user) => {
			console.log(user);
			if (!user) {
				return res.status(400).json(usernotfound);
			} else {
				return res.json(user);
			}
		});
	}
);

// @route PUT api/users/:id
// @desc Edit user. Can only edit name and isAdmin.
// @access Admin
// TODO: Test
router.put(
	"/:id",
	passport.authenticate("admin-strategy", { session: false }),
	(req, res) => {
		let update = {};
		if (req.body.name != null) update.name = req.body.name;
		if (req.body.isAdmin != null) update.isAdmin = req.body.isAdmin;

		User.updateOne({ _id: req.params.id }, update).then((query) => {
			if (query.n == 0) {
				return res.status(400).json(usernotfound);
			} else {
				User.findOne({ _id: req.params.id }, summaryFields).then(
					(user) => {
						res.json(user);
					}
				);
			}
		});
	}
);

// @route DELETE api/users/:id
// @desc Delete user.
// @access Admin
// TODO: Test
router.delete(
	"/:id",
	passport.authenticate("admin-strategy", { session: false }),
	(req, res) => {
		User.deleteOne({ _id: req.params.id }).then((query) => {
			console.log(query);
			if (query.n == 0) {
				return res.status(400).json(usernotfound);
			} else {
				res.json({
					success: true,
				});
			}
		});
	}
);
module.exports = router;
