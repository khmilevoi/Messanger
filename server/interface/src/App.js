import React, { Component } from "react";
import socket, { config } from "./Socket";

import "./styles/css/App.min.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentDialog: null,
      dialogs: null,
      loadingDialogs: false
    };
  }

  fetchDialogs = () => {
    socket.emit("fetch_all_dialogs");

    this.setState({
      loadingDialogs: true
    });

    socket.on("fetch_all_dialogs_success", response => {
      this.setState({
        dialogs: response
      });

      this.setState({
        loadingDialogs: false
      });
    });
  };

  toggleCurrentDialog = dialog => {
    return () => {
      this.setState({
        currentDialog: dialog
      });
    };
  };

  renderDialogs = () => {
    if (this.state.loadingDialogs) {
      return <div className="loading">Loading...</div>;
    }

    if (this.state.dialogs === null) {
      return <></>;
    }

    const render = [];

    for (let key in this.state.dialogs) {
      const dialog = this.state.dialogs[key];

      render.push(
        <div className="dialog" key={dialog.chatId} onClick={this.toggleCurrentDialog(dialog)}>
          {dialog.chatLogoSrc ? (
            <img src={`http://${config.host}:${config.port}/Files/${dialog.chatLogoSrc}`} alt="logo" />
          ) : (
            <img alt="" />
          )}
          <div className="inf">
            <span>{dialog.chatId} </span>
            <span>{dialog.chatName}</span>
            <span>{dialog.messageCount}</span>
          </div>
        </div>
      );
    }

    return render;
  };

  renderHistory = () => {
    if (this.state.currentDialog === null) {
      return <></>;
    }

    return this.state.currentDialog.messages.map(val => {
      return (
        <div className="message">
          {val.logo_src ? <img src={`http://${config.host}:${config.port}/Files/${val.logo_src}`} alt="logo" /> : <img alt="" />}

          <div className="inf">
            <div className="name-date">
              {val.user_id} {val.user_name} {val.date_send}
            </div>
            <div className="content">{val.content}</div>
          </div>
        </div>
      );
    });
  };

  renderUsers = () => {
    if (this.state.currentDialog === null) {
      return <></>;
    }

    return this.state.currentDialog.users.map(val => {
      return (
        <div className="user" key={val.user_id}>
          {val.user_logo_src ? <img src={`http://${config.host}:${config.port}/Files/${val.user_logo_src}`} alt="logo" /> : <img alt="" />}

          <div className="inf">
            <span>{val.user_id}</span>
            <span>{val.user_name}</span>
          </div>
        </div>
      );
    });
  };

  render() {
    return (
      <div className="App">
        <div className="dialogs">
          <button onClick={this.fetchDialogs}>update</button>
          <div className="list">{this.renderDialogs()}</div>
        </div>
        <div className="history">{this.renderHistory()}</div>
        <div className="users">{this.renderUsers()}</div>
      </div>
    );
  }
}

export default App;
