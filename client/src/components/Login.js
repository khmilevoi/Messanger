import React, { Component } from "react";
import { fetchLogin } from "../store/Chat/actions";

import "../styles/css/Login.min.css";

import { connect } from "react-redux";
import socket from "./Socket";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      file: null,
      username: null
    };
  }

  componentWillMount() {
    this.checkCookies();
  }

  fileHandler = event => {
    const file = event.target.files[0];

    this.setState({
      file
    });
  };

  inputHandler = event => {
    this.setState({
      username: event.target.value
    });
  };

  login = () => {
    let { username, file } = this.state;

    this.props.fetchLogin(socket, username, file);
  };

  checkCookies = () => {
    const cookies = document.cookie;

    if (cookies === "") {
      console.log("cookies is empty");
      return;
    }

    const splitCookies = cookies.split(";");

    const cookiesStorage = {};

    splitCookies.forEach(val => {
      const cookie = val.split("=");

      cookiesStorage[cookie[0].trim()] = cookie[1].trim();
    });

    if (cookiesStorage["username"]) {
      this.setState({
        username: cookiesStorage["username"]
      });
    }
  };

  render() {
    if (this.props.app.state === "login") {
      return <></>;
    }

    return (
      <div className="login__wrapper">
        <div className="login__form">
          <div className="login__from-header">Введите ваш никнейм и выбирите аватарку</div>
          <input
            type="text"
            name="username"
            className="login__form-input"
            placeholder="username"
            value={this.state.username ? this.state.username : ""}
            onChange={this.inputHandler}
          />
          <div className="login__form-input-file_wrapper">
            <input type="file" name="logo" id="logo" className="login__form-input-file" onChange={this.fileHandler} />
            <label className="label_input-file" htmlFor="logo">
              Загрузить файл {this.state.file && this.state.file.name ? `(${this.state.file.name})` : ""}
            </label>
          </div>
          <button onClick={this.login} className="login__form-button">
            Войти
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  fetchLogin: (...args) => dispatch(fetchLogin(...args))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
