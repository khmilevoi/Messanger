import React, { Component } from "react";

import "../../styles/css/Chat.min.css";

import { connect } from "react-redux";
import Dialogs from "./Dialogs/Dialogs";
import History from "./History/History";
import Header from "./Header/Header";
import Modal from "../Modal";

class Chat extends Component {
    render() {
        if (this.props.app.state === "logout") {
            return <></>;
        }

        return (
            <div className="chat">
                <Header />
                <div className="content-wrapper">
                    <Dialogs />
                    <History />
                </div>
                <Modal />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    ...state
});

const mapDispatchToProps = dispatch => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Chat);
