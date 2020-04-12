import React from "react";
import { Redirect } from "react-router";
import { Route } from "react-router-dom";
import { currentUser, isAdmin } from "../../utils/auth";

const PrivateRoute = ({ component: Component, adminPage, ...rest }) => (
	// Redirect without an explanation if the user is logged in but not an admin.
	// They don't need an explanation!
	<Route
		{...rest}
		render={(props) =>
			currentUser() && ((adminPage && isAdmin()) || !adminPage) ? (
				<Component {...props} />
			) : (
				<Redirect to="/login" />
			)
		}
	/>
);

export default PrivateRoute;
