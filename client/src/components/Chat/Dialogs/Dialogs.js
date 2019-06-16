import React, { Component } from "react";
import Dialog from "./Dialog";

import { connect } from "react-redux";

import "../../../styles/css/Dialogs.min.css";
import {
  fetchDialogs,
  toggleActiveDialog,
  setSearchWord,
  readMessage
} from "../../../store/Chat/actions";
import socket from "../../Socket";

class Dialogs extends Component {
  renderDialogs = () => {
    const { dialogs } = this.props.app;

    if (dialogs.list === null) {
      return <></>;
    }

    const keys = Object.keys(dialogs.list);

    return keys
      .map((val, index) => (
        <Dialog
          chatName={dialogs.list[val].chatName}
          chatLogoSrc={dialogs.list[val].chatLogoSrc}
          firstMessage={dialogs.list[val].firstMessage}
          unreadCounter={dialogs.list[val].unreadCounter}
          dateSend={dialogs.list[val].dateSend}
          key={dialogs.list[val].chatId}
          active={dialogs.list[val] === this.props.app.dialogs.currentDialog}
          toggle={() => {
            this.props.toggleActiveDialog(dialogs.list[val]);
          }}
          read={() => {
            this.props.readMessage(
              socket,
              this.props.user.userid,
              dialogs.list[val].chatId
            );
          }}
        />
      ))
      .filter(val => {
        if (this.props.app.searchWord) {
          return (
            val.props.chatName
              .toUpperCase()
              .indexOf(this.props.app.searchWord.toUpperCase()) >= 0
          );
        }

        return true;
      })

      .sort((a, b) => new Date(b.props.dateSend) - new Date(a.props.dateSend));
  };

  searchHandler = event => {
    const word = event.target.value;

    this.props.setSearchWord(word);
  };

  render() {
    return (
      <div className="dialogs">
        <div className="dialogs__search">
          <input
            type="text"
            name="dialogs__search"
            id="dialogs__search"
            placeholder="Search"
            onChange={this.searchHandler}
          />
        </div>
        <div className="dialogs__inner">{this.renderDialogs()}</div>
      </div>
    );
  }
}

const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = dispatch => ({
  fetchDialogs: (...args) => dispatch(fetchDialogs(...args)),
  toggleActiveDialog: (...args) => dispatch(toggleActiveDialog(...args)),
  setSearchWord: (...args) => dispatch(setSearchWord(...args)),
  readMessage: (...args) => dispatch(readMessage(...args))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dialogs);
