const mongoose = require("mongoose");

const ActorSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
});

module.exports = Actor = mongoose.model("actor", ActorSchema);
