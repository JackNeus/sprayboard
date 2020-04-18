const app = require("../server");
const supertest = require("supertest");
const request = supertest(app);
const { setupDB } = require("./test-setup.js");

setupDB();

describe("Register Test", () => {
	it("Succes", () => {
		request
			.post("/api/users/register")
			.send({
				name: "Bob",
				email: "bob@testing.com",
				password: "myPassword",
				password2: "myPassword",
			})
			.then((res) => {
				console.log(res.body);
				expect(res.status).toBe(200);
				expect(res.body.name).toBe("Bob");
				expect(res.body.email).toBe("bob@testing.com");
			});
	});
	it("Missing fields", () => {
		request
			.post("/api/users/register")
			.send({})
			.then((res) => {
				expect(res.status).toBe(400);
				expect(res.body.name).toContain("required");
				expect(res.body.email).toContain("required");
				expect(res.body.password).toBeDefined();
				expect(res.body.password2).toBeDefined();
			});
	});
	it("Password Mismatch", () => {
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
			});
	});
});

// TODO: Login test.
// TODO: Refactor bcrypt hashing into .save() so that we can seed the test DB with users (we can't fake the hashing or we won't be able to log in).
