import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";

import { handleLogin, handleLogout } from "./utils/auth";

import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";

// Check for token to keep user logged in
if (localStorage.jwtToken) {
	console.log("Found token, restoring session");
	let decoded = handleLogin(localStorage.jwtToken);

	// Check for expired token
	const currentTime = Date.now() / 1000;
	if (decoded.exp < currentTime) {
		handleLogout();

		console.log("Token expired, logging out");
		window.location.href = "./login";
	}
}

class App extends Component {
	render() {
		return (
			<Router>
				<div className="App">
					<Navbar />
					<Route exact path="/" component={Landing} />
					<Route exact path="/register" component={Register} />
					<Route exact path="/login" component={Login} />
				</div>
			</Router>
		);
	}
}

export default App;
