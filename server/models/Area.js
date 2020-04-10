// models/Area.js

const mongoose = require('mongoose')

const AreaSchema = new mongoose.Schema({

	name: {
		type: String,
		required: true
	},
	url: {
		type: String,
		required: false
	},
});

module.exports = Area = mongoose.model('area', AreaSchema)