const express = require("express");
const router = express.Router();

// Load input validation
const validateVideoInput = require("../../validation/video");

const Video = require("../../models/Video");
const passport = require("passport");

let videoexists = { video: "Video already exists." };
let videonotfound = { video: "Video does not exist." };

// @route GET api/videos
// @desc Search for videos
// @access Public
router.get("/videos", (req, res) => {
	let filter = {};
	if (req.body.title) filter.title = { $regex: req.body.title };
	if (req.body.people) filter.actors = { $in: req.body.people };
	if (req.body.areas) filter.areas = { $in: req.body.areas };
	if (req.body.routes) filter.routes = { $in: req.body.routes };

	Video.find(filter).then((data) => {
		console.log(data);
		res.json(data);
	});
});

// @route GET api/videos
// @desc Get video by id
// @access Public
router.get("/videos/:id", (req, res) => {
	// TODO: Resolve links
	Video.findOne({ _id: req.params.id }, "-addedBy").then((video) => {
		if (!video) {
			return res.status(400).json(videonotfound);
		} else {
			return res.json(video);
		}
	});
});

// @route POST api/videos
// @desc Add video
// @access Users
router.post(
	"/videos",
	passport.authenticate("user-strategy", { session: false }),
	(req, res) => {
		// Form validation
		const { errors, isValid } = validateVideoInput(req.body);

		// Check validation
		if (!isValid) {
			return res.status(400).json(errors);
		}

		Video.findOne({ title: req.body.title }).then((video) => {
			if (video) {
				return res.status(400).json(videoexists);
			}

			let newVideo = new Video({
				title: req.body.title,
				url: req.body.url,
				addedBy: req.user._id,
			});
			newVideo
				.save()
				.then((user) => {
					res.json(user);
				})
				.catch((err) => {
					console.log(err);
					res.send(500);
				});
		});
	}
);

// @route DELETE api/videos/:id
// @desc Delete video
// @access Users
// TODO: test
router.delete(
	"/videos/:id",
	passport.authenticate("user-strategy", { session: false }),
	(req, res) => {
		let filter = req.params.id;
		// If user is not admin, only let them delete their own videos.
		if (!req.user.isAdmin) {
			filter.addedBy = req.user._id;
		}
		Video.deleteOne(filter).then((resp) => {
			if (resp.deletedCount !== 1) {
				return res.status(400).json(videonotfound);
			} else {
				return res.json({
					success: true,
				});
			}
		});
	}
);

module.exports = router;
