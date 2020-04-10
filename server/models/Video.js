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

module.exports = Video = mongoose.model("video", VideoSchema);
