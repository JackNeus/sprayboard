import axios from "axios";
import jwt_decode from "jwt-decode";

const loggedIn = () => {
	return localStorage.jwtToken !== undefined;
};

const handleLogin = (token) => {
	// Send token to localStorage
	localStorage.setItem("jwtToken", token);
	// Set token to Auth header
	if (token) {
		// Apply authorization token to every request if logged in
		axios.defaults.headers.common["Authorization"] = token;
	} else {
		// Delete auth header
		delete axios.defaults.headers.common["Authorization"];
	}
	// Decode token to get user data
	let decoded = jwt_decode(token);
	localStorage.setItem("userData", decoded);
	return decoded;
};

const handleLogout = () => {
	localStorage.removeItem("jwtToken");
	localStorage.removeItem("userData");
};

export { loggedIn, handleLogin, handleLogout };
