const mongoose = require("mongoose");

async function removeAllCollections() {
	const collections = Object.keys(mongoose.connection.collections);
	for (const collectionName of collections) {
		await mongoose.connection.collections[collectionName].deleteMany();
	}
}

async function dropAllCollections() {
	const collections = Object.keys(mongoose.connection.collections);
	for (const collectionName of collections) {
		try {
			await mongoose.connection.collections[collectionName].drop();
		} catch (error) {
			// This error happens when you attempt to drop a collection
			// that's already been dropped. Safe to ignore.
			if (error.message === "ns not found") return;

			// This error happens when you use it.todo.
			// Safe to ignore.
			if (
				error.message.includes(
					"a background operation is currrently running"
				)
			)
				return;

			console.log(error.message);
		}
	}
}

module.exports = {
	setupDB() {
		beforeAll(() => {
			if (process.env.NODE_ENV !== "test") {
				console.log(
					"Not running in test mode (NODE_ENV != 'test'). Aborting."
				);
				process.exit(1);
			}
		});

		afterEach(async (done) => {
			await removeAllCollections();
			done();
		});

		afterAll(async (done) => {
			await dropAllCollections();
			mongoose.connection.close();
			done();
		});
	},
};
