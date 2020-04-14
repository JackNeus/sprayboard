const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateVideoInput(data) {
	let errors = {};

	// Convert empty fields to an empty string so we can use validator functions
	data.title = !isEmpty(data.title) ? data.title : "";
	data.url = !isEmpty(data.url) ? data.url : "";

	// Title checks
	if (Validator.isEmpty(data.title)) {
		errors.title = "Title field is required";
	}

	// Url checks
	if (Validator.isEmpty(data.url)) {
		errors.url = "Url field is required";
	} else if (!Validator.isURL(data.url)) {
		errors.url = "Url field is invalid";
	}

	// TODO: Other checks

	return {
		errors,
		isValid: isEmpty(errors),
	};
};
