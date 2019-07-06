import React, { Component } from "react";

import { connect } from "react-redux";

import { closeModal } from "../../../store/Chat/actions";
import Logo from "../Logo";

import "../../../styles/css/ChangeProfile.min.css";

class ChangeProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: this.props.user.username,
      file: null
    };
  }

  fileHandler = event => {
    const file = event.target.files[0];

    this.setState({
      file
    });
  };

  nameHandler = event => {
    const name = event.target.value;

    this.setState({
      name
    });
  };

  sendChange = () => {
    console.log(this.state);
  };

  render() {
    return (
      <div className="change-profile">
        <div className="change-profile__head">
          <div className="change-profile__title">
            <div className="change-profile__button" onClick={this.props.closeModal}>
              Закрыть
            </div>
          </div>
          <div className="change-profile__profile">
            <div className="logo">
              <input type="file" name="logo" id="logo" className="login__form-input-file" onChange={this.fileHandler} />
              <label className="label_input-file" htmlFor="logo">
                <Logo src={this.props.user.logoSrc} name={this.props.user.username} />
              </label>
            </div>
            <div className="change-profile__name">
              <input type="text" name="name" id="name" value={this.state.name} onChange={this.nameHandler} />
              <button className="change-profile__name-send" onClick={this.sendChange}>
                save
              </button>
            </div>
          </div>
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
)(ChangeProfile);
