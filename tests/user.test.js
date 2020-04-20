const app = require("../server");
const supertest = require("supertest");
const request = supertest(app);
const { setupDB } = require("./test-setup.js");

setupDB();

describe("Register Test", () => {
	it("Success", async (done) => {
		request
			.post("/api/users/register")
			.send({
				name: "Bob",
				email: "bob@testing.com",
				password: "myPassword",
				password2: "myPassword",
			})
			.then((res) => {
				expect(res.status).toBe(200);
				expect(res.body.name).toBe("Bob");
				expect(res.body.email).toBe("bob@testing.com");
				done();
			});
	});
	it("Missing fields", async (done) => {
		request
			.post("/api/users/register")
			.send({})
			.then((res) => {
				expect(res.status).toBe(400);
				expect(res.body.name).toContain("required");
				expect(res.body.email).toContain("required");
				expect(res.body.password).toBeDefined();
				expect(res.body.password2).toBeDefined();
				done();
			});
	});
	it("Password Mismatch", async (done) => {
		request
			.post("/api/users/register")
			.send({
				name: "Bob",
				email: "bob@testing.com",
				password: "Password1",
				password2: "Password2",
			})
			.then((res) => {
				expect(res.status).toBe(400);
				expect(res.body.password2).toContain("must match");
				done();
			});
	});
});

describe("Register-Login Test", () => {
	let email = "bob@testing.com";
	let password = "myPassword";

	beforeEach(async (done) => {
		request
			.post("/api/users/register")
			.send({
				name: "Bob",
				email: email,
				password: password,
				password2: password,
			})
			.then((res) => {
				expect(res.status).toBe(200);
				done();
			});
	});

	it("Success", async (done) => {
		request
			.post("/api/users/login")
			.send({
				email: email,
				password: password,
			})
			.then((res) => {
				expect(res.status).toBe(200);
				expect(res.body.success).toBe(true);
				done();
			});
	});

	it("Incorrect Password", async (done) => {
		request
			.post("/api/users/login")
			.send({
				email: email,
				password: "badPassword",
			})
			.then((res) => {
				expect(res.status).toBe(400);
				expect(res.body.password).toContain("Incorrect password");
				done();
			});
	});
});

// TODO: Login test.
// TODO: Refactor bcrypt hashing into .save() so that we can seed the test DB with users (we can't fake the hashing or we won't be able to log in).
