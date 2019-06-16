import React, { Component } from "react";
import { addChat, closeModal } from "../../../store/Chat/actions";

import "../../../styles/css/AddDialog.min.css";

import { connect } from "react-redux";
import Logo from "../Logo";
import socket from "../../Socket";

import img from "../../../img/photo.jpg";

class AddDialog extends Component {
    constructor(props) {
        super(props);

        this.state = {
            file: null,
            dialogName: null,
            users: [this.props.user.userid],
            searchWord: null
        };
    }

    fileHandler = event => {
        const file = event.target.files[0];

        this.setState({
            file
        });
    };

    dialogNameHandler = event => {
        const dialogName = event.target.value;

        this.setState({
            dialogName
        });
    };

    searchHandler = event => {
        const searchWord = event.target.value ? event.target.value : null;

        this.setState({
            searchWord
        });
    };

    toggleUser = user => {
        const index = this.state.users.indexOf(user.user_id);

        const users = this.state.users;

        if (index >= 0) {
            users.splice(index, 1);
        } else {
            users.push(user.user_id);
        }

        this.setState({ users });
    };

    addDialog = () => {
        this.props.addChat(socket, this.state.dialogName, this.props.user.userid, this.state.users, this.state.file);
        this.props.closeModal();
    };

    renderItems = () => {
        const users = this.props.app.users;

        if (users) {
            return users
                .filter(val => {
                    if (val.user_id === this.props.user.userid) {
                        return false;
                    }

                    if (this.state.searchWord !== null) {
                        return val.user_name.toUpperCase().indexOf(this.state.searchWord.toUpperCase()) >= 0;
                    }

                    return true;
                })
                .map(val => {
                    return (
                        <div
                            className={"add-dialog__list-item " + (this.state.users.indexOf(val.user_id) >= 0 ? "active" : "")}
                            key={val.user_id}
                            onClick={() => this.toggleUser(val)}
                        >
                            <Logo name={val.user_name} src={val.user_logo_src} />
                            <div className="add-dialog__list-item__name">{val.user_name}</div>
                        </div>
                    );
                });
        } else {
            return <></>;
        }
    };

    render() {
        return (
            <div className="add-dialog">
                <div className="add-dialog__title">
                    <div className="add-dialog__title__name">Новая группа</div>
                    <div className="add-dialog__title__close" onClick={this.props.closeModal}>
                        Закрыть
                    </div>
                </div>
                <div className="add-dialog__name-foto">
                    <div className="add-dialog__foto-wrapper">
                        <input type="file" name="add-dialog__foto" id="add-dialog__foto" onChange={this.fileHandler} />
                        <label className="add-dialog__foto" htmlFor="add-dialog__foto">
                            <img src={img} alt="add-foto-icon" />{" "}
                        </label>
                        {this.state.file ? this.state.file.name : ""}
                    </div>
                    <div className="add-dialog__name">
                        <input
                            type="text"
                            name="add-dialog__name"
                            id="add-dialog__name"
                            placeholder="Имя диалога"
                            onChange={this.dialogNameHandler}
                        />
                    </div>
                </div>
                <div className="add-dialog__search">
                    <input
                        type="text"
                        name="add-dialog__search"
                        id="add-dialog__search"
                        placeholder="Search"
                        onChange={this.searchHandler}
                    />
                </div>
                <div className="add-dialog__list">{this.renderItems()}</div>
                <div className="add-dialog__add-form">
                    <button className="add-dialog__add" onClick={this.addDialog}>
                        Создать чат
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
    addChat: (...args) => dispatch(addChat(...args)),
    closeModal: (...args) => dispatch(closeModal(...args))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddDialog);
