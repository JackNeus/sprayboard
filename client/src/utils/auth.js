import axios from "axios";
import jwt_decode from "jwt-decode";

const isAdmin = () => {
	let user = currentUser();
	return user && user.isAdmin;
};

const currentUser = () => {
	if (localStorage.userData === undefined) {
		return undefined;
	}
	return JSON.parse(localStorage.userData);
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
	localStorage.setItem("userData", JSON.stringify(decoded));
	return decoded;
};

const handleLogout = () => {
	localStorage.removeItem("jwtToken");
	localStorage.removeItem("userData");
};

export { isAdmin, currentUser, handleLogin, handleLogout };
