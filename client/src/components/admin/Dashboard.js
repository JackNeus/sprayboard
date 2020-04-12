import React, { Component } from "react";
import { currentUser } from "../../utils/auth";

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      user: currentUser(),
    };
  }

  render() {
    return (
      <div style={{ height: "75vh" }} className="container valign-wrapper">
        <div className="row">
          <div className="col s12 center-align">
            <h4>Super Secret Admin Page.</h4>
            <p className="flow-text grey-text text-darken-1">
              Welcome, {this.state.user.name}!
            </p>
          </div>
        </div>
      </div>
    );
  }
}
export default Dashboard;
