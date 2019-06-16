import React, { Component } from "react";

import { connect } from "react-redux";
import Message from "./Message";

import { readMessage } from "../../../../store/Chat/actions";

class Messages extends Component {
    constructor(props) {
        super(props);

        this.state = {
            amountOfVisibleMessages: 50,
            firstVisibleMessage: 0,
            previousScrollTop: null
        };
    }

    renderMessages = () => {
        const currentMessages = this.props.app.dialogs.currentDialog.messages.slice(
            0,
            this.state.firstVisibleMessage + this.state.amountOfVisibleMessages
        );

        return currentMessages.map((val, index) => {
            let isGrouped = false;

            if (currentMessages[index + 1]) {
                isGrouped = currentMessages[index + 1].user_id === val.user_id;
            }

            return (
                <Message
                    key={val.message_id}
                    message_id={val.message_id}
                    content={val.content}
                    date_send={val.date_send}
                    status={val.status}
                    name={val.user_name}
                    src={val.logo_src}
                    is_grouped={isGrouped}
                />
            );
        });
    };

    scrollHandle = event => {
        const scrollTop = event.target.scrollTop;
        const height = event.target.clientHeight;

        this.setState({
            amountOfVisibleMessages: Math.floor(height / 40 + 5)
        });

        console.log(this.state.amountOfVisibleMessages, Math.floor(height / 40 + 5));

        if (scrollTop < height) {
            this.setState({
                firstVisibleMessage: this.state.firstVisibleMessage + 1
            });
        }

        if (this.state.previousScrollTop < scrollTop && scrollTop > height) {
            this.setState({
                firstVisibleMessage: this.state.firstVisibleMessage - 1
            });
        }

        this.setState({
            previousScrollTop: scrollTop
        });
    };

    render() {
        return (
            <div className="messages" onScroll={this.scrollHandle}>
                {this.renderMessages()}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    ...state
});

const mapDispatchToProps = dispatch => ({
    readMessage: (...args) => dispatch(readMessage(...args))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Messages);
