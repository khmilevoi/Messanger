import React, { Component } from "react";
import DateFormatter from "../../DateFormatter";
import Logo from "../../Logo";

class Message extends Component {
    constructor(props) {
        super(props);

        this.state = {
            content_is_image: null,
            img: new Image(),
            is_checked: false
        };

        this.state.img.onerror = () => {
            this.setState({ content_is_image: false });
        };

        this.state.img.onload = () => {
            this.setState({ content_is_image: true });
        };
    }

    componentWillUpdate() {
        if (!this.state.is_checked) {
            this.checkImage(this.props.content);
        }
    }

    checkImage = url => {
        const img = this.state.img;

        img.src = url;

        this.setState({ is_checked: true });
    };

    render = () => {
        const { content, date_send, status, name, src, is_grouped } = this.props;

        const dateSend = DateFormatter(date_send);

        if (!is_grouped) {
            return (
                <div className={"message " + status}>
                    <Logo name={name} src={src} />
                    <div className="message__body">
                        <div className="message__author">{name}</div>
                        <div className="message__body_text">
                            {content}
                            <br />
                            {this.state.content_is_image ? <img alt={content} width="100%" src={content} /> : ""}
                        </div>
                    </div>
                    <div className="message__date">{`${dateSend.hours}:${dateSend.minutes}:${dateSend.seconds}`}</div>
                </div>
            );
        } else {
            return (
                <div className={"message grouped " + status}>
                    <Logo name={""} src={null} />
                    <div className="message__body">
                        <div className="message__body_text">
                            {content}
                            <br />
                            {this.state.content_is_image ? <img alt={content} width="100%" src={content} /> : ""}
                        </div>
                    </div>
                    <div className="message__date">{`${dateSend.hours}:${dateSend.minutes}:${dateSend.seconds}`}</div>
                </div>
            );
        }
    };
}

export default Message;
