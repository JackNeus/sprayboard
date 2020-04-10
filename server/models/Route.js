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

module.exports = Route = mongoose.model("route", RouteSchema);
