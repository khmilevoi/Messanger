import React, { Component } from "react";
import Logo from "../Logo";
import DateFormatter from "../DateFormatter";

class Dialog extends Component {
  render() {
    const {
      chatName,
      chatLogoSrc,
      firstMessage,
      unreadCounter,
      dateSend
    } = this.props;

    let parseDate = null;

    if (dateSend !== null) {
      parseDate = DateFormatter(dateSend);
    }

    return (
      <div
        className={"dialog" + (this.props.active ? " active" : "")}
        onClick={() => {
          this.props.toggle();
          this.props.read();
        }}
      >
        <Logo className="dialog__logo" name={chatName} src={chatLogoSrc} />
        <div className="dialog__message-wrapper">
          <div className="dialog__chat-name">{chatName}</div>
          {firstMessage ? (
            <div className="dialog__first-message">
              <span className="dialog__first-message__sender">
                {firstMessage.sender}
              </span>
              : {firstMessage.content}
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="dialog__meta-wrapper">
          <div className="dialog__date">
            {parseDate
              ? `${parseDate.hours}:${
                  parseDate.minutes / 10 < 1
                    ? "0" + parseDate.minutes
                    : parseDate.minutes
                }`
              : ""}
          </div>
          <div
            className={
              "dialog__unread-counter " + (unreadCounter ? "" : "disable")
            }
          >
            {unreadCounter}
          </div>
        </div>
      </div>
    );
  }
}

export default Dialog;
