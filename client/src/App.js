import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import PrivateRoute from "./components/auth/PrivateRoute";
import "./App.css";

import { currentUser, handleLogin, handleLogout } from "./utils/auth";

import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Dashboard from "./components/admin/Dashboard";

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
	constructor() {
		super();
		this.state = {
			currentUser: currentUser(),
		};

		this.updateCurrentUser = this.updateCurrentUser.bind(this);
	}

	// This gets passed to the Login component so that state can be updated
	// upon login.
	updateCurrentUser() {
		this.setState({
			currentUser: currentUser(),
		});
	}

	render() {
		return (
			<Router>
				<div className="App">
					<Navbar currentUser={this.state.currentUser} />
					<Route exact path="/" component={Landing} />
					<Route exact path="/register" component={Register} />
					<Route
						exact
						path="/login"
						render={(props) => (
							<Login
								{...props}
								updateAppState={this.updateCurrentUser}
							/>
						)}
					/>
					<PrivateRoute
						exact
						path="/dashboard"
						adminPage="true"
						component={Dashboard}
					/>
				</div>
			</Router>
		);
	}
}

export default App;
