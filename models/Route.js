const mongoose = require("mongoose");

const RouteSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	url: {
		type: String,
	},
	area: {
		type: mongoose.Schema.ObjectId,
		ref: "Location",
	},
});

const Route = mongoose.model("route", RouteSchema);
module.exports = Route;
