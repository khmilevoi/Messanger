import React, { Component } from "react";

import { connect } from "react-redux";

import "../../../styles/css/History.min.css";

import Messages from "./Messages/Messages";
import SendForm from "./SendForm";

class History extends Component {
  render() {
    if (this.props.app.dialogs.currentDialog === null) {
      return <></>;
    }

    return (
      <div className="history">
        <Messages />
        <SendForm />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state
});

export default connect(mapStateToProps)(History);
