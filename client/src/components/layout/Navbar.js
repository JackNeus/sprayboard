import React, { Component } from "react";
import { Link } from "react-router-dom";
import { loggedIn, handleLogout } from "../../utils/auth";

function logout(e) {
	handleLogout();
	window.location.href = "./";
}

class Navbar extends Component {
	render() {
		return (
			<div className="navbar-fixed">
				<nav className="z-depth-0">
					<div className="nav-wrapper white">
						<Link
							to="/"
							style={{
								fontFamily: "monospace",
							}}
							className="col s5 brand-logo center black-text"
						>
							<i className="material-icons">code</i>
							MERN
						</Link>

						{loggedIn() && (
							<div
								className="col s6 right black-text"
								style={{
									paddingRight: "10px",
								}}
							>
								<div
									className="btn waves-effect waves-light hoverable blue accent-3 align-middle"
									style={{
										borderRadius: "3px",
									}}
									onClick={logout}
								>
									Log Out
								</div>
							</div>
						)}
					</div>
				</nav>
			</div>
		);
	}
}

export default Navbar;
