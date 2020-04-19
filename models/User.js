const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	isAdmin: {
		type: Boolean,
		default: false,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

UserSchema.pre("save", (next) => {
	if (!this.isModified("password")) {
		return next();
	}
	bcrypt.genSalt(10, (err, salt) => {
		if (err) return next(err);

		bcrypt.hash(this.password, salt, (err, hash) => {
			if (err) return next(err);
			this.password = hash;
			next();
		});
	});
});

UserSchema.methods.comparePassword = function (candidatePassword) {
	return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("user", UserSchema);
module.exports = User;
