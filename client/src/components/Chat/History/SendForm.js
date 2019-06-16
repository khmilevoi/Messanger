import React, { Component } from "react";

import { connect } from "react-redux";
import Logo from "../Logo";
import { sendMessage } from "../../../store/Chat/actions";
import socket from "../../Socket";

class SendForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      input: true
    };
  }

  inputHandle = event => {
    if (this.state.input) {
      this.setState({
        content: event.target.value
      });
    }
  };

  keyHandler = event => {
    const key = event.key;

    if (key === "Enter" && !event.shiftKey) {
      this.setState({
        input: false
      });

      this.sendMessage();
    } else {
      this.setState({
        input: true
      });
    }
  };

  sendMessage = () => {
    const userId = this.props.user.userid;
    const userName = this.props.user.username;
    const chatId = this.props.app.dialogs.currentDialog.chatId;
    const content = this.state.content;

    this.setState({
      content: ""
    });

    this.props.sendMessage(socket, userId, userName, chatId, content);
  };

  render() {
    const currentDialog = this.props.app.dialogs.currentDialog;

    return (
      <div className="send-form-wrapper">
        <Logo
          className="left"
          name={this.props.user.username}
          src={this.props.user.logoSrc}
        />
        <div className="send-form">
          <textarea
            className="send-form__textarea"
            placeholder="Введите ваше сообщение..."
            onKeyDown={this.keyHandler}
            value={this.state.content}
            onChange={this.inputHandle}
          />
          <div className="send-form__button-wrapper">
            <button
              type="submit"
              className="send-form__button"
              onClick={this.sendMessage}
            >
              send
            </button>
          </div>
        </div>
        <Logo
          className="right"
          name={currentDialog.chatName}
          src={currentDialog.chatLogoSrc}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispath => ({
  sendMessage: (...args) => dispath(sendMessage(...args))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SendForm);
