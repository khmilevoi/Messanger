import React, { Component } from "react";

import { connect } from "react-redux";
import Logo from "../Logo";

import "../../../styles/css/DialogInformation.min.css";
import { closeModal } from "../../../store/Chat/actions";

class DialogInformation extends Component {
    renderUsers = () => {
        const users = this.props.app.dialogs.currentDialog.users;

        return users.map(val => {
            return (
                <div className="dialog-information__user" key={val.user_id}>
                    <Logo src={val.user_logo_src} name={val.user_name} />
                    <div className="name">{val.user_name}</div>
                </div>
            );
        });
    };

    render() {
        return (
            <div className="dialog-information">
                <div className="dialog-information__head">
                    <div className="dialog-information__title">
                        <div className="dialog-information__button">Изменить</div>
                        <div className="dialog-information__button" onClick={this.props.closeModal}>
                            Закрыть
                        </div>
                    </div>
                    <div className="dialog-information__profile">
                        <Logo src={this.props.app.dialogs.currentDialog.chatLogoSrc} name={this.props.app.dialogs.currentDialog.chatName} />
                        <div className="dialog-information__name-members">
                            <div className="name">{this.props.app.dialogs.currentDialog.chatName}</div>
                            <div className="members">{this.props.app.dialogs.currentDialog.users.length} уч.</div>
                        </div>
                    </div>
                </div>
                <div className="dialog-information__body">
                    <div className="dialog-information__functions" />
                    <div className="dialog-information__users">{this.renderUsers()}</div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    ...state
});

const mapDispachToProps = dispatch => ({
    closeModal: (...args) => dispatch(closeModal(...args))
});

export default connect(
    mapStateToProps,
    mapDispachToProps
)(DialogInformation);
