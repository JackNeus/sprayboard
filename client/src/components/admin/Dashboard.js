import React, { Component } from "react";
import { currentUser } from "../../utils/auth";

import axios from "axios";
import { API_ROOT } from "../../config/api-config";

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    axios.get(`${API_ROOT}/users/${window.userData._id}`).then((res) => {
      this.setState({ user: res.data });
    });
    axios.get(`${API_ROOT}/users`).then((res) => {
      let userMap = res.data.users.reduce((map, user) => {
        map[user._id] = user;
        return map;
      }, {});
      this.setState({ users: userMap });
    });
  }

  handleNameChange = (e, id) => {
    let users = this.state.users;
    users[id].name = e.target.value;
    this.setState({ users: users });
  };

  commitNameChange = (e, id) => {
    let users = this.state.users;
    axios
      .put(`${API_ROOT}/users/${id}`, {
        name: users[id].name,
      })
      .then((res) => {
        if (res.data._id && res.data._id === id) {
          let users = this.state.users;
          users[id].name = res.data.name;
          let user = this.state.user;
          user.name = users[id].name;
          this.setState({ users: users, user: user });
        }
      });
  };

  handleChecked = (e, id) => {
    // Can't make yourself not an admin!
    if (id === this.state.user._id) {
      return;
    }
    axios
      .put(`${API_ROOT}/users/${id}`, {
        isAdmin: !this.state.users[id].isAdmin,
      })
      .then((res) => {
        if (res.data._id && res.data._id === id) {
          // Success
          let users = this.state.users;
          users[id].isAdmin = !users[id].isAdmin;
          this.setState({ users: users });
        }
      });
  };

  render() {
    return (
      <div style={{ height: "75vh" }} className="container valign-wrapper">
        <div className="row">
          <div className="col s12 center-align">
            <h4>Super Secret Admin Page.</h4>
            <p className="flow-text grey-text text-darken-1">
              Welcome{this.state.user ? `, ${this.state.user.name}` : ""}!
            </p>
          </div>
          <div className="col s12 center-align">
            <h4>User Management</h4>
            <div className="col s6">
              <table>
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Admin</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.users !== undefined &&
                    Object.values(this.state.users).map((user) => (
                      <tr key={user._id}>
                        <td>{user.email}</td>
                        <td>
                          <input
                            type="text"
                            value={user.name}
                            onChange={(e) => this.handleNameChange(e, user._id)}
                            onBlur={(e) => this.commitNameChange(e, user._id)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                this.commitNameChange(e, user._id);
                              }
                            }}
                          />
                        </td>
                        <td className="center-align">
                          <label>
                            <input
                              type="checkbox"
                              checked={user.isAdmin ? "checked" : ""}
                              onChange={(e) => this.handleChecked(e, user._id)}
                              disabled={
                                !this.state.user ||
                                (this.state.user &&
                                  this.state.user._id === user._id)
                                  ? "disabled"
                                  : ""
                              }
                            />
                            <span></span>
                          </label>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="col s6"></div>
          </div>
        </div>
      </div>
    );
  }
}
export default Dashboard;
