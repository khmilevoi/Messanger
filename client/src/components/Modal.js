import React, { Component } from "react";

import { connect } from "react-redux";

import "../styles/css/Modal.min.css";
import { closeModal } from "../store/Chat/actions";

class Modal extends Component {
    render() {
        console.log(this.props);

        return (
            <div className={"modal " + (this.props.app.modal.show ? "show" : "")}>
                {this.props.app.modal.content}
                <div className="close" onClick={this.props.closeModal}>
                    <span />
                    <span />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    ...state
});

const mapDispatchToProps = dispatch => ({
    closeModal: (...args) => dispatch(closeModal(...args))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Modal);
