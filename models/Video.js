const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	url: {
		type: String,
		required: true,
	},
	addedBy: {
		type: mongoose.Schema.ObjectId,
		ref: "User",
		required: true,
	},
	actors: [
		{
			type: mongoose.Schema.ObjectId,
			ref: "Person",
		},
	],
	areas: [
		{
			type: mongoose.Schema.ObjectId,
			ref: "Area",
		},
	],
	routes: [
		{
			type: mongoose.Schema.ObjectId,
			ref: "Route",
		},
	],
});

const Video = mongoose.model("video", VideoSchema);
module.exports = Video;
