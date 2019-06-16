import React, { Component } from "react";

import "../../../styles/css/Header.min.css";

import { connect } from "react-redux";
import { getUsers, logoutInterface, showModal, setModal } from "../../../store/Chat/actions";
import AddDialog from "./AddDialog";
import socket from "../../Socket";
import DialogInformation from "./DialogInformation";

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dropdown: false
        };
    }

    showDropdown = () => {
        this.setState({
            dropdown: !this.state.dropdown
        });
    };

    render() {
        const { username } = this.props.user;

        let chatName = null;
        let amountOfUsers = null;

        if (this.props.app.dialogs.currentDialog) {
            chatName = this.props.app.dialogs.currentDialog.chatName;
            amountOfUsers = this.props.app.dialogs.currentDialog.users.length;
        }

        return (
            <div className="header">
                <div
                    className="header__left"
                    onClick={() => {
                        this.showDropdown();
                    }}
                >
                    <div className={"hamburger " + (this.state.dropdown ? "active" : "")}>
                        <span />
                        <span />
                        <span />
                    </div>
                    <div className="header__username">{username}</div>
                    <div className={"header__functions " + (this.state.dropdown ? "" : "hide")}>
                        <div
                            className="header__functions-item"
                            onClick={() => {
                                this.props.getUsers(socket);
                                this.props.setModal(<AddDialog />);
                                this.props.showModal();
                            }}
                        >
                            Новый чат
                        </div>
                        <div className="header__functions-item">Изменить профиль</div>
                        <div className="header__functions-item" onClick={this.props.logoutInterface}>
                            Выйти из профиля
                        </div>
                    </div>
                </div>
                <div
                    className="header__right"
                    style={{ display: chatName ? "flex" : "none" }}
                    onClick={() => {
                        this.props.setModal(<DialogInformation />);
                        this.props.showModal();
                    }}
                >
                    <div className="header__chat-name">{chatName}</div>
                    <div className="header__chat-users">{amountOfUsers} уч.</div>
                    <div className="header__online-counter">, 2 онлайн</div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    ...state
});

const mapDispachToProps = dispatch => ({
    getUsers: (...args) => dispatch(getUsers(...args)),
    logoutInterface: (...args) => dispatch(logoutInterface(...args)),
    setModal: (...args) => dispatch(setModal(...args)),
    showModal: (...args) => dispatch(showModal(...args))
});

export default connect(
    mapStateToProps,
    mapDispachToProps
)(Header);
