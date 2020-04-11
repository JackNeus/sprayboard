const mongoose = require("mongoose");

const AreaSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	url: {
		type: String,
		required: false,
	},
});

const Area = mongoose.model("area", AreaSchema);
module.exports = Area;
