const mongoose = require("mongoose");

const ActorSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
});

const Actor = mongoose.model("actor", ActorSchema);
module.exports = Actor;
